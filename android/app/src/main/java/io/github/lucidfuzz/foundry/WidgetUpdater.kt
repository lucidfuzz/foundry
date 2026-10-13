package io.github.lucidfuzz.foundry

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.BitmapShader
import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.RectF
import android.graphics.Shader
import android.os.Build
import android.view.View
import android.widget.RemoteViews
import kotlin.math.max
import kotlin.math.min

/** Renders placed widgets and puts the pictures on the home screen. */
object WidgetUpdater {
    fun allIds(ctx: Context): IntArray = try {
        AppWidgetManager.getInstance(ctx).getAppWidgetIds(ComponentName(ctx, FoundryWidgetProvider::class.java))
    } catch (e: Exception) { IntArray(0) }

    /** The widget's size on screen in pixels (portrait: min width x max height), or null if the launcher hasn't said. */
    private fun sizePx(ctx: Context, id: Int): Pair<Float, Float>? {
        val o = AppWidgetManager.getInstance(ctx).getAppWidgetOptions(id) ?: return null
        val w = o.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH)
        val h = o.getInt(AppWidgetManager.OPTION_APPWIDGET_MAX_HEIGHT)
        if (w <= 0 || h <= 0) return null
        val d = ctx.resources.displayMetrics.density
        return w * d to h * d
    }

    /** Pixel scale for the render: as sharp as the widget is wide, at most 3x (keeps bitmaps under the RemoteViews limit). */
    fun scaleFor(ctx: Context, id: Int, family: Family): Double {
        val o = AppWidgetManager.getInstance(ctx).getAppWidgetOptions(id)
        val wDp = max(o?.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH) ?: 0, o?.getInt(AppWidgetManager.OPTION_APPWIDGET_MAX_WIDTH) ?: 0)
        val dm = ctx.resources.displayMetrics
        var scale = if (wDp > 0) wDp * dm.density / family.designWidth.toDouble() else dm.density.toDouble()
        scale = scale.coerceIn(1.0, 3.0)
        // RemoteViews refuses bitmaps bigger than 1.5 screens of memory; stay well inside that.
        val limit = dm.widthPixels.toDouble() * dm.heightPixels * 4 * 0.5
        val bytes = { s: Double -> family.designWidth * s * family.designHeight * s * 4 }
        while (scale > 1.0 && bytes(scale) > limit) scale -= 0.25
        return scale
    }

    fun request(ctx: Context, id: Int, cfg: WidgetConfig, theme: Theme): RenderRequest =
        RenderRequest(theme.script, cfg.family, cfg.mode, scaleFor(ctx, id, cfg.family), theme.info.scriptName)

    /**
     * Renders widget [id] and shows it. Worker thread only. Returns the time the script asked to be redrawn by, if any.
     * Refresh passes can overlap (periodic, charger, app open); the lock keeps them to one widget at a time so two passes
     * never save the same widget's picture at once.
     */
    fun refresh(ctx: Context, id: Int): Long? = synchronized(this) { refreshLocked(ctx, id) }

    private fun refreshLocked(ctx: Context, id: Int): Long? {
        val cfg = WidgetStore.get(ctx, id)
        if (cfg == null) { showMessage(ctx, id, ctx.getString(R.string.widget_needs_setup)); return null }
        val theme = ThemeStore.get(ctx, cfg.theme)
        if (theme == null) {
            // Its theme was removed: keep the last picture (or a message), and a tap opens the widget picker.
            if (!showCached(ctx, id, cfg, needsSetup = true)) showMessage(ctx, id, ctx.getString(R.string.widget_theme_missing, cfg.theme), needsSetup = true)
            return null
        }
        return try {
            val r = Renderer.get(ctx).renderBlocking(request(ctx, id, cfg, theme))
            if (!apply(ctx, id, cfg, r)) showCached(ctx, id, cfg)
            r.refreshAfter
        } catch (e: Exception) {
            // Offline, timed out or the script failed: keep the last picture.
            if (!showCached(ctx, id, cfg)) showMessage(ctx, id, ctx.getString(R.string.widget_failed))
            null
        }
    }

    /** Shows a fresh render and keeps it for next time. */
    fun apply(ctx: Context, id: Int, cfg: WidgetConfig, r: RenderResult): Boolean {
        val bmp = BitmapFactory.decodeByteArray(r.png, 0, r.png.size) ?: return false
        try { WidgetStore.saveImage(ctx, id, r.png, r.url) } catch (e: Exception) { }
        show(ctx, id, cfg, bmp, r.url, null)
        return true
    }

    /** Shows the last good picture, if there is one. */
    fun showCached(ctx: Context, id: Int, cfg: WidgetConfig? = WidgetStore.get(ctx, id), needsSetup: Boolean = false): Boolean {
        val f = WidgetStore.imageFile(ctx, id)
        val bmp = if (f.isFile) BitmapFactory.decodeFile(f.path) else null
        if (bmp == null || cfg == null) return false
        show(ctx, id, cfg, bmp, WidgetStore.lastUrl(ctx, id), null, needsSetup)
        return true
    }

    /** A text message instead of a picture. [needsSetup] makes a tap open the widget picker for this widget. */
    fun showMessage(ctx: Context, id: Int, message: String, needsSetup: Boolean = false) {
        val cfg = WidgetStore.get(ctx, id)
        show(ctx, id, cfg, null, null, message, needsSetup || cfg == null)
    }

    private fun show(ctx: Context, id: Int, cfg: WidgetConfig?, picture: Bitmap?, url: String?, message: String?, needsSetup: Boolean = cfg == null) {
        val rv = RemoteViews(ctx.packageName, R.layout.foundry_widget)
        if (picture != null) {
            rv.setInt(android.R.id.background, "setBackgroundResource", R.drawable.widget_clip)
            rv.setImageViewBitmap(R.id.widget_image, rounded(ctx, id, picture))
            rv.setViewVisibility(R.id.widget_image, View.VISIBLE)
            rv.setViewVisibility(R.id.widget_message, View.GONE)
            val label = cfg?.let { c -> ThemeStore.get(ctx, c.theme)?.info?.mode(c.mode)?.title ?: c.mode }
            rv.setContentDescription(R.id.widget_image, ctx.getString(R.string.widget_picture_description, cfg?.theme ?: "", label ?: ""))
        } else {
            rv.setInt(android.R.id.background, "setBackgroundResource", R.drawable.widget_bg)
            rv.setViewVisibility(R.id.widget_image, View.GONE)
            rv.setViewVisibility(R.id.widget_message, View.VISIBLE)
            rv.setTextViewText(R.id.widget_message, message ?: "")
        }
        rv.setOnClickPendingIntent(android.R.id.background, LinkActivity.pendingIntent(ctx, id, url, cfg?.theme, needsSetup))
        try { AppWidgetManager.getInstance(ctx).updateAppWidget(id, rv) } catch (e: Exception) { }
    }

    /** Rounds the picture's corners to the system widget radius as it will appear on screen (the image may be letterboxed). */
    private fun rounded(ctx: Context, id: Int, src: Bitmap): Bitmap {
        val dm = ctx.resources.displayMetrics
        val systemRadius = if (Build.VERSION.SDK_INT >= 31) {
            try { ctx.resources.getDimension(android.R.dimen.system_app_widget_background_radius) } catch (e: Exception) { 16 * dm.density }
        } else 16 * dm.density
        val shown = sizePx(ctx, id)?.let { (w, h) -> min(w / src.width, h / src.height) }
        val radius = (if (shown != null && shown > 0f) systemRadius / shown else min(src.width, src.height) * 0.08f)
            .coerceIn(0f, min(src.width, src.height) / 4f)
        if (radius < 1f) return src
        val out = Bitmap.createBitmap(src.width, src.height, Bitmap.Config.ARGB_8888)
        val paint = Paint(Paint.ANTI_ALIAS_FLAG or Paint.FILTER_BITMAP_FLAG).apply {
            shader = BitmapShader(src, Shader.TileMode.CLAMP, Shader.TileMode.CLAMP)
        }
        Canvas(out).drawRoundRect(RectF(0f, 0f, src.width.toFloat(), src.height.toFloat()), radius, radius, paint)
        return out
    }
}
