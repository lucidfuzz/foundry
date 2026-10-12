package io.github.lucidfuzz.foundry

import android.app.Activity
import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle

/**
 * Invisible stop between a widget tap and its destination: opens the link the script set (already rewritten for Android by
 * the runtime) and falls back to the Foundry app when nothing on the phone can open it, or when the script set no link.
 */
class LinkActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val id = intent.getIntExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, AppWidgetManager.INVALID_APPWIDGET_ID)
        if (intent.getBooleanExtra(EXTRA_SETUP, false) && id != AppWidgetManager.INVALID_APPWIDGET_ID) {
            startActivity(
                Intent(this, WidgetConfigActivity::class.java)
                    .putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, id)
                    .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK),
            )
        } else {
            open(this, intent.getStringExtra(EXTRA_URL), intent.getStringExtra(EXTRA_THEME))
        }
        finish()
    }

    companion object {
        private const val EXTRA_URL = "url"
        private const val EXTRA_THEME = "theme"
        private const val EXTRA_SETUP = "setup"

        fun pendingIntent(ctx: Context, id: Int, url: String?, theme: String?, needsSetup: Boolean): PendingIntent {
            val i = Intent(ctx, LinkActivity::class.java)
                .setData(Uri.parse("foundry-widget://tap/$id")) // one distinct PendingIntent per widget
                .putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, id)
                .putExtra(EXTRA_URL, url)
                .putExtra(EXTRA_THEME, theme)
                .putExtra(EXTRA_SETUP, needsSetup)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_NO_ANIMATION)
            return PendingIntent.getActivity(ctx, id, i, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
        }

        fun open(ctx: Context, url: String?, theme: String?) {
            val target = url?.trim().orEmpty()
            // foundry://run is what the script links to when Shift still needs its allocation chosen.
            if (target.startsWith("foundry:")) { openApp(ctx, theme, if (target.startsWith("foundry://run")) MainActivity.SHOW_ALLOCATION else null); return }
            if (target.isNotEmpty()) {
                try {
                    ctx.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(Links.forAndroid(target, System.currentTimeMillis()))).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
                    return
                } catch (e: Exception) {
                    // Nothing installed handles this link: fall through to the app.
                }
            }
            openApp(ctx, theme, null)
        }

        private fun openApp(ctx: Context, theme: String?, show: String?) {
            ctx.startActivity(
                Intent(ctx, MainActivity::class.java)
                    .putExtra(MainActivity.EXTRA_THEME, theme)
                    .putExtra(MainActivity.EXTRA_SHOW, show)
                    .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP),
            )
        }
    }
}
