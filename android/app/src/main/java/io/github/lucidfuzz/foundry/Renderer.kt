package io.github.lucidfuzz.foundry

import android.annotation.SuppressLint
import android.content.Context
import android.net.Uri
import android.os.Handler
import android.os.Looper
import android.util.Base64
import android.webkit.RenderProcessGoneDetail
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import org.json.JSONObject
import java.util.ArrayDeque
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicInteger
import java.util.concurrent.atomic.AtomicReference

/** What to draw: the exported script, the widget size, the mode (widget parameter), pixel scale and theme name. */
data class RenderRequest(val script: String, val family: Family, val param: String, val scale: Double, val name: String) {
    fun toJson(): JSONObject = JSONObject().put("script", script).put("family", family.key).put("param", param)
        .put("scale", scale).put("name", name)
}

/** A tap target the script attached to part of the widget, with its box in widget points. */
data class LinkBox(val url: String, val x: Double, val y: Double, val w: Double, val h: Double)

/** The runtime's answer: { png, width, height, refreshAfter, url, links, ms, logs }. */
class RenderResult(
    val png: ByteArray, val width: Int, val height: Int, val refreshAfter: Long?, val url: String?,
    val links: List<LinkBox>, val ms: Long, val logs: List<String>,
) {
    companion object {
        fun parse(json: String): RenderResult {
            val o = JSONObject(json)
            val data = o.getString("png")
            val png = Base64.decode(data.substring(data.indexOf(',') + 1), Base64.DEFAULT)
            val links = ArrayList<LinkBox>()
            o.optJSONArray("links")?.let { a ->
                for (i in 0 until a.length()) {
                    val l = a.optJSONObject(i) ?: continue
                    val url = l.optString("url").takeIf { !l.isNull("url") && it.isNotEmpty() } ?: continue
                    val b = l.optJSONArray("box") ?: continue
                    links.add(LinkBox(url, b.optDouble(0), b.optDouble(1), b.optDouble(2), b.optDouble(3)))
                }
            }
            val logs = ArrayList<String>()
            o.optJSONArray("logs")?.let { a -> for (i in 0 until a.length()) logs.add(a.optString(i)) }
            return RenderResult(
                png, o.optInt("width"), o.optInt("height"),
                if (o.isNull("refreshAfter")) null else o.optDouble("refreshAfter").takeIf { !it.isNaN() }?.toLong(),
                if (o.isNull("url")) null else o.optString("url").takeIf { it.isNotEmpty() },
                links, o.optLong("ms"), logs,
            )
        }
    }
}

class RenderException(message: String) : Exception(message)

/**
 * One hidden web view, created on the main thread with the application context, that loads assets/runtime/index.html
 * (bundled fonts + foundry-runtime.js) and runs one render job at a time. evaluateJavascript can't wait for a promise, so the
 * page posts each result back through FoundryNative.result / FoundryNative.error.
 */
class Renderer private constructor(private val app: Context) {
    private class Job(val id: String, val request: RenderRequest, val tag: String?, val done: (RenderResult?, String?) -> Unit)

    private val main = Handler(Looper.getMainLooper())
    private val queue = ArrayDeque<Job>()
    private val options = ConcurrentHashMap<String, String>()
    private val counter = AtomicInteger()
    private var web: WebView? = null
    private var ready = false
    private var current: Job? = null
    private var timeout: Runnable? = null
    private val idleClose = Runnable { closeIfIdle() }

    companion object {
        const val PAGE = "https://appassets.androidplatform.net/assets/runtime/index.html"
        private const val ASSET_HOST = "appassets.androidplatform.net"
        private const val JOB_TIMEOUT_MS = 60_000L
        private const val IDLE_CLOSE_MS = 120_000L

        @Volatile private var instance: Renderer? = null
        fun get(ctx: Context): Renderer =
            instance ?: synchronized(this) { instance ?: Renderer(ctx.applicationContext).also { instance = it } }
    }

    /** Queues a render; [done] runs on the main thread with the result or an error message. */
    fun render(request: RenderRequest, tag: String? = null, done: (RenderResult?, String?) -> Unit) {
        val job = Job("j" + counter.incrementAndGet(), request, tag, done)
        main.post {
            queue.add(job)
            pump()
        }
    }

    /** Renders from a background thread (widget refresh workers) and waits for the picture. Never call on the main thread. */
    fun renderBlocking(request: RenderRequest, timeoutMs: Long = JOB_TIMEOUT_MS + 15_000): RenderResult {
        check(Looper.myLooper() != Looper.getMainLooper()) { "renderBlocking on the main thread" }
        val latch = CountDownLatch(1)
        val out = AtomicReference<RenderResult?>()
        val err = AtomicReference<String?>()
        render(request) { r, e -> out.set(r); err.set(e); latch.countDown() }
        if (!latch.await(timeoutMs, TimeUnit.MILLISECONDS)) throw RenderException("The widget took too long to draw")
        return out.get() ?: throw RenderException(err.get() ?: "The widget could not be drawn")
    }

    /** Drops queued (not yet started) jobs with this tag, e.g. previews for a screen the user has left. */
    fun cancel(tag: String) {
        main.post {
            val pending = queue.iterator()
            while (pending.hasNext()) { val j = pending.next(); if (j.tag == tag) { pending.remove(); j.done(null, "Cancelled") } }
        }
    }

    // ---- bridge callbacks (bridge thread) ----

    fun jobOptions(id: String): String = options[id] ?: "{}"

