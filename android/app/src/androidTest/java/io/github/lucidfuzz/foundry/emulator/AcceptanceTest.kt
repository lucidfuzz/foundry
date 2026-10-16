package io.github.lucidfuzz.foundry.emulator

import android.appwidget.AppWidgetManager
import android.content.ContentValues
import android.content.Context
import android.content.Intent
import android.net.ConnectivityManager
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.os.StrictMode
import android.provider.CalendarContract
import android.provider.MediaStore
import android.webkit.WebView
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.uiautomator.By
import androidx.test.uiautomator.BySelector
import androidx.test.uiautomator.UiDevice
import androidx.test.uiautomator.UiObject2
import androidx.test.uiautomator.UiScrollable
import androidx.test.uiautomator.UiSelector
import androidx.test.uiautomator.Until
import androidx.work.WorkInfo
import androidx.work.WorkManager
import androidx.work.WorkQuery
import io.github.lucidfuzz.foundry.AppState
import io.github.lucidfuzz.foundry.DeviceData
import io.github.lucidfuzz.foundry.Family
import io.github.lucidfuzz.foundry.LocationCache
import io.github.lucidfuzz.foundry.MainActivity
import io.github.lucidfuzz.foundry.Mode
import io.github.lucidfuzz.foundry.Refresh
import io.github.lucidfuzz.foundry.RenderRequest
import io.github.lucidfuzz.foundry.Renderer
import io.github.lucidfuzz.foundry.Theme
import io.github.lucidfuzz.foundry.ThemeStore
import io.github.lucidfuzz.foundry.WidgetConfig
import io.github.lucidfuzz.foundry.WidgetConfigActivity
import io.github.lucidfuzz.foundry.WidgetStore
import io.github.lucidfuzz.foundry.WidgetUpdater
import org.json.JSONArray
import org.json.JSONObject
import org.junit.Test
import org.junit.runner.RunWith
import java.io.File
import java.security.MessageDigest
import java.util.TimeZone
import java.util.regex.Pattern

/**
 * Foundry's acceptance tests 2-6 (android/SPEC.md) on an emulator, run by the "emulator-tests" job in
 * .github/workflows/android.yml. It runs inside the installed Foundry debug app (instrumentation), binds Foundry's real
 * widget provider to a test AppWidgetHost, imports the real website exports, and records evidence (screenshots and
 * results.json) for android/scripts/emulator_report.py, which writes REPORT.md.
 *
 * A failed acceptance check is recorded, not thrown: the run always continues to the end so the report covers every
 * test. Order: 2, 5, 3, 4, 6 (test 5 picks the event that starts 10 minutes after setup, so it runs early).
 */
@RunWith(AndroidJUnit4::class)
class AcceptanceTest {
    private val ctx: Context = instrumentation.targetContext
    private val pkg: String = ctx.packageName
    private val device: UiDevice = UiDevice.getInstance(instrumentation)
    private lateinit var ev: Evidence
    private lateinit var bench: WidgetBench
    private lateinit var probe: TextProbe
    private lateinit var refresher: Refresher

    private val illustrated = "Halcyon Biofab Illustrated"
    private val original = "Halcyon Biofab"
    private val t2Modes = listOf("status", "shift", "solar", "game", "tracker", "dossier")
    private val widgets = LinkedHashMap<String, Int>() // "<mode>_<size>" -> widget id (test 2's widgets)

    private class CalEv(val title: String, val start: Long, val end: Long) { var id = ""; var calendarId = "" }
    private var events: List<CalEv> = emptyList()
    private var calendarId = ""

    private val minute = 60_000L
    /** Unplugged at 68%. The emulator keeps reporting "charging" after `unplug` alone, so the status is set too. */
    private val UNPLUGGED = "dumpsys battery set level 68; dumpsys battery unplug; dumpsys battery set status 3"
    private val radioUrl = "https://example.com/halcyon-radio"

    @Test
    fun acceptance() {
        ev = Evidence(ctx)
        bench = WidgetBench(ctx)
        probe = TextProbe(ctx)
        refresher = Refresher(ctx, bench, probe) { warm() }
        section("setup") { setup() }
        section("t2") { test2() }
        section("t5") { test5() }
        section("t3") { test3() }
        section("t4") { test4() }
        section("t6") { test6() }
        ev.results.put("finishedAt", System.currentTimeMillis())
        ev.flush()
        try { bench.stop() } catch (e: Exception) { }
    }

    /** Runs one section; its status comes from its checks (any fail -> fail, any unknown -> needs-human). */
    private fun section(key: String, body: () -> Unit) {
        val t = ev.test(key).put("status", "running").put("startedAt", System.currentTimeMillis())
        ev.flush()
        try {
            body()
        } catch (e: Throwable) {
            t.put("error", android.util.Log.getStackTraceString(e).take(4000))
            ev.check(key, "section ran to the end", false, e.toString())
        }
        val checks = t.getJSONArray("checks")
        val results = (0 until checks.length()).map { checks.getJSONObject(it).opt("ok") }
        t.put("status", when {
            results.any { it == false } -> "fail"
            results.any { it == JSONObject.NULL } -> "needs-human"
            else -> t.optString("verdict", "pass")
        })
        t.put("finishedAt", System.currentTimeMillis())
        ev.flush()
    }

    // ---------------------------------------------------------------- setup

