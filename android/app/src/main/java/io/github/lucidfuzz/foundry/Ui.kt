package io.github.lucidfuzz.foundry

import android.app.Activity
import android.content.Context
import android.graphics.Bitmap
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.text.TextUtils
import android.util.TypedValue
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import kotlin.math.roundToInt

/** Plain views built in code, in Foundry's dark look. */
object Ui {
    const val BG = 0xFF16181B.toInt()
    const val CARD = 0xFF202328.toInt()
    const val LINE = 0xFF2E3238.toInt()
    const val TEXT = 0xFFEDEDE9.toInt()
    const val SOFT = 0xFFA3A6AD.toInt()
    const val ACCENT = 0xFF9D8CF2.toInt()
    const val WARN = 0xFFFFB4A8.toInt()

    fun dp(ctx: Context, v: Number): Int = (v.toFloat() * ctx.resources.displayMetrics.density).roundToInt()

    /**
     * A scrolling page whose content stays clear of the status and navigation bars. Returns the column to fill.
     * [keepScroll] keeps the scroll position of the page it replaces (redrawing the same screen after a choice).
     */
    fun page(activity: Activity, keepScroll: Boolean = false): LinearLayout {
        val previous = ((activity.findViewById<ViewGroup>(android.R.id.content)?.getChildAt(0) as? ViewGroup)
            ?.getChildAt(0) as? ScrollView)?.scrollY ?: 0
        val col = LinearLayout(activity).apply {
            orientation = LinearLayout.VERTICAL
            val p = dp(activity, 16)
            setPadding(p, p, p, dp(activity, 32))
        }
        val scroll = ScrollView(activity).apply {
            isFillViewport = true
            addView(col, ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT))
        }
        val root = FrameLayout(activity).apply {
            setBackgroundColor(BG)
            fitsSystemWindows = true
            addView(scroll, FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT))
        }
        activity.setContentView(root)
        if (keepScroll && previous > 0) scroll.post { scroll.scrollTo(0, previous) }
        return col
    }

    fun text(ctx: Context, s: CharSequence, size: Float = 15f, color: Int = TEXT, bold: Boolean = false, top: Int = 0): TextView =
        TextView(ctx).apply {
            text = s
            setTextColor(color)
            setTextSize(TypedValue.COMPLEX_UNIT_SP, size)
            if (bold) typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            setLineSpacing(0f, 1.15f)
            layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
                topMargin = dp(ctx, top)
            }
        }

    fun title(ctx: Context, s: CharSequence) = text(ctx, s, 26f, TEXT, bold = true).apply {
        typeface = Typeface.create(Typeface.SERIF, Typeface.BOLD)
    }

    fun heading(ctx: Context, s: CharSequence) = text(ctx, s, 13f, SOFT, bold = true, top = 24).apply {
        letterSpacing = 0.08f
        isAllCaps = true
    }

    fun button(ctx: Context, s: CharSequence, primary: Boolean = false, onClick: () -> Unit): Button =
        Button(ctx).apply {
            text = s
            isAllCaps = false
            setTextColor(if (primary) BG else TEXT)
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 15f)
            background = GradientDrawable().apply {
                cornerRadius = dp(ctx, 12).toFloat()
                setColor(if (primary) ACCENT else CARD)
                if (!primary) setStroke(dp(ctx, 1), LINE)
            }
            stateListAnimator = null
            minHeight = dp(ctx, 48)
            setPadding(dp(ctx, 16), dp(ctx, 10), dp(ctx, 16), dp(ctx, 10))
            setOnClickListener { onClick() }
            layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
                topMargin = dp(ctx, 10)
            }
        }

    /** A tappable card with a title and a smaller second line. */
    fun row(ctx: Context, first: CharSequence, second: CharSequence?, selected: Boolean = false, onClick: (() -> Unit)?): LinearLayout =
        LinearLayout(ctx).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(ctx, 16), dp(ctx, 12), dp(ctx, 16), dp(ctx, 12))
            background = GradientDrawable().apply {
                cornerRadius = dp(ctx, 12).toFloat()
                setColor(CARD)
                setStroke(dp(ctx, if (selected) 2 else 1), if (selected) ACCENT else LINE)
            }
            addView(text(ctx, first, 16f, TEXT, bold = true))
            if (!second.isNullOrEmpty()) addView(text(ctx, second, 13f, SOFT, top = 2))
            if (onClick != null) {
                isClickable = true
                isFocusable = true
                setOnClickListener { onClick() }
            }
            layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
                topMargin = dp(ctx, 10)
            }
        }

    /** A horizontal row of choices (sizes); the chosen one is highlighted. */
    fun chips(ctx: Context, labels: List<String>, chosen: Int, onPick: (Int) -> Unit): LinearLayout =
        LinearLayout(ctx).apply {
            orientation = LinearLayout.HORIZONTAL
            labels.forEachIndexed { i, label ->
                addView(TextView(ctx).apply {
                    text = label
                    gravity = Gravity.CENTER
                    setTextSize(TypedValue.COMPLEX_UNIT_SP, 14f)
                    setTextColor(if (i == chosen) BG else TEXT)
                    background = GradientDrawable().apply {
                        cornerRadius = dp(ctx, 18).toFloat()
                        setColor(if (i == chosen) ACCENT else CARD)
                        setStroke(dp(ctx, 1), if (i == chosen) ACCENT else LINE)
                    }
                    setPadding(dp(ctx, 14), dp(ctx, 8), dp(ctx, 14), dp(ctx, 8))
                    minHeight = dp(ctx, 40)
                    isClickable = true
                    isFocusable = true
                    setOnClickListener { onPick(i) }
                    layoutParams = LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f).apply {
                        if (i > 0) marginStart = dp(ctx, 8)
                    }
                })
            }
            layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
                topMargin = dp(ctx, 12)
            }
        }

    /** A widget preview: caption, then the picture once it has rendered. */
    class Preview(ctx: Context, caption: String) {
        val view: LinearLayout = LinearLayout(ctx).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
                topMargin = dp(ctx, 18)
            }
        }
        private val label = text(ctx, caption, 13f, SOFT)
        private val status = text(ctx, ctx.getString(R.string.preview_rendering), 13f, SOFT, top = 6)
        private val image = ImageView(ctx).apply {
            adjustViewBounds = true
            scaleType = ImageView.ScaleType.FIT_START
            visibility = View.GONE
            layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
                topMargin = dp(ctx, 6)
            }
        }

        init {
            label.maxLines = 2
            label.ellipsize = null
            view.addView(label)
            view.addView(status)
            view.addView(image)
        }

        /** Shows the picture [widthPx] wide, with widget-like rounded corners ([radiusPx]). */
        fun show(bitmap: Bitmap, widthPx: Int, radiusPx: Float, ms: Long) {
            image.setImageBitmap(bitmap)
            image.background = GradientDrawable().apply { cornerRadius = radiusPx; setColor(0) }
            image.clipToOutline = true
            image.layoutParams = (image.layoutParams as LinearLayout.LayoutParams).apply {
                width = widthPx
                height = (widthPx.toFloat() * bitmap.height / bitmap.width).roundToInt()
            }
            image.visibility = View.VISIBLE
            status.visibility = View.GONE
            image.contentDescription = label.text
            label.text = TextUtils.concat(label.text, "  ·  ${ms} ms")
        }

        fun fail(message: String) {
            status.text = message
            status.setTextColor(WARN)
        }
    }
}
