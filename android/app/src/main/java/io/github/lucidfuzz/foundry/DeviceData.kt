package io.github.lucidfuzz.foundry

import android.Manifest
import android.annotation.SuppressLint
import android.content.ContentUris
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.BatteryManager
import android.os.Build
import android.os.Bundle
import android.os.Looper
import android.provider.CalendarContract
import org.json.JSONArray
import org.json.JSONObject
import java.util.Calendar
import java.util.TimeZone

// The real readings a widget script asks for through the bridge: calendar events, battery and an approximate location.

/** A calendar occurrence, in the shape the runtime expects from FoundryNative.calendar(). */
data class CalEvent(
    val title: String, val start: Long, val end: Long, val allDay: Boolean, val calendar: String, val calendarId: String,
    val color: String, val location: String, val notes: String, val id: String,
) {
    fun toJson(): JSONObject = JSONObject().put("title", title).put("start", start).put("end", end).put("allDay", allDay)
        .put("calendar", calendar).put("calendarId", calendarId).put("color", color).put("location", location)
        .put("notes", notes).put("id", id)
}

object DeviceData {
    fun hasCalendar(ctx: Context) = ctx.checkSelfPermission(Manifest.permission.READ_CALENDAR) == PackageManager.PERMISSION_GRANTED
    fun hasLocation(ctx: Context) = ctx.checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED

    /**
     * Every occurrence overlapping [startMs, endMs) in all visible calendars. Without calendar permission this throws, which
     * reaches the script as a failed calendar read (as on iPhone), so widgets say access is off rather than "no events".
     */
    @SuppressLint("MissingPermission") // checked by hasCalendar() above
    fun calendar(ctx: Context, startMs: Long, endMs: Long): List<CalEvent> {
        if (!hasCalendar(ctx)) throw SecurityException("Calendar access is off. Allow it in the Foundry app.")
        val uri = CalendarContract.Instances.CONTENT_URI.buildUpon().also {
            ContentUris.appendId(it, startMs)
            ContentUris.appendId(it, endMs)
        }.build()
        val cols = arrayOf(
            CalendarContract.Instances.TITLE, CalendarContract.Instances.BEGIN, CalendarContract.Instances.END,
            CalendarContract.Instances.ALL_DAY, CalendarContract.Instances.CALENDAR_DISPLAY_NAME,
            CalendarContract.Instances.CALENDAR_ID, CalendarContract.Instances.DISPLAY_COLOR,
            CalendarContract.Instances.EVENT_LOCATION, CalendarContract.Instances.DESCRIPTION,
            CalendarContract.Instances.EVENT_ID, CalendarContract.Instances.ORIGINAL_ID,
        )
        val where = "${CalendarContract.Instances.VISIBLE} = 1 AND (${CalendarContract.Instances.STATUS} IS NULL OR " +
            "${CalendarContract.Instances.STATUS} != ${CalendarContract.Events.STATUS_CANCELED})"
        val out = ArrayList<CalEvent>()
        ctx.contentResolver.query(uri, cols, where, null, "${CalendarContract.Instances.BEGIN} ASC")?.use { c ->
            while (c.moveToNext()) {
                val allDay = c.getInt(3) != 0
                var begin = c.getLong(1)
                var end = if (c.isNull(2)) begin else c.getLong(2)
                // All-day events are stored at UTC midnight; scripts expect local midnight, as on iPhone.
                if (allDay) { begin = utcDayToLocal(begin); end = utcDayToLocal(end) }
                if (end <= startMs || begin >= endMs) continue
                out.add(
                    CalEvent(
                        title = c.getString(0) ?: "", start = begin, end = end, allDay = allDay,
                        calendar = c.getString(4) ?: "", calendarId = c.getLong(5).toString(),
                        color = String.format("%06X", (if (c.isNull(6)) 0x888888 else c.getInt(6)) and 0xFFFFFF),
                        location = c.getString(7) ?: "", notes = c.getString(8) ?: "",
                        // Shared by every occurrence of a repeating event (even an edited one), like iPhone's
                        // eventIdentifier. Calendar ids are strings too: the allocation setting compares them exactly.
                        id = c.getString(10)?.takeIf { it.isNotBlank() } ?: c.getLong(9).toString(),
                    ),
                )
            }
        }
        return out
    }

    /**
     * For the bridge. Without permission (or if the calendar can't be read) this is "null", which makes the runtime's
     * CalendarEvent calls fail as they do on iPhone, so Shift says calendar access is unavailable instead of "no events".
     */
    fun calendarJson(ctx: Context, startMs: Long, endMs: Long): String = try {
        JSONArray().apply { calendar(ctx, startMs, endMs).forEach { put(it.toJson()) } }.toString()
    } catch (e: Exception) { "null" }

    private fun utcDayToLocal(ms: Long): Long {
        val utc = Calendar.getInstance(TimeZone.getTimeZone("UTC")).apply { timeInMillis = ms }
        return Calendar.getInstance().apply {
            clear()
            set(utc.get(Calendar.YEAR), utc.get(Calendar.MONTH), utc.get(Calendar.DAY_OF_MONTH), 0, 0, 0)
        }.timeInMillis
    }

    class Battery(val level: Double, val charging: Boolean)