    private fun setup() {
        val k = "setup"
        ev.results.put("device", JSONObject()
            .put("sdk", Build.VERSION.SDK_INT).put("release", Build.VERSION.RELEASE).put("model", Build.MODEL)
            .put("fingerprint", Build.FINGERPRINT)
            .put("webview", WebView.getCurrentWebViewPackage()?.let { "${it.packageName} ${it.versionName}" } ?: "unknown")
            .put("app", "${pkg} ${ctx.packageManager.getPackageInfo(pkg, 0).versionName}")
            .put("density", ctx.resources.displayMetrics.density.toDouble())
            .put("screen", "${ctx.resources.displayMetrics.widthPixels}x${ctx.resources.displayMetrics.heightPixels}")
            .put("timezone", TimeZone.getDefault().id))

        ev.check(k, "READ_CALENDAR granted with pm grant", DeviceData.hasCalendar(ctx), "checkSelfPermission")
        ev.check(k, "ACCESS_COARSE_LOCATION granted with pm grant", DeviceData.hasLocation(ctx), "checkSelfPermission")
        ensureBattery(k)

        setupCalendar(k)
        setupLocation(k)
        device.pressHome()
        bench.start()
        ev.note(k, "Widget host: a test AppWidgetHost (id ${WidgetBench.HOST_ID}) in the Foundry process binds Foundry's real " +
            "FoundryWidgetProvider; bindAppWidgetIdIfAllowed is allowed by 'appwidget grantbind'.")
    }

    /** Battery at 68% and unplugged (set by the workflow with dumpsys battery; re-applied here if it drifted). */
    private fun ensureBattery(k: String) {
        var b = DeviceData.battery(ctx)
        if (Math.round(b.level * 100) != 68L || b.charging) {
            Shell.run(UNPLUGGED)
            waitFor(10_000) { DeviceData.battery(ctx).let { Math.round(it.level * 100) == 68L && !it.charging } }
            b = DeviceData.battery(ctx)
        }
        ev.check(k, "battery 68% and unplugged", Math.round(b.level * 100) == 68L && !b.charging,
            "app reads level ${Math.round(b.level * 100)}%, charging=${b.charging}")
    }

    private fun setupCalendar(k: String) {
        val acct = "foundry-emulator"
        val tz = TimeZone.getDefault().id
        val now = System.currentTimeMillis()
        val base = now - now % minute
        events = listOf(
            CalEv("Allocation review", base + 10 * minute, base + 20 * minute),
            CalEv("Specimen intake", base + 60 * minute, base + 90 * minute),
        )
        val out = StringBuilder()
        out.append(Shell.run(
            "content insert --uri 'content://com.android.calendar/calendars?caller_is_syncadapter=true&account_name=$acct&account_type=LOCAL' " +
                "--bind account_name:s:$acct --bind account_type:s:LOCAL --bind name:s:$acct " +
                "--bind calendar_displayName:s:'Foundry Test' --bind calendar_color:i:-11751600 --bind calendar_access_level:i:700 " +
                "--bind ownerAccount:s:$acct --bind visible:i:1 --bind sync_events:i:1 --bind calendar_timezone:s:$tz"))
        calendarId = queryCalendarId(acct) ?: ""
        if (calendarId.isNotEmpty()) for (e in events) {
            out.append(Shell.run(
                "content insert --uri content://com.android.calendar/events --bind calendar_id:l:$calendarId " +
                    "--bind title:s:'${e.title}' --bind dtstart:l:${e.start} --bind dtend:l:${e.end} --bind eventTimezone:s:$tz --bind hasAlarm:i:0"))
        }
        ev.note(k, "Calendar: local calendar 'Foundry Test' (account $acct, LOCAL) and two events inserted through the calendar " +
            "content provider with the shell's 'content insert'." + if (out.isNotBlank()) " Output: ${out.toString().take(400)}" else "")
        // Read back the ids the provider gave the events (as the app's DeviceData reports them: the series id).
        ctx.contentResolver.query(CalendarContract.Events.CONTENT_URI, arrayOf(CalendarContract.Events._ID, CalendarContract.Events.TITLE),
            "${CalendarContract.Events.CALENDAR_ID} = ?", arrayOf(calendarId), null)?.use { c ->
            while (c.moveToNext()) events.firstOrNull { it.title == c.getString(1) }?.let { it.id = c.getLong(0).toString(); it.calendarId = calendarId }
        }
        val seen = try { DeviceData.calendar(ctx, now, now + 3 * 60 * minute) } catch (e: Exception) { emptyList() }
        val fmt = java.text.SimpleDateFormat("HH:mm z", java.util.Locale.US)
        ev.test(k).put("calendar", JSONObject().put("calendarId", calendarId).put("events", JSONArray(events.map {
            JSONObject().put("title", it.title).put("start", it.start).put("end", it.end).put("id", it.id)
                .put("local", fmt.format(java.util.Date(it.start)) + " to " + fmt.format(java.util.Date(it.end)))
        })))
        ev.check(k, "calendar events visible to the app (DeviceData.calendar)",
            events.all { e -> seen.any { it.title == e.title && it.start == e.start && it.end == e.end } },
            "calendar id '$calendarId'; app sees: " + seen.joinToString { "${it.title} @ ${fmt.format(java.util.Date(it.start))} (id ${it.id}, calendar ${it.calendarId})" })
    }

    private fun queryCalendarId(acct: String): String? =
        ctx.contentResolver.query(CalendarContract.Calendars.CONTENT_URI, arrayOf(CalendarContract.Calendars._ID),
            "${CalendarContract.Calendars.ACCOUNT_NAME} = ?", arrayOf(acct), null)?.use { c -> if (c.moveToFirst()) c.getLong(0).toString() else null }

