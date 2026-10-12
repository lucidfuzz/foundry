package io.github.lucidfuzz.foundry

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import androidx.work.Constraints
import androidx.work.Data
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.ExistingWorkPolicy
import androidx.work.OneTimeWorkRequest
import androidx.work.PeriodicWorkRequest
import androidx.work.WorkManager
import androidx.work.Worker
import androidx.work.WorkerParameters
import java.util.concurrent.TimeUnit

/**
 * When widgets redraw: every 15 minutes (WorkManager's minimum), sooner when a script asks for it (refreshAfter), and on
 * widget added or resized, charger plugged in or out, boot, time or time zone changes, and app open.
 */
object Refresh {
    private const val PERIODIC = "foundry-periodic"
    private const val NOW = "foundry-refresh"
    private const val SOON = "foundry-soon"
    private const val CHARGE = "foundry-charging"
    private const val IDS = "ids"
    private const val PERIOD_MS = 15 * 60_000L

    fun hasWidgets(ctx: Context) = WidgetUpdater.allIds(ctx).isNotEmpty()

    /** Keeps the 15-minute refresh and the charger watch running while any widget is placed. */
    fun ensureScheduled(ctx: Context) {
        if (!hasWidgets(ctx)) return
        val wm = WorkManager.getInstance(ctx)
        wm.enqueueUniquePeriodicWork(
            PERIODIC, ExistingPeriodicWorkPolicy.KEEP,
            PeriodicWorkRequest.Builder(RefreshWorker::class.java, 15, TimeUnit.MINUTES).build(),
        )
        watchCharging(ctx, 0L, ExistingWorkPolicy.KEEP)
    }

    /** Redraws [ids] (or every placed widget) as soon as possible. */
    fun now(ctx: Context, ids: IntArray? = null) {
        if (!hasWidgets(ctx)) return
        val req = OneTimeWorkRequest.Builder(RefreshWorker::class.java)
            .setInputData(Data.Builder().putIntArray(IDS, ids ?: IntArray(0)).build())
            .build()
        // Append, so a refresh asked for while one is running still happens after it.
        WorkManager.getInstance(ctx).enqueueUniqueWork(NOW, ExistingWorkPolicy.APPEND_OR_REPLACE, req)
    }

    /**
     * One extra refresh at [timeMs] when a script wants to be redrawn before the next 15-minute refresh. An extra refresh
     * already booked for an earlier time is kept; one that is already running is never cancelled (the new one follows it).
     */
    fun at(ctx: Context, timeMs: Long) {
        val p = AppState.prefs(ctx)
        val now = System.currentTimeMillis()
        val pending = p.getLong("soonAt", 0L)
        if (pending > now && pending <= timeMs) return
        p.edit().putLong("soonAt", timeMs).apply()
        val req = OneTimeWorkRequest.Builder(RefreshWorker::class.java)
            .setInitialDelay((timeMs - now).coerceAtLeast(0L), TimeUnit.MILLISECONDS)
            .build()
        val policy = if (pending > now) ExistingWorkPolicy.REPLACE else ExistingWorkPolicy.APPEND_OR_REPLACE
        WorkManager.getInstance(ctx).enqueueUniqueWork(SOON, policy, req)
    }

    /**
     * Wakes the app when a charger is plugged in (apps can't receive the plug-in broadcast from the manifest since
     * Android 8), so the game widget sees charging promptly. Re-armed after each run.
     */
    fun watchCharging(ctx: Context, delayMs: Long, policy: ExistingWorkPolicy) {
        val req = OneTimeWorkRequest.Builder(ChargeWorker::class.java)
            .setConstraints(Constraints.Builder().setRequiresCharging(true).build())
            .setInitialDelay(delayMs, TimeUnit.MILLISECONDS)
            .build()
        WorkManager.getInstance(ctx).enqueueUniqueWork(CHARGE, policy, req)
    }

    fun cancelAll(ctx: Context) {
        val wm = WorkManager.getInstance(ctx)
        listOf(PERIODIC, NOW, SOON, CHARGE).forEach { wm.cancelUniqueWork(it) }
    }

    /** Redraws widgets (worker thread). Schedules an earlier extra refresh when a script asks for one. */
    fun run(ctx: Context, ids: IntArray?, stopped: () -> Boolean) {
        LocationCache.refreshFromLastKnown(ctx)
        val targets = ids?.takeIf { it.isNotEmpty() } ?: WidgetUpdater.allIds(ctx)
        var soonest = Long.MAX_VALUE
        for (id in targets) {
            if (stopped()) return
            WidgetUpdater.refresh(ctx, id)?.let { if (it < soonest) soonest = it }
        }
        val now = System.currentTimeMillis()
        if (soonest != Long.MAX_VALUE && soonest > now && soonest < now + PERIOD_MS - 60_000L) at(ctx, soonest)
    }

    fun idsFrom(data: Data): IntArray? = data.getIntArray(IDS)
}

class RefreshWorker(ctx: Context, params: WorkerParameters) : Worker(ctx, params) {
    override fun doWork(): Result {
        Refresh.run(applicationContext, Refresh.idsFrom(inputData)) { isStopped }
        return Result.success()
    }
}

/** Runs when the phone starts charging: redraws every widget, then waits for the next charge. */
class ChargeWorker(ctx: Context, params: WorkerParameters) : Worker(ctx, params) {
    override fun doWork(): Result {
        Refresh.run(applicationContext, null) { isStopped }
        // Re-arm with a pause, so continuous charging doesn't redraw in a loop.
        Refresh.watchCharging(applicationContext, 20 * 60_000L, ExistingWorkPolicy.REPLACE)
        return Result.success()
    }
}

/** Boot, app update, clock and time zone changes: make sure refreshes are scheduled and redraw now. */
class SystemEventsReceiver : BroadcastReceiver() {
    private val actions = setOf(
        Intent.ACTION_BOOT_COMPLETED, Intent.ACTION_MY_PACKAGE_REPLACED, Intent.ACTION_TIME_CHANGED, Intent.ACTION_TIMEZONE_CHANGED,
    )

    override fun onReceive(ctx: Context, intent: Intent) {
        if (intent.action !in actions) return
        Refresh.ensureScheduled(ctx)
        Refresh.now(ctx)
    }
}

/** Charger plugged in or out while the app's process is running (also covered by ChargeWorker when it isn't). */
object PowerWatch {
    private var registered = false

    fun register(ctx: Context) {
        if (registered) return
        registered = true
        val filter = IntentFilter().apply {
            addAction(Intent.ACTION_POWER_CONNECTED)
            addAction(Intent.ACTION_POWER_DISCONNECTED)
        }
        val receiver = object : BroadcastReceiver() {
            override fun onReceive(c: Context, i: Intent) = Refresh.now(c.applicationContext)
        }
        val app = ctx.applicationContext
        if (Build.VERSION.SDK_INT >= 33) app.registerReceiver(receiver, filter, Context.RECEIVER_NOT_EXPORTED)
        else app.registerReceiver(receiver, filter)
    }
}
