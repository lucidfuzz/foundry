package io.github.lucidfuzz.foundry

import android.Manifest
import android.app.Activity
import android.app.AlertDialog
import android.content.ClipboardManager
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.text.InputType
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.Toast
import android.window.OnBackInvokedCallback
import android.window.OnBackInvokedDispatcher
import java.text.DateFormat
import java.util.Date
import kotlin.math.min
import kotlin.math.roundToInt

/**
 * The Foundry app: import a theme (paste, open a .js file, or share one to Foundry), grant permissions, preview widgets,
 * and run Halcyon's two setup screens (allocation and radio) that replace Scriptable's in-app menus.
 */
class MainActivity : Activity() {
    companion object {
        const val EXTRA_THEME = "io.github.lucidfuzz.foundry.THEME"
        const val EXTRA_SHOW = "io.github.lucidfuzz.foundry.SHOW"
        const val SHOW_ALLOCATION = "allocation"
        private const val REQ_OPEN = 10
        private const val REQ_CALENDAR = 11
        private const val REQ_LOCATION = 12
        private const val MAX_SCRIPT_BYTES = 30 * 1024 * 1024
        private const val PREVIEWS = "previews"
        private var lastOpenRefresh = 0L
    }

    private var current: String? = null // theme shown, or null for the home screen
    private var previewFamily: Family = Family.MEDIUM
    private var afterCalendar: (() -> Unit)? = null
    private var backCallback: Any? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        current = savedInstanceState?.getString("theme")
        Family.of(savedInstanceState?.getString("family"))?.let { previewFamily = it }
        if (savedInstanceState == null && handle(intent)) return
        render()
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        if (!handle(intent)) render()
    }

    override fun onSaveInstanceState(out: Bundle) {
        super.onSaveInstanceState(out)
        out.putString("theme", current)
        out.putString("family", previewFamily.key)
    }

    override fun onStart() {
        super.onStart()
        LocationCache.requestFresh(this)
        // Opening the app redraws widgets (at most once a minute, since returning from a dialog also lands here).
        val now = System.currentTimeMillis()
        if (now - lastOpenRefresh > 60_000L && Refresh.hasWidgets(this)) {
            lastOpenRefresh = now
            Refresh.ensureScheduled(this)
            Refresh.now(this)
        }
    }

    override fun onStop() {
        super.onStop()
        Renderer.get(this).cancel(PREVIEWS)
    }

    // ---------- navigation ----------

    private fun render() {
        Renderer.get(this).cancel(PREVIEWS)
        val theme = current?.let { ThemeStore.get(this, it) }
        if (theme == null) { current = null; home() } else themeScreen(theme)
        setBackHandler(current != null)
    }

    private fun open(name: String?) {
        current = name
        if (name != null) ThemeStore.get(this, name)?.let { previewFamily = it.info.modes.firstOrNull()?.defaultFamily ?: Family.MEDIUM }
        render()
    }

    private fun goBack() = open(null)

    @Deprecated("Deprecated in Java")
    @Suppress("DEPRECATION")
    override fun onBackPressed() {
        if (current != null) goBack() else super.onBackPressed()
    }

    private fun setBackHandler(enabled: Boolean) {
        if (Build.VERSION.SDK_INT < 33) return
        val existing = backCallback as OnBackInvokedCallback?
        if (enabled && existing == null) {
            val cb = OnBackInvokedCallback { goBack() }
            onBackInvokedDispatcher.registerOnBackInvokedCallback(OnBackInvokedDispatcher.PRIORITY_DEFAULT, cb)
            backCallback = cb
        } else if (!enabled && existing != null) {
            onBackInvokedDispatcher.unregisterOnBackInvokedCallback(existing)
            backCallback = null
        }
    }

    /** Shared scripts, opened files and widget taps. Returns true if it took care of showing a screen. */
    private fun handle(i: Intent?): Boolean {
        i ?: return false
        when (i.action) {
            Intent.ACTION_SEND -> {
                val text = i.getStringExtra(Intent.EXTRA_TEXT)
                @Suppress("DEPRECATION")
                val stream: Uri? = if (Build.VERSION.SDK_INT >= 33) i.getParcelableExtra(Intent.EXTRA_STREAM, Uri::class.java)
                else i.getParcelableExtra<Uri>(Intent.EXTRA_STREAM)
                render()
                importScript(stream?.let { readUri(it) } ?: text)
                return true
            }
            Intent.ACTION_VIEW -> {
                val data = i.data
                if (data != null && data.scheme != "foundry") { render(); importScript(readUri(data)); return true }
            }
        }
        val theme = i.getStringExtra(EXTRA_THEME)
        val show = i.getStringExtra(EXTRA_SHOW) ?: if (i.data?.scheme == "foundry" && i.data?.host == "run") SHOW_ALLOCATION else null
        if (theme != null || show != null) {
            val target = theme?.let { ThemeStore.get(this, it) } ?: if (show == SHOW_ALLOCATION) ThemeStore.list(this).firstOrNull { it.info.hasHalcyonSetup } else null
            open(target?.info?.name)
            if (show == SHOW_ALLOCATION && target != null && target.info.hasHalcyonSetup) chooseAllocation(target.info)
            return true
        }
        return false
    }

    // ---------- home ----------

    private fun home() {
        val col = Ui.page(this)
        col.addView(Ui.title(this, getString(R.string.app_name)))
        col.addView(Ui.text(this, getString(R.string.home_intro), 15f, Ui.SOFT, top = 6))

        col.addView(Ui.heading(this, getString(R.string.home_themes)))
        val themes = ThemeStore.list(this)
        if (themes.isEmpty()) col.addView(Ui.text(this, getString(R.string.home_no_themes), 15f, Ui.SOFT, top = 8))
        for (t in themes) col.addView(Ui.row(this, t.info.name, describe(t.info)) { open(t.info.name) })

        col.addView(Ui.heading(this, getString(R.string.home_add)))
        col.addView(Ui.button(this, getString(R.string.import_paste), primary = true) { pasteFromClipboard() })
        col.addView(Ui.button(this, getString(R.string.import_file)) { pickFile() })
        col.addView(Ui.button(this, getString(R.string.import_type)) { typeScript() })
        col.addView(Ui.text(this, getString(R.string.import_share_hint), 13f, Ui.SOFT, top = 8))

        col.addView(Ui.heading(this, getString(R.string.home_permissions)))
        val cal = DeviceData.hasCalendar(this)
        col.addView(Ui.row(this, getString(if (cal) R.string.perm_calendar_on else R.string.perm_calendar_off), getString(R.string.perm_calendar_use)) {
            if (cal) openAppSettings() else askCalendar(null)
        })
        val loc = DeviceData.hasLocation(this)
        col.addView(Ui.row(this, getString(if (loc) R.string.perm_location_on else R.string.perm_location_off), getString(R.string.perm_location_use)) {
            if (loc) openAppSettings() else askLocation()
        })

        col.addView(Ui.heading(this, getString(R.string.home_how)))
        col.addView(Ui.text(this, getString(R.string.home_how_steps), 15f, Ui.TEXT, top = 8))
        col.addView(Ui.text(this, getString(R.string.home_footer), 13f, Ui.SOFT, top = 24))
    }

    private fun describe(info: ThemeInfo): String {
        val n = resources.getQuantityString(R.plurals.widget_count, info.modes.size, info.modes.size)
        return if (info.edition.isEmpty()) n else getString(R.string.theme_edition_line, info.edition, n)
    }

    // ---------- one theme: setup and previews ----------

    private fun themeScreen(theme: Theme) {
        val info = theme.info
        val col = Ui.page(this)
        col.addView(Ui.text(this, getString(R.string.back_to_themes), 15f, Ui.ACCENT).apply {
            setPadding(0, Ui.dp(context, 4), 0, Ui.dp(context, 12))
            setOnClickListener { goBack() }
        })
        col.addView(Ui.title(this, info.name))
        col.addView(Ui.text(this, describe(info), 15f, Ui.SOFT, top = 4))
        col.addView(Ui.text(this, getString(if (info.flexible) R.string.theme_sizes_flexible else R.string.theme_sizes_fixed), 14f, Ui.SOFT, top = 8))

        if (info.hasHalcyonSetup) {
            col.addView(Ui.heading(this, getString(R.string.setup_heading)))
            val chosen = HalcyonSettings.allocationTitle(this, info)
            col.addView(Ui.row(this, getString(R.string.setup_allocation), chosen?.let { getString(R.string.setup_allocation_now, it) } ?: getString(R.string.setup_allocation_none)) {
                chooseAllocation(info)
            })
            col.addView(Ui.row(this, getString(R.string.setup_radio), HalcyonSettings.radio(this, info)) { editRadio(info) })
        }

        col.addView(Ui.heading(this, getString(R.string.previews_heading)))
        if (info.flexible) {
            val fams = Family.entries
            col.addView(Ui.chips(this, fams.map { it.label }, fams.indexOf(previewFamily)) { previewFamily = fams[it]; render() })
        }
        val renderer = Renderer.get(this)
        val avail = resources.displayMetrics.widthPixels - Ui.dp(this, 32)
        for (mode in info.modes) {
            val fam = if (info.flexible) previewFamily else mode.defaultFamily
            val sizes = mode.sizes.joinToString(" / ") { it.label.lowercase() }
            val caption = (if (mode.code.isNotEmpty()) "${mode.code}  ${mode.title}" else mode.title) +
                "  ·  " + (if (info.flexible) fam.label.lowercase() else sizes)
            val p = Ui.Preview(this, caption)
            col.addView(p.view)
            // Draw at the size the preview is shown (small widgets at their real proportion to medium ones).
            val widthPx = (avail * fam.designWidth / 364.0).roundToInt()
            val scale = min(3.0, widthPx / fam.designWidth.toDouble()).coerceAtLeast(1.0)
            renderer.render(RenderRequest(theme.script, fam, mode.key, scale, info.scriptName), PREVIEWS) { r, err ->
                if (isFinishing || isDestroyed) return@render
                val bmp = r?.let { BitmapFactory.decodeByteArray(it.png, 0, it.png.size) }
                // Corners as on a home screen: about 22 points at the widget's design size.
                if (r != null && bmp != null) p.show(bmp, widthPx, widthPx * 22f / fam.designWidth, r.ms)
                else if (err != "Cancelled") p.fail(err ?: getString(R.string.preview_failed))
            }
        }

        col.addView(Ui.heading(this, getString(R.string.theme_manage)))
        col.addView(Ui.button(this, getString(R.string.theme_remove)) {
            AlertDialog.Builder(this)
                .setTitle(getString(R.string.theme_remove_title, info.name))
                .setMessage(R.string.theme_remove_message)
                .setPositiveButton(R.string.theme_remove_confirm) { _, _ -> ThemeStore.delete(this, info.name); goBack() }
                .setNegativeButton(android.R.string.cancel, null)
                .show()
        })
    }

    /** Recreates the script's allocation_setup: pick a timed event from the next 90 days; Shift counts down to it. */
    private fun chooseAllocation(info: ThemeInfo) {
        if (!DeviceData.hasCalendar(this)) { askCalendar { chooseAllocation(info) }; return }
        val now = System.currentTimeMillis()
        val events = try {
            HalcyonSettings.allocationChoices(DeviceData.calendar(this, now, now + 90L * 86_400_000L), now)
        } catch (e: Exception) {
            Toast.makeText(this, R.string.calendar_unavailable, Toast.LENGTH_LONG).show(); return
        }
        if (events.isEmpty()) {
            AlertDialog.Builder(this).setTitle(R.string.allocation_title).setMessage(R.string.allocation_none)
                .setPositiveButton(android.R.string.ok, null).show()
            return
        }
        val fmt = DateFormat.getDateTimeInstance(DateFormat.MEDIUM, DateFormat.SHORT)
        val labels = events.map { "${it.title} · ${it.calendar}\n${fmt.format(Date(it.start))}" }.toTypedArray()
        AlertDialog.Builder(this)
            .setTitle(R.string.allocation_title)
            .setItems(labels) { _, which ->
                val e = events[which]
                HalcyonSettings.saveAllocation(this, info, e)
                Toast.makeText(this, getString(R.string.allocation_saved, e.title), Toast.LENGTH_LONG).show()
                Refresh.now(this)
                render()
            }
            .setNegativeButton(android.R.string.cancel, null)
            .show()
        Toast.makeText(this, R.string.allocation_explain, Toast.LENGTH_LONG).show()
    }

    /** Recreates the script's radio_setup: one link for the music app or stream that Audio Channel opens. */
    private fun editRadio(info: ThemeInfo) {
        val field = EditText(this).apply {
            setText(HalcyonSettings.radio(this@MainActivity, info))
            inputType = InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_URI
            setSingleLine()
            setSelectAllOnFocus(true)
        }
        val box = LinearLayout(this).apply {
            val p = Ui.dp(context, 20)
            setPadding(p, Ui.dp(context, 8), p, 0)
            addView(field, LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT))
        }
        AlertDialog.Builder(this)
            .setTitle(R.string.radio_title)
            .setMessage(R.string.radio_message)
            .setView(box)
            .setPositiveButton(R.string.radio_save) { _, _ ->
                if (HalcyonSettings.saveRadio(this, info, field.text.toString())) { Refresh.now(this); render() }
                else Toast.makeText(this, R.string.radio_invalid, Toast.LENGTH_LONG).show()
            }
            .setNegativeButton(android.R.string.cancel, null)
            .show()
    }

    // ---------- import ----------

    private fun importScript(text: String?) {
        if (text.isNullOrBlank()) {
            alert(R.string.import_nothing_title, R.string.import_nothing)
            return
        }
        val existing = ScriptInfo.parse(text)?.let { ThemeStore.get(this, it.name) } != null
        val theme = try { ThemeStore.save(this, text) } catch (e: Exception) { null }
        if (theme == null) { alert(R.string.import_not_foundry_title, R.string.import_not_foundry); return }
        Toast.makeText(this, getString(if (existing) R.string.import_updated else R.string.import_done, theme.info.name), Toast.LENGTH_LONG).show()
        Refresh.now(this)
        open(theme.info.name)
    }

    private fun pasteFromClipboard() {
        val cm = getSystemService(ClipboardManager::class.java)
        val clip = cm?.primaryClip
        val text = if (clip != null && clip.itemCount > 0) clip.getItemAt(0).coerceToText(this)?.toString() else null
        if (text.isNullOrBlank()) alert(R.string.import_nothing_title, R.string.import_clipboard_empty) else importScript(text)
    }

    @Suppress("DEPRECATION")
    private fun pickFile() {
        val i = Intent(Intent.ACTION_OPEN_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("*/*")
        try { startActivityForResult(i, REQ_OPEN) } catch (e: Exception) { alert(R.string.import_nothing_title, R.string.import_no_picker) }
    }

    private fun typeScript() {
        val field = EditText(this).apply {
            hint = getString(R.string.import_type_hint)
            minLines = 4
            maxLines = 8
            inputType = InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_FLAG_MULTI_LINE or InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS
        }
        val box = LinearLayout(this).apply {
            val p = Ui.dp(context, 20)
            setPadding(p, Ui.dp(context, 8), p, 0)
            addView(field, LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT))
        }
        AlertDialog.Builder(this)
            .setTitle(R.string.import_type)
            .setView(box)
            .setPositiveButton(R.string.import_button) { _, _ -> importScript(field.text.toString()) }
            .setNegativeButton(android.R.string.cancel, null)
            .show()
    }

    @Deprecated("Deprecated in Java")
    @Suppress("DEPRECATION")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == REQ_OPEN && resultCode == RESULT_OK) data?.data?.let { importScript(readUri(it)) }
    }

    private fun readUri(uri: Uri): String? = try {
        contentResolver.openInputStream(uri)?.use { input ->
            val out = java.io.ByteArrayOutputStream()
            val buf = ByteArray(64 * 1024)
            while (true) {
                val n = input.read(buf)
                if (n < 0) break
                out.write(buf, 0, n)
                if (out.size() > MAX_SCRIPT_BYTES) return null
            }
            out.toString("UTF-8")
        }
    } catch (e: Exception) { null }

    // ---------- permissions (explained in plain language before Android asks) ----------

    private fun askCalendar(then: (() -> Unit)?) {
        AlertDialog.Builder(this)
            .setTitle(R.string.perm_calendar_title)
            .setMessage(R.string.perm_calendar_why)
            .setPositiveButton(R.string.perm_continue) { _, _ ->
                afterCalendar = then
                requestPermissions(arrayOf(Manifest.permission.READ_CALENDAR), REQ_CALENDAR)
            }
            .setNegativeButton(R.string.perm_not_now, null)
            .show()
    }

    private fun askLocation() {
        AlertDialog.Builder(this)
            .setTitle(R.string.perm_location_title)
            .setMessage(R.string.perm_location_why)
            .setPositiveButton(R.string.perm_continue) { _, _ ->
                requestPermissions(arrayOf(Manifest.permission.ACCESS_COARSE_LOCATION), REQ_LOCATION)
            }
            .setNegativeButton(R.string.perm_not_now, null)
            .show()
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        val granted = grantResults.isNotEmpty() && grantResults.all { it == PackageManager.PERMISSION_GRANTED }
        if (granted) {
            if (requestCode == REQ_LOCATION) LocationCache.requestFresh(this)
            Refresh.now(this)
            render()
            if (requestCode == REQ_CALENDAR) afterCalendar?.invoke()
        } else if (requestCode == REQ_CALENDAR || requestCode == REQ_LOCATION) {
            AlertDialog.Builder(this)
                .setTitle(if (requestCode == REQ_CALENDAR) R.string.perm_calendar_title else R.string.perm_location_title)
                .setMessage(R.string.perm_denied)
                .setPositiveButton(R.string.perm_open_settings) { _, _ -> openAppSettings() }
                .setNegativeButton(R.string.perm_not_now, null)
                .show()
        }
        afterCalendar = null
    }

    private fun openAppSettings() {
        try {
            startActivity(Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.fromParts("package", packageName, null)))
        } catch (e: Exception) { }
    }

    private fun alert(title: Int, message: Int) {
        AlertDialog.Builder(this).setTitle(title).setMessage(message).setPositiveButton(android.R.string.ok, null).show()
    }
}