    private fun setupLocation(k: String) {
        val prefs = AppState.prefs(ctx)
        openApp() // opening the app asks for a fresh fix (MainActivity.onStart)
        var route = "emulator geo fix (adb emu geo fix -74.0060 40.7128), read by the app's LocationCache"
        var got = false
        for (i in 0 until 6) {
            onMain { LocationCache.requestFresh(ctx) }
            if (waitFor(10_000) { prefs.contains("lat") }) { got = true; break }
        }
        if (!got) {
            // geo fix only reaches apps while the GPS is active; a test location provider sets the last known fix directly.
            ev.note(k, "No fix from geo fix after 60 s; adding a test location provider for New York.")
            Shell.run("appops set com.android.shell android:mock_location allow\n" +
                "for p in gps network fused; do cmd location providers add-test-provider \$p; " +
                "cmd location providers set-test-provider-enabled \$p true; " +
                "cmd location providers set-test-provider-location \$p --location 40.7128,-74.0060 --accuracy 100; done")
            route = "test location provider (cmd location providers set-test-provider-location), because geo fix didn't reach the app"
            for (i in 0 until 4) {
                onMain { LocationCache.requestFresh(ctx) }
                if (waitFor(10_000) { prefs.contains("lat") }) { got = true; break }
            }
        }
        val lat = prefs.getFloat("lat", 0f).toDouble()
        val lon = prefs.getFloat("lon", 0f).toDouble()
        ev.test(k).put("location", JSONObject().put("route", route).put("cached", LocationCache.json(ctx)))
        ev.check(k, "app has a New York location fix", got && Math.abs(lat - 40.7128) < 0.5 && Math.abs(lon + 74.006) < 0.5,
            "cached ${LocationCache.json(ctx)} via $route")
    }

    // ---------------------------------------------------------------- shared steps

