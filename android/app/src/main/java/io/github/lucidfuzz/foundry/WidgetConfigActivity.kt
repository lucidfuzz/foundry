package io.github.lucidfuzz.foundry

import android.app.Activity
import android.appwidget.AppWidgetManager
import android.content.Intent
import android.graphics.BitmapFactory
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.widget.Button
import kotlin.math.min
import kotlin.math.roundToInt

/**
 * Shown when a Foundry widget is placed (and when it's reconfigured): pick the theme, the widget (mode) and its size.
 * Original editions offer only each widget's intended size, read from the script header; Illustrated and Expanded editions
 * offer small, medium and large.
 */
class WidgetConfigActivity : Activity() {
    private var widgetId = AppWidgetManager.INVALID_APPWIDGET_ID
    private var themeName: String? = null
    private var modeKey: String? = null
    private var family: Family? = null
    private var saving = false
    private var changing = false // reconfiguring a widget that's already placed

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        widgetId = intent?.getIntExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, AppWidgetManager.INVALID_APPWIDGET_ID)
            ?: AppWidgetManager.INVALID_APPWIDGET_ID
        // Backing out without choosing cancels the placement.
        setResult(RESULT_CANCELED, Intent().putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, widgetId))
        // Only configure Foundry's own widgets (this screen can be opened by other apps).
        val provider = try { AppWidgetManager.getInstance(this).getAppWidgetInfo(widgetId)?.provider } catch (e: Exception) { null }
        if (widgetId == AppWidgetManager.INVALID_APPWIDGET_ID || provider?.packageName != packageName) { finish(); return }
        if (savedInstanceState?.getBoolean("saving") == true) {
            // Rotated while the widget was being drawn: the choice is saved, so finish the placement.
            setResult(RESULT_OK, Intent().putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, widgetId))
            Refresh.now(this, intArrayOf(widgetId))
            finish()
            return
        }
        val existing = WidgetStore.get(this, widgetId)
        changing = existing != null
        themeName = savedInstanceState?.getString("theme") ?: existing?.theme
        modeKey = savedInstanceState?.getString("mode") ?: existing?.mode
        family = Family.of(savedInstanceState?.getString("family")) ?: existing?.family
    }

    override fun onResume() {
        super.onResume()
        if (!saving) build() // also picks up a theme imported in the app meanwhile
    }

    override fun onSaveInstanceState(out: Bundle) {
        super.onSaveInstanceState(out)
        out.putString("theme", themeName)
        out.putString("mode", modeKey)
        out.putString("family", family?.key)
        out.putBoolean("saving", saving)
    }

    override fun onStop() {
        super.onStop()
        Renderer.get(this).cancel(TAG)
    }

    private fun build() {
        Renderer.get(this).cancel(TAG)
        val col = Ui.page(this, keepScroll = true)
        col.addView(Ui.title(this, getString(if (changing) R.string.config_title_change else R.string.config_title)))
        val themes = ThemeStore.list(this)
        if (themes.isEmpty()) {
            col.addView(Ui.text(this, getString(R.string.config_no_themes), 15f, Ui.SOFT, top = 8))
            col.addView(Ui.button(this, getString(R.string.config_open_app), primary = true) {
                startActivity(Intent(this, MainActivity::class.java))
            })
            return
        }
        val theme = themes.firstOrNull { it.info.name == themeName } ?: themes.first()
        themeName = theme.info.name
        val info = theme.info
        val mode = info.mode(modeKey) ?: info.modes.first()
        modeKey = mode.key
        val fam = family?.takeIf { it in mode.sizes } ?: mode.defaultFamily
        family = fam

        col.addView(Ui.heading(this, getString(R.string.config_theme)))
        for (t in themes) col.addView(Ui.row(this, t.info.name, t.info.edition.takeIf { it.isNotEmpty() }, t.info.name == themeName) {
            themeName = t.info.name; modeKey = null; family = null; build()
        })

        col.addView(Ui.heading(this, getString(R.string.config_widget)))
        for (m in info.modes) {
            val sizes = m.sizes.joinToString(" / ") { it.label.lowercase() }
            val second = listOf(m.code, if (info.flexible) "" else sizes).filter { it.isNotEmpty() }.joinToString("  ·  ")
            col.addView(Ui.row(this, m.title, second, m.key == modeKey) { modeKey = m.key; family = null; build() })
        }

        col.addView(Ui.heading(this, getString(R.string.config_size)))
        if (mode.sizes.size > 1) {
            col.addView(Ui.chips(this, mode.sizes.map { it.label }, mode.sizes.indexOf(fam)) { family = mode.sizes[it]; build() })
        } else {
            col.addView(Ui.text(this, getString(R.string.config_size_fixed, fam.label), 15f, Ui.SOFT, top = 8))
        }
        col.addView(Ui.text(this, getString(R.string.config_resize_hint), 13f, Ui.SOFT, top = 8))

        val preview = Ui.Preview(this, getString(R.string.config_preview))
        col.addView(preview.view)
        val avail = resources.displayMetrics.widthPixels - Ui.dp(this, 32)
        val widthPx = (avail * fam.designWidth / 364.0).roundToInt()
        Renderer.get(this).render(RenderRequest(theme.script, fam, mode.key, min(3.0, widthPx / fam.designWidth.toDouble()).coerceAtLeast(1.0), info.scriptName), TAG) { r, err ->
            if (isFinishing || isDestroyed) return@render
            val bmp = r?.let { BitmapFactory.decodeByteArray(it.png, 0, it.png.size) }
            if (r != null && bmp != null) preview.show(bmp, widthPx, widthPx * 22f / fam.designWidth, r.ms)
            else if (err != "Cancelled") preview.fail(err ?: getString(R.string.preview_failed))
        }

        val add = Ui.button(this, getString(if (changing) R.string.config_save_change else R.string.config_save), primary = true) {}
        add.setOnClickListener { save(theme, mode, fam, add) }
        col.addView(add)
    }

    /** Saves the choice, draws the widget straight away (falling back to a background refresh), and closes. */
    private fun save(theme: Theme, mode: Mode, fam: Family, button: Button) {
        if (saving) return
        saving = true
        button.isEnabled = false
        button.text = getString(R.string.config_saving)
        val cfg = WidgetConfig(theme.info.name, mode.key, fam)
        WidgetStore.put(this, widgetId, cfg)
        // The choice is saved: the placement stands even if this screen is closed now, and the widget says it's drawing.
        setResult(RESULT_OK, Intent().putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, widgetId))
        WidgetUpdater.showMessage(this, widgetId, getString(R.string.widget_loading))
        Refresh.ensureScheduled(this)
        val handler = Handler(Looper.getMainLooper())
        var done = false
        val close = {
            if (!done) {
                done = true
                setResult(RESULT_OK, Intent().putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, widgetId))
                finish()
            }
        }
        handler.postDelayed({ if (!done) { Refresh.now(this, intArrayOf(widgetId)); close() } }, 12_000L)
        Renderer.get(this).render(WidgetUpdater.request(this, widgetId, cfg, theme)) { r, _ ->
            // Even after the 12-second fallback has closed the screen, a late picture is still put on the widget.
            if (r != null && WidgetUpdater.apply(applicationContext, widgetId, cfg, r)) {
                r.refreshAfter?.let { if (it - System.currentTimeMillis() < 14 * 60_000L) Refresh.at(applicationContext, it) }
            } else if (!done) Refresh.now(applicationContext, intArrayOf(widgetId))
            close()
        }
    }

    companion object {
        private const val TAG = "config"
    }
}
