package io.github.lucidfuzz.foundry

/** Final touches to a widget link before Android opens it (the runtime already maps iPhone app links). */
object Links {
    private val CALENDAR = Regex("""^content://com\.android\.calendar/time/?$""")
    private val INSTAGRAM_APP = Regex("""^https://www\.instagram\.com/app/?$""")

    fun forAndroid(url: String, nowMs: Long): String {
        val u = url.trim()
        return when {
            // Calendar links need a time to open at; the runtime maps calshow:// to content://com.android.calendar/time/.
            CALENDAR.matches(u) -> u.trimEnd('/') + "/" + nowMs
            // The runtime turns instagram://app into instagram.com/app, which isn't a page; open Instagram's home instead.
            INSTAGRAM_APP.matches(u) -> "https://www.instagram.com/"
            else -> u
        }
    }
}