    private fun openApp(configure: (Intent) -> Unit = {}) {
        val i = Intent(ctx, MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
        configure(i)
        ctx.startActivity(i)
        device.waitForIdle()
        sleep(1500)
    }

    private fun str(name: String): String = ctx.getString(bench.resId(name, "string"))

    private fun find(sel: BySelector, timeoutMs: Long = 10_000): UiObject2? = device.wait(Until.findObject(sel), timeoutMs)

    private fun scrollTo(text: String): Boolean = try {
        UiScrollable(UiSelector().scrollable(true)).scrollIntoView(UiSelector().text(text))
    } catch (e: Exception) { false }

    /** Taps the on-screen text (scrolling the page to it if needed). */
    private fun tap(text: String): Boolean {
        var o = find(By.text(text), 3000)
        if (o == null) { scrollTo(text); o = find(By.text(text), 5000) }
        o?.click() ?: return false
        device.waitForIdle()
        return true
    }

    private fun screenshot(k: String, name: String, caption: String) {
        device.waitForIdle()
        if (device.takeScreenshot(ev.file(name))) ev.image(k, name, caption)
    }

    private fun sha256(b: ByteArray) = MessageDigest.getInstance("SHA-256").digest(b).joinToString("") { "%02x".format(it) }

    /** A throwaway render that starts the renderer page (for the text probe); transmission reads no device data. */
    private fun warm() {
        val t = ThemeStore.list(ctx).firstOrNull() ?: return
        Renderer.get(ctx).renderBlocking(RenderRequest(t.script, Family.SMALL, "transmission", 1.0, t.info.scriptName))
    }

    /**
     * Imports a website export through the share sheet route: the file is saved to Downloads (as the site's "Save as text
     * file" does) and its content:// link is shared to Foundry with ACTION_SEND, the intent Android's share sheet sends.
     */
    private fun import(k: String, file: String, expect: String): Theme? {
        val src = File(ctx.cacheDir, "emulator-fixtures/$file")
        val bytes = src.readBytes()
        ev.check(k, "fixture $file present", bytes.isNotEmpty(), "${bytes.size} bytes, sha256 ${sha256(bytes)}")
        var route: String
        val uri: Uri? = try {
            val values = ContentValues().apply {
                put(MediaStore.MediaColumns.DISPLAY_NAME, file)
                put(MediaStore.MediaColumns.MIME_TYPE, "text/plain")
                put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS)
                put(MediaStore.MediaColumns.IS_PENDING, 1)
            }
            val u = ctx.contentResolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values)!!
            ctx.contentResolver.openOutputStream(u)!!.use { it.write(bytes) }
            values.clear(); values.put(MediaStore.MediaColumns.IS_PENDING, 0)
            ctx.contentResolver.update(u, values, null, null)
            u
        } catch (e: Exception) { ev.note(k, "Saving to Downloads failed ($e); sharing a file:// link instead."); null }
        val shared = if (uri != null) {
            route = "share sheet intent: ACTION_SEND with EXTRA_STREAM $uri (the file saved in Downloads through MediaStore)"
            uri
        } else {
            val f = File(ctx.cacheDir, "share/$file").apply { parentFile?.mkdirs(); writeBytes(bytes) }
            StrictMode.setVmPolicy(StrictMode.VmPolicy.LAX)
            route = "share sheet intent: ACTION_SEND with a file:// link"
            Uri.fromFile(f)
        }
        ctx.startActivity(Intent(ctx, MainActivity::class.java).setAction(Intent.ACTION_SEND).setType("text/plain")
            .putExtra(Intent.EXTRA_STREAM, shared)
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK or Intent.FLAG_GRANT_READ_URI_PERMISSION))
        var ok = waitFor(45_000) { ThemeStore.get(ctx, expect) != null }
        if (!ok) {
            route += " - did not import within 45 s, so the script was saved with ThemeStore.save directly"
            ThemeStore.save(ctx, String(bytes))
            ok = ThemeStore.get(ctx, expect) != null
        }
        sleep(4000) // let the theme screen draw its first previews
        screenshot(k, "${k}_import.png", "Foundry after the share: $expect")
        device.pressHome()
        val theme = ThemeStore.get(ctx, expect)
        ev.test(k).put("import", JSONObject().put("file", file).put("route", route).put("theme", expect))
        ev.check(k, "imported as \"$expect\" through the share intent", ok && !route.contains("directly"), route)
        ev.check(k, "stored script is byte-identical to the export", theme != null && sha256(theme.file.readBytes()) == sha256(bytes),
            "stored ${theme?.file?.name}: sha256 ${theme?.let { sha256(it.file.readBytes()) }}")
        waitFor(20_000) { probe.idle() } // previews finish before widgets are probed
        return theme
    }

    private fun recordWidget(k: String, mode: String, fam: Family, o: Refresher.Outcome, image: String): JSONObject {
        val w = JSONObject().put("mode", mode).put("size", fam.key).put("image", image).put("fresh", o.fresh)
            .put("picture", o.picture).put("ms", o.ms).put("message", o.message ?: JSONObject.NULL)
            .put("texts", if (o.texts == null) JSONObject.NULL else JSONArray(o.texts.map { it.trim() }.filter { it.isNotEmpty() }.distinct().take(120)))
        val t = ev.test(k)
        if (!t.has("widgets")) t.put("widgets", JSONArray())
        t.getJSONArray("widgets").put(w)
        return w
    }

    private fun joined(o: Refresher.Outcome) = o.texts?.joinToString(" ") { it.trim() } ?: ""
    private fun hasTemp(s: String) = Regex("""\d+\s*°""").containsMatchIn(s)
    private fun hasBattery(s: String) = s.contains("68%")
    private fun hasWords(s: String, title: String) = title.split(' ').all { s.contains(it, ignoreCase = true) }
    private val unavailable = listOf("Weather unavailable", "Forecast unavailable", "Calendar access is unavailable", "Allocation unavailable", "No event scheduled")
    private fun problems(s: String) = unavailable.filter { s.contains(it, ignoreCase = true) }

    /** null when the text probe couldn't read this render: the screenshot then has to be judged by eye. */
    private fun textCheck(o: Refresher.Outcome, test: (String) -> Boolean): Boolean? = if (o.texts == null) null else test(joined(o))

    // ---------------------------------------------------------------- test 2

    private fun test2() {
        val k = "t2"
        val theme = import(k, "halcyon-illustrated.txt", illustrated) ?: error("Halcyon Illustrated did not import")
        ev.check(k, "Illustrated offers every size for the six widgets",
            theme.info.flexible && t2Modes.all { m -> theme.info.mode(m)?.sizes == Family.entries.toList() },
            "edition ${theme.info.edition}; modes " + theme.info.modes.joinToString { "${it.key}(${it.sizes.joinToString("/") { s -> s.key }})" })
        for (mode in t2Modes) for (fam in Family.entries) {
            val id = bench.bind(fam)
            // What the widget picker saves for a choice (WidgetConfigActivity.save); the picker itself is driven in test 6.
            WidgetStore.put(ctx, id, WidgetConfig(illustrated, mode, fam))
            widgets["${mode}_${fam.key}"] = id
        }
        Refresh.ensureScheduled(ctx)
        ev.note(k, "18 widgets bound at launcher sizes (small 170x170 dp, medium 364x170 dp, large 364x382 dp) and configured " +
            "as the widget picker saves them; each then got ONE refresh through WidgetUpdater.refresh, the code RefreshWorker runs.")
        val first = events.first()
        for (mode in t2Modes) for (fam in Family.entries) {
            val id = widgets.getValue("${mode}_${fam.key}")
            val o = refresher.refresh(id)
            val img = ev.savePng("t2_${mode}_${fam.key}.png", bench.capture(id))
            ev.image(k, img, "$mode ${fam.key}")
            recordWidget(k, mode, fam, o, img)
            val s = joined(o)
            val label = "$mode ${fam.key}"
            ev.check(k, "$label: fresh picture after one refresh", o.fresh && o.picture, "fresh=${o.fresh} picture=${o.picture} ${o.ms} ms ${o.message ?: ""}")
            when (mode) {
                "status" -> {
                    ev.check(k, "$label: weather", textCheck(o) { hasTemp(it) && "Weather unavailable" !in it }, excerpt(s, "°"))
                    ev.check(k, "$label: battery 68%", textCheck(o) { hasBattery(it) }, excerpt(s, "%"))
                    if (fam != Family.SMALL) ev.check(k, "$label: next calendar event", textCheck(o) { hasWords(it, first.title) }, excerpt(s, first.title.substringBefore(' ')))
                    else ev.note(k, "status small: the next event is ${if (hasWords(s, first.title)) "shown" else "not drawn at this size"}.")
                }
                "solar" -> ev.check(k, "$label: weather", textCheck(o) { hasTemp(it) && problems(it).none { p -> p.contains("unavailable") } }, excerpt(s, "°"))
                "shift" -> ev.check(k, "$label: calendar readable (setup prompt until an allocation is chosen)",
                    textCheck(o) { "Calendar access is unavailable" !in it && "Allocation unavailable" !in it }, excerpt(s, "allocation"))
                "game" -> ev.note(k, "$label: ${if (s.contains("NUTRIENT LINE / IDLE")) "nutrient line idle (not charging)" else "drawn"}")
                else -> ev.note(k, "$label: $mode draws no live device readings (time-driven), checked for a fresh picture only")
            }
            ev.flush()
        }
    }

    /**
     * The live countdown Shift drew, as its own string ("7:24" or "1:07:24"), when it is within two minutes of the time
     * left to the event's start (or end, once it has begun) at the moment of the render. Clock times like "10:25" don't fit.
     */
    private fun timer(o: Refresher.Outcome, e: CalEv): String? = o.texts?.map { it.trim() }?.firstOrNull { t ->
        val m = Regex("""^(?:(\d+):)?(\d{1,2}):(\d{2})$""").find(t) ?: return@firstOrNull false
        val secs = (m.groupValues[1].toLongOrNull() ?: 0) * 3600 + m.groupValues[2].toLong() * 60 + m.groupValues[3].toLong()
        listOf(e.start, e.end).any { target -> Math.abs((target - o.renderedAt) / 1000 - secs) <= 120 }
    }

    /** WorkManager's JobScheduler jobs in a `dumpsys jobscheduler` listing, as (job id, its block of text). */
    private fun workJobs(dump: String): List<Pair<String, String>> {
        val heads = Regex("""(?m)^\s*JOB #?[^/\s]+/(-?\d+):""").findAll(dump).toList()
        return heads.mapIndexed { i, m -> m.groupValues[1] to dump.substring(m.range.first, if (i + 1 < heads.size) heads[i + 1].range.first else dump.length) }
            .filter { it.second.contains(pkg) }.distinctBy { it.first }
    }

    private fun excerpt(s: String, near: String): String {
        if (s.isEmpty()) return "(text probe unavailable; judge the screenshot)"
        val i = s.indexOf(near, ignoreCase = true)
        return if (i < 0) "texts: " + s.take(220) else "... " + s.substring(maxOf(0, i - 90), minOf(s.length, i + 90)) + " ..."
    }

    // ---------------------------------------------------------------- test 5

    private fun test5() {
        val k = "t5"
        val theme = ThemeStore.get(ctx, illustrated) ?: error("Halcyon Illustrated is not imported")
        val info = theme.info
        val target = events.first()
        val now = System.currentTimeMillis()
        ev.note(k, "Event to choose: \"${target.title}\" starting ${(target.start - now) / 1000} s from now (id ${target.id}, calendar $calendarId).")
        val settings = File(ctx.filesDir, "foundry/${info.settingsFileName}")

        openApp()
        ev.check(k, "theme row on the home screen", tap(illustrated), illustrated)
        ev.check(k, "Halcyon setup shown", find(By.text(str("setup_allocation")), 10_000) != null, str("setup_allocation"))

        // Radio first, so the allocation pick has to keep it.
        var radioRoute = "Radio set in the app's radio setup (UiAutomator)"
        if (tap(str("setup_radio"))) {
            find(By.clazz("android.widget.EditText"), 5000)?.let { it.text = radioUrl }
            find(By.res("android:id/button1"), 5000)?.click()
            device.waitForIdle()
        }
        if (!waitFor(5000) { settings.isFile && JSONObject(settings.readText()).optString("radio") == radioUrl }) {
            radioRoute = "radio setup UI didn't save; radio written with HalcyonSettings.saveRadio"
            io.github.lucidfuzz.foundry.HalcyonSettings.saveRadio(ctx, info, radioUrl)
        }
        ev.note(k, radioRoute)

        ev.check(k, "allocation setup opens", tap(str("setup_allocation")), str("setup_allocation"))
        val item = find(By.textStartsWith(target.title), 10_000)
        screenshot(k, "t5_allocation_list.png", "Allocation setup: timed events from the next 90 days")
        ev.check(k, "the 10-minute event is offered", item != null, item?.text ?: "not in the list")
        item?.click()
        device.waitForIdle()
        waitFor(10_000) { settings.isFile && JSONObject(settings.readText()).has("allocation") }
        sleep(1500)
        screenshot(k, "t5_setup_after.png", "Theme screen after choosing the allocation")
        device.pressHome()

        val raw = Shell.run("run-as $pkg cat files/foundry/${info.settingsFileName}")
        ev.test(k).put("settingsFile", JSONObject().put("path", "files/foundry/${info.settingsFileName}").put("content", raw))
        val s = try { JSONObject(raw) } catch (e: Exception) { null }
        val a = s?.optJSONObject("allocation")
        val keys = a?.keys()?.asSequence()?.toSet() ?: emptySet()
        ev.check(k, "settings file read with run-as cat is JSON", s != null, raw.take(300))
        ev.check(k, "allocation has exactly match, identifier, title, calendar", keys == setOf("match", "identifier", "title", "calendar"), "keys $keys")
        ev.check(k, "match is 'title'", a?.opt("match") == "title", "${a?.opt("match")}")
        ev.check(k, "identifier is the event's id (string)", a?.opt("identifier") == target.id, "${a?.opt("identifier")} vs ${target.id}")
        ev.check(k, "title is the event's title", a?.opt("title") == target.title, "${a?.opt("title")}")
        ev.check(k, "calendar is the calendar's id as a string", a?.opt("calendar") == calendarId, "${a?.opt("calendar")} (${a?.opt("calendar")?.javaClass?.simpleName}) vs \"$calendarId\"")
        ev.check(k, "radio kept", s?.optString("radio") == radioUrl, "${s?.opt("radio")}")

        for (fam in Family.entries) {
            val id = widgets.getValue("shift_${fam.key}")
            val o = refresher.refresh(id)
            val img = ev.savePng("t5_shift_${fam.key}.png", bench.capture(id))
            ev.image(k, img, "shift ${fam.key} after the allocation was chosen")
            recordWidget(k, "shift", fam, o, img)
            val text = joined(o)
            ev.check(k, "shift ${fam.key}: fresh picture", o.fresh && o.picture, "fresh=${o.fresh} picture=${o.picture}")
            ev.check(k, "shift ${fam.key}: countdown to \"${target.title}\"",
                if (o.texts == null) null else hasWords(text, target.title) && timer(o, target) != null,
                "timer ${timer(o, target) ?: "not found"} (expected about ${(target.start - o.renderedAt) / 1000} s to the start); " + excerpt(text, target.title))
        }
    }

    // ---------------------------------------------------------------- test 3

    private val gameSave get() = File(ctx.filesDir, "foundry/foundry-game-halcyon.json")
    private fun readGame(): JSONObject = try { JSONObject(gameSave.readText()) } catch (e: Exception) { JSONObject() }
    private fun gameSummary(o: JSONObject) = "turn ${o.opt("turn")}, growth ${o.opt("growth")}, nutrients ${o.opt("nut")}, stage ${o.opt("stage")}, " +
        "last log \"${o.optJSONArray("log")?.let { l -> if (l.length() > 0) l.optJSONObject(l.length() - 1)?.optString("m") else null }}\""

    /**
     * Halcyon's game takes at most one turn per 15 minutes (st.last). To see "the next turn" without waiting, the save's
     * last-turn time is moved back 16 minutes, under WidgetUpdater's lock so no render is reading it at that moment.
     */
    private fun makeTurnDue(): JSONObject = synchronized(WidgetUpdater) {
        val o = readGame()
        o.put("last", o.optLong("last") - 16 * minute)
        gameSave.writeText(o.toString())
        o
    }

    private fun waitWorkIdle(timeoutMs: Long = 150_000): Boolean = waitFor(timeoutMs, 1000) {
        val wm = WorkManager.getInstance(ctx)
        wm.getWorkInfos(WorkQuery.Builder.fromStates(listOf(WorkInfo.State.RUNNING)).build()).get().isEmpty() &&
            wm.getWorkInfosForUniqueWork("foundry-refresh").get().none { it.state == WorkInfo.State.ENQUEUED || it.state == WorkInfo.State.BLOCKED }
    }

    private fun test3() {
        val k = "t3"
        val gid = widgets.getValue("game_medium")
        ev.check(k, "game save exists", gameSave.isFile, gameSave.path)
        ensureBattery(k)
        waitWorkIdle()
        val before = makeTurnDue()
        ev.image(k, ev.savePng("t3_game_medium_before.png", bench.capture(gid)), "Game (medium) before plugging in")
        ev.note(k, "Before: ${gameSummary(before)}. The save's last-turn time was moved back 16 minutes so the next turn is due " +
            "(the game takes at most one turn per 15 minutes).")

        // A: Foundry's process is running (this test runs in it), so PowerWatch's live receiver should redraw at once.
        probe.ensure { warm() }
        probe.clear()
        val t0 = System.currentTimeMillis()
        Shell.run("dumpsys battery set ac 1")
        val advanced = waitFor(180_000) { readGame().optInt("turn") > before.optInt("turn") }
        val tTurn = System.currentTimeMillis() - t0
        val shown = bench.waitForPicture(gid, t0, 60_000)
        val afterA = readGame()
        val texts = probe.read()
        for (f in Family.entries) ev.image(k, ev.savePng("t3_game_${f.key}_after_charger.png", bench.capture(widgets.getValue("game_${f.key}"))), "Game (${f.key}) after dumpsys battery set ac 1")
        ev.test(k).put("liveReceiver", JSONObject().put("before", before).put("after", afterA).put("secondsToTurn", tTurn / 1000.0))
        ev.check(k, "with Foundry open: the game widget redrew and took its turn after plug-in", advanced && shown,
            "turn ${before.opt("turn")} -> ${afterA.opt("turn")} ${tTurn / 1000.0} s after plug-in; widget updated=$shown")
        ev.check(k, "specimen advanced while charging (growth +1, nutrient line fed)",
            afterA.optInt("growth") == before.optInt("growth") + 1 && afterA.toString().contains("Nutrient line open via charging port"),
            "after: ${gameSummary(afterA)}")
        ev.check(k, "game drawn as charging (NUTRIENT LINE / OPEN)", if (texts == null) null else texts.any { it.contains("NUTRIENT LINE / OPEN") },
            if (texts == null) "text probe unavailable" else texts.filter { it.contains("NUTRIENT") }.distinct().joinToString())

        // B: the WorkManager path that wakes Foundry when its process isn't running. Forced instead of waiting.
        waitWorkIdle()
        val before2 = makeTurnDue()
        val jobs = workJobs(Shell.run("dumpsys jobscheduler $pkg")).ifEmpty { workJobs(Shell.run("dumpsys jobscheduler")) }
        if (jobs.isEmpty()) ev.test(k).put("jobDump", Shell.run("dumpsys jobscheduler | grep -n -i -E 'JOB|$pkg' | head -n 60"))
        val chargeJob = jobs.firstOrNull { it.second.contains("CHARGING") }
        val job = chargeJob ?: jobs.firstOrNull { it.second.contains("PERIODIC", ignoreCase = true) } ?: jobs.firstOrNull()
        ev.test(k).put("jobs", JSONArray(jobs.map { it.second.lines().take(12).joinToString("\n") }))
        ev.note(k, "WorkManager jobs for $pkg: " + jobs.joinToString { "#${it.first}${if (it.second.contains("CHARGING")) " (requires charging)" else ""}" } +
            ". Forcing ${job?.let { "#${it.first}" } ?: "none"} with 'cmd jobscheduler run -f' instead of waiting for Android.")
        val t1 = System.currentTimeMillis()
        val runOut = job?.let { Shell.run("cmd jobscheduler run -f $pkg ${it.first}") } ?: "no job found"
        val advanced2 = waitFor(180_000) { readGame().optInt("turn") > before2.optInt("turn") }
        val tTurn2 = System.currentTimeMillis() - t1
        val shown2 = bench.waitForPicture(gid, t1, 60_000)
        val afterB = readGame()
        ev.image(k, ev.savePng("t3_game_medium_after_job.png", bench.capture(gid)), "Game (medium) after the forced WorkManager charging job")
        ev.test(k).put("forcedJob", JSONObject().put("job", job?.first ?: JSONObject.NULL).put("output", runOut).put("before", before2).put("after", afterB))
        ev.check(k, "by the next refresh: the forced ${if (chargeJob != null) "charging" else "refresh"} job redrew the game and it took its turn",
            advanced2 && shown2, "job #${job?.first}: '$runOut'; turn ${before2.opt("turn")} -> ${afterB.opt("turn")} after ${tTurn2 / 1000.0} s; widget updated=$shown2")
        ev.check(k, "specimen advanced again (growth +1)", afterB.optInt("growth") == before2.optInt("growth") + 1, gameSummary(afterB))

        Shell.run("dumpsys battery reset")
        sleep(2000)
        ev.note(k, "Charger: 'dumpsys battery reset' done, then level 68%, unplugged and discharging re-applied for the remaining tests.")
        Shell.run(UNPLUGGED)
        waitWorkIdle()
    }

    // ---------------------------------------------------------------- test 4

    private fun test4() {
        val k = "t4"
        val dir = File(ctx.filesDir, "foundry")
        val art = dir.walkTopDown().filter { it.isFile && it.name.substringAfterLast('.').lowercase() in setOf("png", "jpg", "jpeg", "webp") }.toList()
        ev.check(k, "Illustrated art cached by the script while online", art.isNotEmpty(),
            "${art.size} files under files/foundry: " + art.joinToString { "${it.relativeTo(dir)} (${it.length() / 1024} KB)" })
        val cm = ctx.getSystemService(ConnectivityManager::class.java)
        Shell.run("cmd connectivity airplane-mode enable")
        val offline = waitFor(30_000) { cm.activeNetwork == null }
        ev.check(k, "airplane mode on, no network", offline, "activeNetwork=${cm.activeNetwork}")
        Shell.run("log -t FoundryEmulatorTest T4_AIRPLANE_START")
        sleep(500)
        try {
            for (mode in t2Modes) for (fam in Family.entries) {
                val id = widgets.getValue("${mode}_${fam.key}")
                val o = refresher.refresh(id)
                val img = ev.savePng("t4_${mode}_${fam.key}.png", bench.capture(id))
                ev.image(k, img, "$mode ${fam.key}, airplane mode")
                recordWidget(k, mode, fam, o, img)
                val label = "$mode ${fam.key}"
                ev.check(k, "$label: still renders offline", o.fresh && o.picture, "fresh=${o.fresh} picture=${o.picture} ${o.ms} ms ${o.message ?: ""}")
                if (mode == "status" || mode == "solar") ev.check(k, "$label: weather shows the offline text",
                    textCheck(o) { !hasTemp(it) && (it.contains("unavailable", ignoreCase = true) || it.contains("—")) },
                    excerpt(joined(o), if (joined(o).contains("unavailable", ignoreCase = true)) "unavailable" else "—"))
                ev.flush()
            }
        } finally {
            val log = Shell.run("logcat -d -v threadtime")
            val after = log.substringAfter("T4_AIRPLANE_START", "").lines().filter { "FoundryEmulatorTest" !in it }.joinToString("\n")
            val marker = log.contains("T4_AIRPLANE_START")
            val fatal = Regex("FATAL EXCEPTION").findAll(after).count()
            val anr = Regex("""ANR in""").findAll(after).count()
            val crashBuffer = Shell.run("logcat -d -b crash")
            ev.test(k).put("logcat", JSONObject().put("markerFound", marker).put("fatal", fatal).put("anr", anr)
                .put("crashBufferFatal", Regex("FATAL EXCEPTION").findAll(crashBuffer).count()))
            ev.check(k, "no crash (fatal exception) in logcat while offline", marker && fatal == 0, "$fatal (marker found: $marker)")
            ev.check(k, "no app-not-responding in logcat while offline", marker && anr == 0, "$anr")
            Shell.run("cmd connectivity airplane-mode disable")
            ev.note(k, "Airplane mode turned off again: network back = ${waitFor(60_000) { cm.activeNetwork != null }}.")
        }
    }

    // ---------------------------------------------------------------- test 6

    /** The sizes the script's header names for a mode, read here with a separate rule from the app's: "any" means all. */
    private fun headerSizes(header: String, key: String): List<String> {
        val note = Regex("""\b${Regex.escape(key)}\b[^()]*\(([^)]*)\)""").find(header)?.groupValues?.get(1)?.lowercase() ?: return emptyList()
        if (Regex("""\bany\b""").containsMatchIn(note)) return listOf("small", "medium", "large")
        return listOf("small", "medium", "large").filter { Regex("""\b$it\b""").containsMatchIn(note) }
    }

    private class Picked(val ok: Boolean, val offers: List<String>, val screenshot: String?, val problem: String?)

    /** Drives the real widget picker (WidgetConfigActivity) for widget [id]: theme, widget, size, then "Add widget". */
    private fun pick(k: String, id: Int, themeName: String, mode: Mode, fam: Family): Picked {
        ctx.startActivity(Intent(AppWidgetManager.ACTION_APPWIDGET_CONFIGURE).setClass(ctx, WidgetConfigActivity::class.java)
            .putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, id).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
        if (find(By.text(str("config_title")), 15_000) == null) return Picked(false, emptyList(), null, "picker didn't open")
        if (!tap(themeName)) return Picked(false, emptyList(), null, "theme row not found")
        sleep(500)
        if (!tap(mode.title)) return Picked(false, emptyList(), null, "widget row '${mode.title}' not found")
        sleep(800)
        scrollTo(str("config_resize_hint"))
        device.waitForIdle()
        val chips = device.findObjects(By.text(Pattern.compile("Small|Medium|Large"))).mapNotNull { it.text }
        val fixedSuffix = ctx.getString(bench.resId("config_size_fixed", "string"), "\u0001").substringAfter("\u0001")
        val fixed = device.findObject(By.textEndsWith(fixedSuffix))?.text?.substringBefore(fixedSuffix)
        val offers = (if (chips.isNotEmpty()) chips else listOfNotNull(fixed)).map { it.lowercase() }
        val shot = "t6_config_${mode.key}.png"
        val took = device.takeScreenshot(ev.file(shot))
        if (took) ev.image(k, shot, "Widget picker: ${mode.title} (sizes offered: ${offers.joinToString()})")
        if (chips.size > 1) device.findObject(By.text(fam.label))?.click()
        sleep(500)
        if (!tap(str("config_save"))) return Picked(false, offers, shot, "'${str("config_save")}' not found")
        val closed = device.wait(Until.gone(By.text(str("config_title"))), 25_000) == true
        return Picked(closed, offers, if (took) shot else null, if (closed) null else "picker didn't close")
    }

    private fun test6() {
        val k = "t6"
        val theme = import(k, "halcyon-original.txt", original) ?: error("Halcyon Original did not import")
        val info = theme.info
        val header = theme.script.lineSequence().drop(1).takeWhile { it.trimStart().startsWith("//") }.joinToString("\n")
        ev.test(k).put("header", header)
        ev.check(k, "Original edition, fixed sizes", info.edition == "Original" && !info.flexible, "edition ${info.edition}, flexible ${info.flexible}")
        val rows = JSONArray()
        for (mode in info.modes) {
            val fam = mode.defaultFamily
            val id = bench.bind(fam)
            val t0 = System.currentTimeMillis()
            val p = try { pick(k, id, original, mode, fam) } catch (e: Throwable) { Picked(false, emptyList(), null, e.toString()) }
            var route = "widget picker (UiAutomator)"
            if (!p.ok) {
                route = "picker failed (${p.problem}); configured with WidgetStore.put and refreshed directly"
                device.pressBack(); device.pressHome()
                WidgetStore.put(ctx, id, WidgetConfig(original, mode.key, fam))
                refresher.refresh(id)
            }
            val shown = bench.waitForPicture(id, t0, 60_000)
            val img = ev.savePng("t6_${mode.key}_${fam.key}.png", bench.capture(id))
            ev.image(k, img, "${mode.title} at ${fam.key} (compare with the site preview)")
            val app = mode.sizes.map { it.key }
            val fromHeader = headerSizes(header, mode.key)
            val saved = WidgetStore.get(ctx, id)
            rows.put(JSONObject().put("mode", mode.key).put("title", mode.title).put("headerNote", mode.note)
                .put("headerSizes", JSONArray(fromHeader)).put("appOffers", JSONArray(app)).put("pickerShows", JSONArray(p.offers))
                .put("rendered", fam.key).put("image", img).put("pickerScreenshot", p.screenshot ?: JSONObject.NULL).put("route", route))
            ev.check(k, "${mode.key}: app offers what the header says", app == fromHeader, "header \"${mode.note}\" -> $fromHeader; app $app")
            ev.check(k, "${mode.key}: widget picker shows only those sizes", if (p.offers.isEmpty()) null else p.offers == app, "picker shows ${p.offers}")
            ev.check(k, "${mode.key}: placed through the picker and drawn at ${fam.key}",
                p.ok && shown && saved == WidgetConfig(original, mode.key, fam), "$route; saved $saved; picture $shown")
            ev.flush()
        }
        ev.test(k).put("modes", rows)
        ev.check(k, "renders match the site previews", null, "Compare t6_<mode>_<size>.png with the site's Halcyon Original previews (live data aside).")
    }
}
