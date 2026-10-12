package io.github.lucidfuzz.foundry

import android.app.Application
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.os.Bundle

class FoundryApp : Application() {
    override fun onCreate() {
        super.onCreate()
        PowerWatch.register(this)
        Refresh.ensureScheduled(this)
    }
}

/** The one resizable Foundry widget. What each placed widget shows is chosen in WidgetConfigActivity. */
class FoundryWidgetProvider : AppWidgetProvider() {
    override fun onUpdate(ctx: Context, mgr: AppWidgetManager, ids: IntArray) {
        // Show the last picture straight away, then redraw.
        for (id in ids) if (!WidgetUpdater.showCached(ctx, id)) {
            WidgetUpdater.showMessage(ctx, id, ctx.getString(if (WidgetStore.get(ctx, id) == null) R.string.widget_needs_setup else R.string.widget_loading))
        }
        Refresh.ensureScheduled(ctx)
        Refresh.now(ctx, ids.filter { WidgetStore.get(ctx, it) != null }.toIntArray().takeIf { it.isNotEmpty() } ?: return)
    }

    override fun onAppWidgetOptionsChanged(ctx: Context, mgr: AppWidgetManager, id: Int, options: Bundle) {
        // Resized: redraw at the new pixel size.
        if (WidgetStore.get(ctx, id) != null) Refresh.now(ctx, intArrayOf(id))
    }

    override fun onDeleted(ctx: Context, ids: IntArray) {
        for (id in ids) WidgetStore.remove(ctx, id)
    }

    override fun onEnabled(ctx: Context) = Refresh.ensureScheduled(ctx)

    override fun onDisabled(ctx: Context) = Refresh.cancelAll(ctx)

    override fun onRestored(ctx: Context, oldIds: IntArray, newIds: IntArray) {
        for (i in oldIds.indices) if (i < newIds.size) WidgetStore.move(ctx, oldIds[i], newIds[i])
    }
}
