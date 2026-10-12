package io.github.lucidfuzz.foundry

import android.content.Context
import org.json.JSONObject
import java.io.File

/** An imported theme: the exported widget script and what it offers. */
class Theme(val info: ThemeInfo, val script: String, val file: File)

/** Imported widget scripts live in filesDir/themes/<name>.js. */
object ThemeStore {
    private class Cached(val modified: Long, val length: Long, val theme: Theme)
    private val cache = HashMap<String, Cached>()

    private fun dir(ctx: Context) = File(ctx.filesDir, "themes").apply { mkdirs() }

    /** File names keep the theme's name, minus characters a file name can't hold. */
    private fun fileFor(ctx: Context, name: String) =
        File(dir(ctx), name.replace(Regex("""[\\/:*?"<>|\x00-\x1F]"""), "_").trim().ifEmpty { "Theme" } + ".js")

    /** Saves a script. Returns the theme, or null if the text isn't a Foundry widget script. */
    fun save(ctx: Context, script: String): Theme? {
        val text = script.replace("\r\n", "\n").trimStart('\uFEFF')
        val info = ScriptInfo.parse(text) ?: return null
        val file = fileFor(ctx, info.name)
        val tmp = File(file.parentFile, file.name + ".tmp")
        tmp.writeText(text)
        if (!tmp.renameTo(file)) { file.delete(); tmp.renameTo(file) }
        synchronized(cache) { cache.remove(file.path) }
        return load(file)
    }

    fun list(ctx: Context): List<Theme> =
        (dir(ctx).listFiles { f -> f.isFile && f.name.endsWith(".js") } ?: emptyArray())
            .mapNotNull { load(it) }
            .sortedBy { it.info.name.lowercase() }

    fun get(ctx: Context, name: String): Theme? = load(fileFor(ctx, name))?.takeIf { it.info.name == name }
        ?: list(ctx).firstOrNull { it.info.name == name }

    fun delete(ctx: Context, name: String) {
        get(ctx, name)?.file?.delete()
        synchronized(cache) { cache.clear() }
    }

    private fun load(file: File): Theme? {
        if (!file.isFile) return null
        synchronized(cache) {
            cache[file.path]?.let { if (it.modified == file.lastModified() && it.length == file.length()) return it.theme }
        }
        val text = try { file.readText() } catch (e: Exception) { return null }
        val info = ScriptInfo.parse(text) ?: return null
        val theme = Theme(info, text, file)
        synchronized(cache) { cache[file.path] = Cached(file.lastModified(), file.length(), theme) }
        return theme
    }
}

/** What each placed widget shows: which theme, which widget (mode) and which size. */
data class WidgetConfig(val theme: String, val mode: String, val family: Family)

/** Per-widget choices (SharedPreferences) and the last picture each widget showed (filesDir/widgets/<id>.png). */
object WidgetStore {
    private fun prefs(ctx: Context) = ctx.getSharedPreferences("foundry_widgets", Context.MODE_PRIVATE)

    fun get(ctx: Context, id: Int): WidgetConfig? {
        val raw = prefs(ctx).getString("w$id", null) ?: return null
        return try {
            val o = JSONObject(raw)
            WidgetConfig(o.getString("theme"), o.getString("mode"), Family.of(o.optString("family")) ?: Family.MEDIUM)
        } catch (e: Exception) { null }
    }

    fun put(ctx: Context, id: Int, c: WidgetConfig) {
        val o = JSONObject().put("theme", c.theme).put("mode", c.mode).put("family", c.family.key)
        prefs(ctx).edit().putString("w$id", o.toString()).apply()
    }

    fun remove(ctx: Context, id: Int) {
        prefs(ctx).edit().remove("w$id").remove("url$id").apply()
        imageFile(ctx, id).delete()
    }

    fun move(ctx: Context, from: Int, to: Int) {
        val p = prefs(ctx)
        val c = p.getString("w$from", null) ?: return
        p.edit().putString("w$to", c).putString("url$to", p.getString("url$from", null)).remove("w$from").remove("url$from").apply()
        imageFile(ctx, from).renameTo(imageFile(ctx, to))
    }

    fun imageFile(ctx: Context, id: Int) = File(File(ctx.filesDir, "widgets").apply { mkdirs() }, "$id.png")

    fun lastUrl(ctx: Context, id: Int): String? = prefs(ctx).getString("url$id", null)

    /** Keeps the latest good picture so a failed render (offline, timeout) can show it again. */
    fun saveImage(ctx: Context, id: Int, png: ByteArray, url: String?) {
        val f = imageFile(ctx, id)
        // A temp file of its own, renamed over the old picture in one step: the old one stays until the new one is whole.
        val tmp = File.createTempFile("$id-", ".tmp", f.parentFile)
        try {
            tmp.writeBytes(png)
            if (!tmp.renameTo(f)) return
        } finally {
            tmp.delete()
        }
        prefs(ctx).edit().putString("url$id", url).apply()
    }
}

/** Small app-wide values: the cached location fix. */
object AppState {
    fun prefs(ctx: Context) = ctx.getSharedPreferences("foundry_state", Context.MODE_PRIVATE)
}