    fun battery(ctx: Context): Battery {
        val i: Intent? = try {
            val filter = IntentFilter(Intent.ACTION_BATTERY_CHANGED)
            if (Build.VERSION.SDK_INT >= 33) ctx.registerReceiver(null, filter, Context.RECEIVER_NOT_EXPORTED)
            else ctx.registerReceiver(null, filter)
        } catch (e: Exception) { null }
        val bm = ctx.getSystemService(BatteryManager::class.java)
        val level = i?.let {
            val l = it.getIntExtra(BatteryManager.EXTRA_LEVEL, -1)
            val s = it.getIntExtra(BatteryManager.EXTRA_SCALE, -1)
            if (l >= 0 && s > 0) l.toDouble() / s else null
        } ?: bm?.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)?.takeIf { it in 0..100 }?.let { it / 100.0 } ?: 1.0
        val status = i?.getIntExtra(BatteryManager.EXTRA_STATUS, -1) ?: -1
        val plugged = (i?.getIntExtra(BatteryManager.EXTRA_PLUGGED, 0) ?: 0) != 0
        val charging = plugged || status == BatteryManager.BATTERY_STATUS_CHARGING || (i == null && bm?.isCharging == true)
        return Battery(level.coerceIn(0.0, 1.0), charging)
    }

    /** Never fails: Original's Status reads the battery without a try. */
    fun batteryJson(ctx: Context): String = try {
        battery(ctx).let { JSONObject().put("level", it.level).put("charging", it.charging).toString() }
    } catch (e: Exception) { "{\"level\":1,\"charging\":false}" }
}

/**
 * The last approximate location, kept in the app. Refreshed when the app opens and on each widget refresh while permission
 * allows; widgets keep using the cached fix when a fresh one isn't available (no background location in Phase 1).
 */
object LocationCache {
    fun json(ctx: Context): String {
        val p = AppState.prefs(ctx)
        if (!p.contains("lat")) return "null"
        return JSONObject()
            .put("lat", p.getFloat("lat", 0f).toDouble())
            .put("lon", p.getFloat("lon", 0f).toDouble())
            .put("acc", p.getFloat("acc", 3000f).toDouble())
            .toString()
    }

    /** [redraw]: redraw widgets if this is the first fix or a move of over 5 km (not when a refresh pass found it). */
    private fun store(ctx: Context, l: Location, redraw: Boolean = true) {
        val p = AppState.prefs(ctx)
        if (l.time < p.getLong("locTime", 0L)) return
        val first = !p.contains("lat")
        val moved = FloatArray(1)
        if (!first) Location.distanceBetween(p.getFloat("lat", 0f).toDouble(), p.getFloat("lon", 0f).toDouble(), l.latitude, l.longitude, moved)
        p.edit().putFloat("lat", l.latitude.toFloat()).putFloat("lon", l.longitude.toFloat())
            .putFloat("acc", if (l.hasAccuracy()) l.accuracy else 3000f).putLong("locTime", l.time).apply()
        // The first fix (often just after permission is granted) or a move to another town: redraw the weather now.
        if (redraw && (first || moved[0] > 5_000f)) Refresh.now(ctx.applicationContext)
    }

    /**
     * The newest last-known fix from any provider this app may use. Cheap; safe from a background worker. A refresh pass
     * passes [redraw] = false: it is about to draw with the new fix anyway.
     */
    @SuppressLint("MissingPermission") // checked by hasLocation()
    fun refreshFromLastKnown(ctx: Context, redraw: Boolean = true) {
        if (!DeviceData.hasLocation(ctx)) return
        val lm = ctx.getSystemService(LocationManager::class.java) ?: return
        val best = try {
            lm.getProviders(true).mapNotNull { p -> try { lm.getLastKnownLocation(p) } catch (e: Exception) { null } }
                .maxByOrNull { it.time }
        } catch (e: Exception) { null }
        best?.let { store(ctx, it, redraw) }
    }

    /** Asks for one fresh approximate fix while the app is open. */
    @SuppressLint("MissingPermission") // checked by hasLocation()
    fun requestFresh(ctx: Context) {
        refreshFromLastKnown(ctx)
        if (!DeviceData.hasLocation(ctx)) return
        val app = ctx.applicationContext
        val lm = app.getSystemService(LocationManager::class.java) ?: return
        val enabled = try { lm.getProviders(true) } catch (e: Exception) { return }
        val provider = listOfNotNull(
            if (Build.VERSION.SDK_INT >= 31) LocationManager.FUSED_PROVIDER else null,
            LocationManager.NETWORK_PROVIDER,
        ).firstOrNull { it in enabled } ?: return
        try {
            if (Build.VERSION.SDK_INT >= 30) {
                lm.getCurrentLocation(provider, null, app.mainExecutor) { loc -> if (loc != null) store(app, loc) }
            } else {
                @Suppress("DEPRECATION")
                lm.requestSingleUpdate(provider, object : LocationListener {
                    override fun onLocationChanged(location: Location) = store(app, location)
                    @Deprecated("Deprecated in Java")
                    override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) {}
                    override fun onProviderEnabled(provider: String) {}
                    override fun onProviderDisabled(provider: String) {}
                }, Looper.getMainLooper())
            }
        } catch (e: SecurityException) {
        } catch (e: IllegalArgumentException) {
        }
    }
}
