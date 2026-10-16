package io.github.lucidfuzz.foundry.emulator

// Test-only helpers for the emulator acceptance run (see AcceptanceTest). Nothing here ships in the app.

import android.appwidget.AppWidgetHost
import android.appwidget.AppWidgetHostView
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProviderInfo
import android.content.ComponentName
import android.content.Context
import android.graphics.Bitmap
import android.graphics.Canvas
import android.os.Bundle
import android.os.ParcelFileDescriptor
import android.os.SystemClock
import android.view.View
import android.webkit.WebView
import android.widget.RemoteViews
import android.widget.TextView
import androidx.test.platform.app.InstrumentationRegistry
import io.github.lucidfuzz.foundry.Family
import io.github.lucidfuzz.foundry.FoundryWidgetProvider
import io.github.lucidfuzz.foundry.Renderer
import io.github.lucidfuzz.foundry.WidgetStore
import io.github.lucidfuzz.foundry.WidgetUpdater
import org.json.JSONArray
import org.json.JSONObject
import org.json.JSONTokener
import java.io.File
import java.io.FileOutputStream
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit
import kotlin.math.roundToInt

val instrumentation get() = InstrumentationRegistry.getInstrumentation()

/** Runs [block] on the main thread and returns its value. */
fun <T> onMain(block: () -> T): T {
    var out: Result<T>? = null
    instrumentation.runOnMainSync { out = runCatching(block) }
    return out!!.getOrThrow()
}

fun sleep(ms: Long) = SystemClock.sleep(ms)

/** Polls [check] until it is true or [timeoutMs] passes. Returns whether it became true. */
fun waitFor(timeoutMs: Long, stepMs: Long = 500, check: () -> Boolean): Boolean {
    val end = SystemClock.uptimeMillis() + timeoutMs
    while (true) {
        if (try { check() } catch (e: Exception) { false }) return true
        if (SystemClock.uptimeMillis() > end) return false
        sleep(stepMs)
    }
}

/**
 * Shell commands with the shell user's rights (pm, dumpsys, cmd, content, run-as, logcat). The script is fed to `sh`
 * on stdin, so quoting and pipes work as in a terminal; stderr is merged into the output.
 */
object Shell {
    fun run(script: String): String {
        val fds = instrumentation.uiAutomation.executeShellCommandRw("sh")
        ParcelFileDescriptor.AutoCloseOutputStream(fds[1]).use { it.write(("exec 2>&1\n$script\nexit\n").toByteArray()) }
        return ParcelFileDescriptor.AutoCloseInputStream(fds[0]).use { String(it.readBytes()) }.trim()
    }
}

/** Where screenshots and results.json go; the workflow pulls this folder into the emulator-results artifact. */
class Evidence(ctx: Context) {
    val dir: File = (ctx.getExternalFilesDir("emulator-results") ?: File(ctx.filesDir, "emulator-results")).apply {
        deleteRecursively(); mkdirs()
    }
    val results = JSONObject().put("startedAt", System.currentTimeMillis()).put("tests", JSONObject()).put("log", JSONArray())

    fun file(name: String) = File(dir, name)

    fun savePng(name: String, bmp: Bitmap): String {
        FileOutputStream(file(name)).use { bmp.compress(Bitmap.CompressFormat.PNG, 100, it) }
        return name
    }

    fun log(msg: String) {
        android.util.Log.i("FoundryEmulatorTest", msg)
        results.getJSONArray("log").put("${System.currentTimeMillis()} $msg")
    }

    fun test(key: String): JSONObject {
        val tests = results.getJSONObject("tests")
        if (!tests.has(key)) tests.put(key, JSONObject().put("status", "not-run").put("checks", JSONArray()).put("images", JSONArray()))
        return tests.getJSONObject(key)
    }

    /** One named check in a test's section: passed (true), failed (false) or needs a person to judge (null). */
    fun check(key: String, name: String, ok: Boolean?, detail: String): Boolean? {
        test(key).getJSONArray("checks").put(JSONObject().put("name", name).put("ok", ok ?: JSONObject.NULL).put("detail", detail))
        log("[$key] ${when (ok) { true -> "OK  "; false -> "FAIL"; null -> "LOOK" }} $name: $detail")
        return ok
    }

    /** A note in a test's section (what was done, which route was used); not a check. */
    fun note(key: String, text: String) {
        val t = test(key)
        if (!t.has("notes")) t.put("notes", JSONArray())
        t.getJSONArray("notes").put(text)
        log("[$key] note: $text")
    }

