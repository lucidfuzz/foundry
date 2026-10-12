package io.github.lucidfuzz.foundry

import android.content.Context
import org.json.JSONObject
import java.io.File

/**
 * Halcyon Illustrated's settings file, filesDir/foundry/foundry-halcyon-<Name>.json: the same file the script's
 * hbSettings() reads and writes. On iPhone the allocation_setup and radio_setup modes fill it; here the app's setup
 * screens do, writing exactly the fields the script writes.
 */
object HalcyonSettings {
    fun file(ctx: Context, theme: ThemeInfo) = File(File(ctx.filesDir, "foundry").apply { mkdirs() }, theme.settingsFileName)

    /** Like hbSettings(): a missing, unreadable or non-object file reads as {}. */
    fun read(ctx: Context, theme: ThemeInfo): JSONObject {
        val f = file(ctx, theme)
        if (!f.isFile) return JSONObject()
        return try { JSONObject(f.readText()) } catch (e: Exception) { JSONObject() }
    }

    fun write(ctx: Context, theme: ThemeInfo, value: JSONObject) {
        val f = file(ctx, theme)
        val tmp = File(f.parentFile, ".${f.name}.tmp")
        tmp.writeText(value.toString())
        if (!tmp.renameTo(f)) { f.delete(); tmp.renameTo(f) }
    }

    /** The events allocation setup offers: timed, not yet over, one per title and calendar, soonest first (max 80). */
    fun allocationChoices(events: List<CalEvent>, now: Long): List<CalEvent> =
        events.filter { !it.allDay && it.end > now }
            .sortedBy { it.start }
            .distinctBy { it.title to it.calendarId }
            .take(80)

    /** Saves the chosen event the way hbChooseAllocation does: { match:'title', identifier, title, calendar }. */
    fun saveAllocation(ctx: Context, theme: ThemeInfo, e: CalEvent) {
        val s = read(ctx, theme)
        s.put("allocation", JSONObject().put("match", "title").put("identifier", e.id).put("title", e.title).put("calendar", e.calendarId))
        write(ctx, theme, s)
    }

    fun allocationTitle(ctx: Context, theme: ThemeInfo): String? =
        read(ctx, theme).optJSONObject("allocation")?.optString("title")?.takeIf { it.isNotEmpty() }

    const val DEFAULT_RADIO = "youtubemusic://"

    fun radio(ctx: Context, theme: ThemeInfo): String = read(ctx, theme).optString("radio").takeIf { it.isNotEmpty() } ?: DEFAULT_RADIO

    /** Same rule as hbChooseRadio: an http(s) link or an app link (scheme://), never javascript:. */
    fun validRadio(url: String): Boolean {
        val u = url.trim()
        return Regex("""^(https?://|[a-z][a-z0-9+.-]*://)""", RegexOption.IGNORE_CASE).containsMatchIn(u) &&
            !u.startsWith("javascript:", ignoreCase = true)
    }

    fun saveRadio(ctx: Context, theme: ThemeInfo, url: String): Boolean {
        if (!validRadio(url)) return false
        val s = read(ctx, theme)
        s.put("radio", url.trim())
        write(ctx, theme, s)
        return true
    }
}
