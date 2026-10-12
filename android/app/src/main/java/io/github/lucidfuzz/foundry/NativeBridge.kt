package io.github.lucidfuzz.foundry

import android.content.Context
import android.util.Base64
import android.webkit.JavascriptInterface
import org.json.JSONArray
import java.io.File

/**
 * window.FoundryNative: what foundry-runtime.js needs from the phone. All methods are synchronous (they run on the web
 * view's bridge thread). File paths must stay inside filesDir/foundry; anything else is refused. Widgets of the same theme
 * share this folder (game saves, settings, cached art), keyed by the script name the renderer passes.
 */
class NativeBridge(private val ctx: Context, private val renderer: Renderer) {
    private val root: File = File(ctx.filesDir, "foundry").apply { mkdirs() }
    private val rootPath: String = root.canonicalPath

    /** The canonical file for [path] when it is inside the Foundry folder, otherwise null. */
    private fun inside(path: String?): File? {
        if (path.isNullOrEmpty()) return null
        val f = try { File(path).canonicalFile } catch (e: Exception) { return null }
        return if (f.path == rootPath || f.path.startsWith(rootPath + File.separator)) f else null
    }

    private fun mustBeInside(path: String?): File =
        inside(path) ?: throw SecurityException("Foundry can only use files inside its own folder")

    @JavascriptInterface
    fun docsDir(): String { root.mkdirs(); return rootPath }

    @JavascriptInterface
    fun exists(path: String?): Boolean = inside(path)?.exists() == true

    @JavascriptInterface
    fun isDir(path: String?): Boolean = inside(path)?.isDirectory == true

    /** File bytes as base64, or "" when missing (scripts rely on missing files not being errors). */
    @JavascriptInterface
    fun readFile(path: String?): String {
        val f = inside(path) ?: return ""
        if (!f.isFile) return ""
        return try { Base64.encodeToString(f.readBytes(), Base64.NO_WRAP) } catch (e: Exception) { "" }
    }

    @JavascriptInterface
    fun writeFile(path: String?, base64: String?) {
        val f = mustBeInside(path)
        val bytes = if (base64.isNullOrEmpty()) ByteArray(0) else Base64.decode(base64, Base64.DEFAULT)
        // Scripts cache downloaded art as .png. If a download returned something else (a Wi-Fi sign-in page, an error
        // page), don't keep it: the script then downloads the art again next time instead of reusing a broken file.
        if (isImageName(f.name) && !looksLikeImage(bytes)) return
        f.parentFile?.mkdirs()
        // Write then rename, so a game save is never left half-written.
        val tmp = File(f.parentFile, ".${f.name}.tmp")
        tmp.writeBytes(bytes)
        if (!tmp.renameTo(f)) { f.delete(); if (!tmp.renameTo(f)) { f.writeBytes(bytes); tmp.delete() } }
    }

    private fun isImageName(name: String) = name.substringAfterLast('.', "").lowercase() in setOf("png", "jpg", "jpeg", "webp", "gif")

    @JavascriptInterface
    fun mkdir(path: String?) { mustBeInside(path).mkdirs() }

    @JavascriptInterface
    fun remove(path: String?) {
        val f = mustBeInside(path)
        if (f.path == rootPath) return
        f.deleteRecursively()
    }

    @JavascriptInterface
    fun list(path: String?): String {
        val names = inside(path)?.takeIf { it.isDirectory }?.list()?.filter { !it.startsWith(".") && !it.endsWith(".tmp") }?.sorted()
        return JSONArray(names ?: emptyList<String>()).toString()
    }

    @JavascriptInterface
    fun calendar(startMs: Double, endMs: Double): String = DeviceData.calendarJson(ctx, startMs.toLong(), endMs.toLong())

    @JavascriptInterface
    fun location(): String = LocationCache.json(ctx)

    @JavascriptInterface
    fun battery(): String = DeviceData.batteryJson(ctx)

    // ---- render jobs (see Renderer) ----

    /** The options for render job [id] as JSON: { script, family, param, scale, name }. */
    @JavascriptInterface
    fun job(id: String?): String = renderer.jobOptions(id ?: "")

    companion object {
        /** PNG, JPEG, GIF or WebP by their first bytes. */
        fun looksLikeImage(b: ByteArray): Boolean {
            fun at(i: Int) = if (i < b.size) b[i].toInt() and 0xFF else -1
            return (at(0) == 0x89 && at(1) == 0x50 && at(2) == 0x4E && at(3) == 0x47) ||
                (at(0) == 0xFF && at(1) == 0xD8 && at(2) == 0xFF) ||
                (at(0) == 0x47 && at(1) == 0x49 && at(2) == 0x46 && at(3) == 0x38) ||
                (at(0) == 0x52 && at(1) == 0x49 && at(2) == 0x46 && at(3) == 0x46 && at(8) == 0x57 && at(9) == 0x45 && at(10) == 0x42 && at(11) == 0x50)
        }
    }

    @JavascriptInterface
    fun result(id: String?, json: String?) = renderer.onResult(id ?: "", json, null)

    @JavascriptInterface
    fun error(id: String?, message: String?) = renderer.onResult(id ?: "", null, message ?: "Unknown error")
}