    fun image(key: String, name: String, caption: String) {
        test(key).getJSONArray("images").put(JSONObject().put("file", name).put("caption", caption))
    }

    /** Written after every step, so a crash part-way still leaves everything gathered so far. */
    fun flush() {
        results.put("updatedAt", System.currentTimeMillis())
        file("results.json").writeText(results.toString(2))
    }
}

/**
 * A stand-in home screen: an AppWidgetHost in the test that binds Foundry's real FoundryWidgetProvider (allowed by
 * `appwidget grantbind`), so the app's own refresh code, Renderer and RemoteViews draw into it. Each bound widget gets the
 * size a launcher would report for that family, and is "screenshotted" by drawing its AppWidgetHostView.
 */
class WidgetBench(private val ctx: Context) {
    class TrackingView(c: Context) : AppWidgetHostView(c) {
        @Volatile var updates = 0
        @Volatile var lastUpdate = 0L
        override fun updateAppWidget(remoteViews: RemoteViews?) {
            super.updateAppWidget(remoteViews)
            updates++
            lastUpdate = System.currentTimeMillis()
        }
    }

    val provider = ComponentName(ctx, FoundryWidgetProvider::class.java)
    private val mgr = AppWidgetManager.getInstance(ctx)
    private val views = ConcurrentHashMap<Int, TrackingView>()
    private val families = ConcurrentHashMap<Int, Family>()
    private lateinit var host: AppWidgetHost

    fun start() = onMain {
        host = object : AppWidgetHost(ctx, HOST_ID) {
            override fun onCreateView(context: Context, appWidgetId: Int, appWidget: AppWidgetProviderInfo?): AppWidgetHostView =
                TrackingView(context)
        }
        host.startListening()
    }

    fun stop() = onMain { try { host.stopListening() } catch (e: Exception) { } }

    /** Launcher-like size in dp for each family (the design size in points; a 2x2 / 4x2 / 4x4 home-screen cell block). */
    fun dp(f: Family): Pair<Int, Int> = f.designWidth to f.designHeight

    fun bind(f: Family): Int {
        val id = host.allocateAppWidgetId()
        val (w, h) = dp(f)
        val opts = Bundle().apply {
            putInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, w)
            putInt(AppWidgetManager.OPTION_APPWIDGET_MAX_WIDTH, w)
            putInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT, h)
            putInt(AppWidgetManager.OPTION_APPWIDGET_MAX_HEIGHT, h)
        }
        check(mgr.bindAppWidgetIdIfAllowed(id, provider, opts)) { "bindAppWidgetIdIfAllowed refused widget $id (is appwidget grantbind set?)" }
        families[id] = f
        onMain { views[id] = host.createView(ctx, id, mgr.getAppWidgetInfo(id)) as TrackingView }
        return id
    }

    fun lastUpdate(id: Int): Long = views[id]?.lastUpdate ?: 0L

    /** True when the widget shows a picture (not the "drawing" / "needs setup" message). */
    fun showsPicture(id: Int): Boolean = onMain {
        val v = views[id] ?: return@onMain false
        v.findViewById<View>(resId("widget_image", "id"))?.visibility == View.VISIBLE
    }

    fun message(id: Int): String? = onMain {
        val v = views[id] ?: return@onMain null
        val t = v.findViewById<TextView>(resId("widget_message", "id"))
        if (t != null && t.visibility == View.VISIBLE) t.text?.toString() else null
    }

    /** Waits for an update delivered after [since] that shows a picture. */
    fun waitForPicture(id: Int, since: Long, timeoutMs: Long): Boolean =
        waitFor(timeoutMs) { lastUpdate(id) >= since && showsPicture(id) }

    /** Draws the widget as the host shows it, on a neutral home-screen backdrop, at the device's pixel density. */
    fun capture(id: Int): Bitmap = onMain {
        val v = views.getValue(id)
        val (wDp, hDp) = dp(families.getValue(id))
        val d = ctx.resources.displayMetrics.density
        val w = (wDp * d).roundToInt()
        val h = (hDp * d).roundToInt()
        v.measure(View.MeasureSpec.makeMeasureSpec(w, View.MeasureSpec.EXACTLY), View.MeasureSpec.makeMeasureSpec(h, View.MeasureSpec.EXACTLY))
        v.layout(0, 0, w, h)
        val pad = (12 * d).roundToInt()
        val bmp = Bitmap.createBitmap(w + 2 * pad, h + 2 * pad, Bitmap.Config.ARGB_8888)
        val c = Canvas(bmp)
        c.drawColor(0xFF3A4150.toInt())
        c.translate(pad.toFloat(), pad.toFloat())
        v.draw(c)
        bmp
    }

    /** The picture the app keeps for this widget; its time changes only when a render succeeded. */
    fun imageTime(id: Int): Long = WidgetStore.imageFile(ctx, id).let { if (it.isFile) it.lastModified() else 0L }

    fun resId(name: String, type: String): Int =
        ctx.resources.getIdentifier(name, type, ctx.packageName).takeIf { it != 0 }
            ?: ctx.resources.getIdentifier(name, type, "io.github.lucidfuzz.foundry")

    companion object {
        const val HOST_ID = 0xF0D7
    }
}