    fun onResult(id: String, json: String?, error: String?) {
        // Parse off the main thread; results can be a few megabytes.
        val parsed: RenderResult? = json?.let { try { RenderResult.parse(it) } catch (e: Exception) { null } }
        val message = error ?: if (parsed == null) "The widget picture could not be read" else null
        main.post { finish(id, parsed, message) }
    }

    // ---- main thread ----

    private fun pump() {
        main.removeCallbacks(idleClose)
        if (current != null) return
        if (queue.isEmpty()) { main.postDelayed(idleClose, IDLE_CLOSE_MS); return }
        val view = web ?: create() ?: run { failAll("Android System WebView is unavailable"); return }
        if (!ready) return
        val job = queue.poll() ?: return
        current = job
        options[job.id] = job.request.toJson().toString()
        val t = Runnable {
            // A stuck script: reload the page so it can't interfere with the next job, then give up on this one.
            reload()
            finish(job.id, null, "The widget took too long to draw")
        }
        timeout = t
        main.postDelayed(t, JOB_TIMEOUT_MS)
        view.evaluateJavascript("window.FoundryAndroid ? FoundryAndroid.render('${job.id}') : 'missing'") { v ->
            if (v == "\"missing\"" && current?.id == job.id) {
                reload()
                finish(job.id, null, "The Foundry runtime did not load")
            }
        }
    }

    private fun finish(id: String, result: RenderResult?, error: String?) {
        val job = current
        if (job == null || job.id != id) return // late answer from a job that already timed out
        options.remove(id)
        timeout?.let { main.removeCallbacks(it) }
        timeout = null
        current = null
        try { job.done(result, error) } catch (e: Exception) { }
        pump()
    }

    private fun failAll(message: String) {
        while (queue.isNotEmpty()) { val j = queue.poll() ?: break; try { j.done(null, message) } catch (e: Exception) { } }
    }

    @SuppressLint("SetJavaScriptEnabled", "JavascriptInterface")
    private fun create(): WebView? {
        val view = try { WebView(app) } catch (e: Exception) { return null }
        view.settings.apply {
            javaScriptEnabled = true
            allowFileAccess = false
            allowContentAccess = false
            cacheMode = WebSettings.LOAD_DEFAULT
            blockNetworkLoads = false
        }
        // Keep rendering when no screen of the app is open (widget refreshes run in the background).
        view.setRendererPriorityPolicy(WebView.RENDERER_PRIORITY_IMPORTANT, false)
        view.addJavascriptInterface(NativeBridge(app, this), "FoundryNative")
        view.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(v: WebView, request: WebResourceRequest): WebResourceResponse? =
                asset(request.url)

            override fun shouldOverrideUrlLoading(v: WebView, request: WebResourceRequest): Boolean = true

            override fun onPageFinished(v: WebView, url: String) {
                if (v !== web) return
                v.evaluateJavascript("!!(window.FoundryAndroid && window.FoundryRuntime)") { ok ->
                    if (v !== web) return@evaluateJavascript
                    ready = ok == "true"
                    if (ready) pump() else failAll("The Foundry runtime did not load")
                }
            }

            override fun onRenderProcessGone(v: WebView, detail: RenderProcessGoneDetail): Boolean {
                // The web view's process crashed or was killed: drop it, fail the job in flight, start fresh on the next one.
                if (v === web) {
                    web = null
                    ready = false
                    current?.let { finish(it.id, null, "The renderer stopped; it will retry on the next refresh") }
                }
                try { v.destroy() } catch (e: Exception) { }
                return true
            }
        }
        // Lay it out at a nominal size so the page behaves like a visible one.
        view.measure(
            android.view.View.MeasureSpec.makeMeasureSpec(400, android.view.View.MeasureSpec.EXACTLY),
            android.view.View.MeasureSpec.makeMeasureSpec(400, android.view.View.MeasureSpec.EXACTLY),
        )
        view.layout(0, 0, 400, 400)
        web = view
        ready = false
        view.loadUrl(PAGE)
        return view
    }

    private fun reload() {
        val v = web ?: return
        ready = false
        v.loadUrl(PAGE)
    }

    private fun closeIfIdle() {
        if (current != null || queue.isNotEmpty()) return
        web?.let { try { it.destroy() } catch (e: Exception) { } }
        web = null
        ready = false
    }

    /** Serves the bundled page, runtime and fonts from https://appassets.androidplatform.net/assets/... */
    private fun asset(url: Uri): WebResourceResponse? {
        if (url.host != ASSET_HOST) return null
        val path = url.path?.removePrefix("/assets/")?.takeIf { url.path?.startsWith("/assets/") == true && !it.contains("..") }
            ?: return WebResourceResponse("text/plain", "utf-8", 404, "Not Found", emptyMap(), null)
        return try {
            val stream = app.assets.open(path)
            val type = when (path.substringAfterLast('.')) {
                "html" -> "text/html"
                "js" -> "text/javascript"
                "css" -> "text/css"
                "woff2" -> "font/woff2"
                "woff" -> "font/woff"
                "ttf" -> "font/ttf"
                "json" -> "application/json"
                "png" -> "image/png"
                else -> "application/octet-stream"
            }
            val text = type.startsWith("text/") || type == "application/json"
            WebResourceResponse(type, if (text) "utf-8" else null, 200, "OK", mapOf("Access-Control-Allow-Origin" to "*"), stream)
        } catch (e: Exception) {
            WebResourceResponse("text/plain", "utf-8", 404, "Not Found", emptyMap(), null)
        }
    }
}
