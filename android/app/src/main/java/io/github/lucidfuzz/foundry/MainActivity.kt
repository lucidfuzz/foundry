package io.github.lucidfuzz.foundry

import android.Manifest
import android.annotation.SuppressLint
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
        private const val MAX_SCRIPT_BYTES = 8 * 1024 * 1024
        private var lastOpenRefresh = 0L
    }

    private var current: String? = null // theme shown, or null for the home screen
    private var previewFamily: Family = Family.MEDIUM
    private var afterCalendar: (() -> Unit)? = null
    private var backCallback: Any? = null
    private val previews = "previews-" + System.identityHashCode(this) // this screen's preview jobs
    private var previewsPending = 0 // previews queued and not yet answered
    private var previewsInterrupted = false
    private var pendingImport: Uri? = null // a file being read when the screen was recreated

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        current = savedInstanceState?.getString("theme")
        Family.of(savedInstanceState?.getString("family"))?.let { previewFamily = it }
        if (savedInstanceState == null && handle(intent)) return
        render()
        // Rotated (or otherwise recreated) while a script file was being read: read it again.
        @Suppress("DEPRECATION")
        val interrupted: Uri? = savedInstanceState?.getParcelable("import")
        interrupted?.let { importFrom(it) }
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
        out.putParcelable("import", pendingImport)
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
        // Unfinished previews are dropped while the app is out of sight, and drawn again on return.
        previewsInterrupted = previewsPending > 0
        Renderer.get(this).cancel(previews)
    }

    override fun onRestart() {
        super.onRestart()
        if (previewsInterrupted) { previewsInterrupted = false; render() }
    }

    // ---------- navigation ----------

    private var shown: String? = "" // the screen on display, so redrawing it keeps its scroll position

    private fun render() {
        Renderer.get(this).cancel(previews)
        val theme = current?.let { ThemeStore.get(this, it) }
        if (theme == null) current = null
        val same = shown == current
        shown = current
        if (theme == null) home(same) else themeScreen(theme, same)
        setBackHandler(current != null)
    }

    private fun open(name: String?) {
        current = name
        if (name != null) ThemeStore.get(this, name)?.let { previewFamily = it.info.modes.firstOrNull()?.defaultFamily ?: Family.MEDIUM }
        render()
    }

    private fun goBack() = open(null)

    // Android 8 to 12. From Android 13 the system uses the OnBackInvokedCallback registered below
    // (android:enableOnBackInvokedCallback is on), so this is not called there.
    @Deprecated("Deprecated in Java")
    @Suppress("DEPRECATION")
    @SuppressLint("GestureBackNavigation")
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
        // Reopening Foundry from Recents replays the intent that first opened it; don't import the same script again.
        if ((i.flags and Intent.FLAG_ACTIVITY_LAUNCHED_FROM_HISTORY) != 0) return false
        when (i.action) {
            Intent.ACTION_SEND -> {
                val text = i.getStringExtra(Intent.EXTRA_TEXT)
                @Suppress("DEPRECATION")
                val stream: Uri? = if (Build.VERSION.SDK_INT >= 33) i.getParcelableExtra(Intent.EXTRA_STREAM, Uri::class.java)
                else i.getParcelableExtra<Uri>(Intent.EXTRA_STREAM)
                render()
                if (stream != null) importFrom(stream) else importScript(text)
                return true
            }
            Intent.ACTION_VIEW -> {
                val data = i.data
                if (data != null && data.scheme != "foundry") { render(); importFrom(data); return true }
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

    private fun home(keepScroll: Boolean) {
        val col = Ui.page(this, keepScroll)
        col.addView(Ui.title(this, getString(R.string.app_name)))
        col.addView(Ui.text(this, getString(R.string.home_intro), 15f, Ui.SOFT, top = 6))

        col.addView(Ui.heading(this, getString(R.string.home_themes)))
        val themes = ThemeStore.list(this)
        if (themes.isEmpty()) col.addView(Ui.text(this, getString(R.string.home_no_themes), 15f, Ui.SOFT, top = 8))
        for (t in themes) col.addView(Ui.row(this, t.info.name, describe(t.info)) { open(t.info.name) })

        col.addView(Ui.heading(this, getString(R.string.home_add)))
        val bigClipboard = Build.VERSION.SDK_INT >= 30 // older Android can't hold a whole script on the clipboard
        col.addView(Ui.button(this, getString(R.string.import_paste), primary = bigClipboard) { pasteFromClipboard() })
        col.addView(Ui.button(this, getString(R.string.import_file), primary = !bigClipboard) { pickFile() })
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

    private fun themeScreen(theme: Theme, keepScroll: Boolean) {
        val info = theme.info
        val col = Ui.page(this, keepScroll)
        col.addView(Ui.link(this, getString(R.string.back_to_themes), getString(R.string.back_to_themes_description)) { goBack() })
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
            previewsPending++
            renderer.render(RenderRequest(theme.script, fam, mode.key, scale, info.scriptName), previews) { r, err ->
                previewsPending--
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
                .setPositiveButton(R.string.theme_remove_confirm) { _, _ -> ThemeStore.delete(this, info.name); Refresh.now(this); goBack() }
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
            alert(R.string.allocation_title, R.string.calendar_unavailable); return
        }
        if (events.isEmpty()) {
            AlertDialog.Builder(this).setTitle(R.string.allocation_title).setMessage(R.string.allocation_none)
                .setPositiveButton(android.R.string.ok, null).show()
            return
        }
        val fmt = DateFormat.getDateTimeInstance(DateFormat.MEDIUM, DateFormat.SHORT)
        val labels = events.map { "${it.title} · ${it.calendar}\n${fmt.format(Date(it.start))}" }.toTypedArray()
        val head = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            val p = Ui.dp(context, 24)
            setPadding(p, Ui.dp(context, 20), p, Ui.dp(context, 8))
            addView(Ui.text(context, getString(R.string.allocation_title), 20f, Ui.TEXT, bold = true).apply { if (Build.VERSION.SDK_INT >= 28) isAccessibilityHeading = true })
            addView(Ui.text(context, getString(R.string.allocation_explain), 14f, Ui.SOFT, top = 6))
        }
        AlertDialog.Builder(this)
            .setCustomTitle(head)
            .setItems(labels) { _, which ->
                val e = events[which]
                if (!HalcyonSettings.saveAllocation(this, info, e)) { alert(R.string.allocation_title, R.string.save_failed); return@setItems }
                Toast.makeText(this, getString(R.string.allocation_saved, e.title), Toast.LENGTH_LONG).show()
                Refresh.now(this)
                render()
            }
            .setNegativeButton(android.R.string.cancel, null)
            .show()
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
        val dialog = AlertDialog.Builder(this)
            .setTitle(R.string.radio_title)
            .setMessage(R.string.radio_message)
            .setView(box)
            .setPositiveButton(R.string.radio_save, null)
            .setNegativeButton(android.R.string.cancel, null)
            .show()
        // Checked before closing, so a link that isn't accepted can be corrected instead of retyped.
        dialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener {
            val link = field.text.toString()
            when {
                !HalcyonSettings.validRadio(link) -> field.error = getString(R.string.radio_invalid)
                !HalcyonSettings.saveRadio(this, info, link) -> field.error = getString(R.string.save_failed)
                else -> { dialog.dismiss(); Refresh.now(this); render() }
            }
        }
    }

    // ---------- import ----------

    private fun importScript(text: String?, fromClipboard: Boolean = false) {
        if (text.isNullOrBlank()) {
            alert(R.string.import_nothing_title, if (fromClipboard) R.string.import_clipboard_empty else R.string.import_nothing)
            return
        }
        val existing = ScriptInfo.parse(text)?.let { ThemeStore.get(this, it.name) } != null
        val theme = try { ThemeStore.save(this, text) } catch (e: Exception) { null }
        if (theme == null) {
            alert(R.string.import_not_foundry_title, if (fromClipboard) R.string.import_clipboard_not_foundry else R.string.import_not_foundry)
            return
        }
        Toast.makeText(this, getString(if (existing) R.string.import_updated else R.string.import_done, theme.info.name), Toast.LENGTH_LONG).show()
        Refresh.now(this)
        open(theme.info.name)
    }

    private fun pasteFromClipboard() {
        val text = try {
            val clip = getSystemService(ClipboardManager::class.java)?.primaryClip
            if (clip != null && clip.itemCount > 0) clip.getItemAt(0).coerceToText(this)?.toString() else null
        } catch (e: RuntimeException) { null }
        importScript(text, fromClipboard = true)
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
        if (requestCode == REQ_OPEN && resultCode == RESULT_OK) data?.data?.let { importFrom(it) }
    }

    /** Reads a shared or opened file off the main thread (it may be downloading from a cloud drive), then imports it. */
    private fun importFrom(uri: Uri) {
        Toast.makeText(this, R.string.import_reading, Toast.LENGTH_SHORT).show()
        pendingImport = uri
        Thread {
            val bytes = readUri(uri)
            runOnUiThread {
                if (isFinishing || isDestroyed) return@runOnUiThread
                pendingImport = null
                when {
                    bytes == null -> alert(R.string.import_nothing_title, R.string.import_nothing)
                    bytes.size > MAX_SCRIPT_BYTES -> alert(R.string.import_not_foundry_title, R.string.import_too_big)
                    // A zip (the website's Android pack or theme pack), not the widget script.
                    bytes.size > 3 && bytes[0] == 'P'.code.toByte() && bytes[1] == 'K'.code.toByte() -> alert(R.string.import_not_foundry_title, R.string.import_zip)
                    else -> importScript(String(bytes, Charsets.UTF_8))
                }
            }
        }.start()
    }

    /** The file's bytes (stopping just past the size limit), or null if it can't be read. */
    private fun readUri(uri: Uri): ByteArray? = try {
        contentResolver.openInputStream(uri)?.use { input ->
            val out = java.io.ByteArrayOutputStream()
            val buf = ByteArray(64 * 1024)
            while (out.size() <= MAX_SCRIPT_BYTES) {
                val n = input.read(buf)
                if (n < 0) break
                out.write(buf, 0, n)
            }
            out.toByteArray()
        }
    } catch (e: Throwable) { null }

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