/**
 * Reads what a widget drew as text. The app's renderer is one hidden WebView; this patches the page's canvas fillText
 * so each render's strings can be collected (test-only, through reflection; the app is unchanged). The page is
 * recreated after two idle minutes, so [ensure] re-applies the patch before each use.
 */
class TextProbe(private val ctx: Context) {
    private val renderer get() = Renderer.get(ctx)

    private fun field(name: String) = Renderer::class.java.getDeclaredField(name).apply { isAccessible = true }

    private fun web(): WebView? = field("web").get(renderer) as WebView?
    private fun ready(): Boolean = field("ready").getBoolean(renderer)

    /** No job running or queued. */
    fun idle(): Boolean = onMain {
        field("current").get(renderer) == null && (field("queue").get(renderer) as Collection<*>).isEmpty()
    }

    private fun eval(js: String): String? {
        val latch = CountDownLatch(1)
        var out: String? = null
        val started = onMain {
            val w = if (ready()) web() else null
            w?.evaluateJavascript(js) { v -> out = v; latch.countDown() }
            w != null
        }
        if (!started) return null
        latch.await(10, TimeUnit.SECONDS)
        return out
    }

    /** Makes sure the renderer page is up (warming it with [warm] if not) and patched. Returns false if it couldn't. */
    fun ensure(warm: () -> Unit): Boolean {
        if (!onMain { ready() && web() != null }) {
            try { warm() } catch (e: Exception) { }
            waitFor(30_000) { onMain { ready() && web() != null } }
        }
        val r = eval(PATCH) ?: return false
        return r.contains("new") || r.contains("had")
    }

    fun clear() { eval("window.__fx = window.__fx ? [] : window.__fx; 1") }

    /** Strings drawn since [clear], or null if the page was replaced meanwhile (the patch is then gone). */
    fun read(): List<String>? {
        val raw = eval("JSON.stringify(window.__fx || null)") ?: return null
        val s = try { JSONTokener(raw).nextValue() as? String } catch (e: Exception) { null } ?: return null
        if (s == "null") return null
        val a = JSONArray(s)
        return (0 until a.length()).map { a.optString(it) }
    }

    companion object {
        private val PATCH = """
            (function () {
              if (window.__fxOn) return 'had';
              window.__fxOn = true; window.__fx = [];
              [window.CanvasRenderingContext2D, window.OffscreenCanvasRenderingContext2D].forEach(function (C) {
                if (!C) return;
                var f = C.prototype.fillText;
                C.prototype.fillText = function (t) {
                  try { if (window.__fx) { window.__fx.push(String(t)); if (window.__fx.length > 6000) window.__fx.splice(0, 2000); } } catch (e) {}
                  return f.apply(this, arguments);
                };
              });
              return 'new';
            })()
        """.trimIndent()
    }
}

/** Refreshes one widget through the app's real refresh path (WidgetUpdater.refresh, as RefreshWorker does) and records it. */
class Refresher(private val ctx: Context, private val bench: WidgetBench, private val probe: TextProbe, private val warm: () -> Unit) {
    class Outcome(val fresh: Boolean, val picture: Boolean, val texts: List<String>?, val ms: Long, val message: String?)

    fun refresh(id: Int): Outcome {
        val beforeImage = bench.imageTime(id)
        val t0 = System.currentTimeMillis()
        var texts: List<String>? = null
        // Holding WidgetUpdater's own lock (the one its refresh takes) keeps background refresh passes from drawing
        // other widgets into the probe while this one renders.
        synchronized(WidgetUpdater) {
            waitFor(30_000) { probe.idle() }
            val probing = probe.ensure(warm)
            if (probing) probe.clear()
            WidgetUpdater.refresh(ctx, id)
            if (probing) texts = probe.read()
        }
        val ms = System.currentTimeMillis() - t0
        val picture = bench.waitForPicture(id, t0, 15_000)
        return Outcome(bench.imageTime(id) > beforeImage, picture, texts, ms, if (picture) null else bench.message(id))
    }
}
