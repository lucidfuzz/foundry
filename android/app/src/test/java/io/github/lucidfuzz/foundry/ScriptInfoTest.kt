package io.github.lucidfuzz.foundry

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Assume.assumeTrue
import org.junit.Test
import java.io.File

class ScriptInfoTest {
    // The header every export carries (src/tpl.js), after the "made with Foundry" line the site adds.
    private val header = """
        // FOUNDRY THEME WIDGETS
        // Set each widget's Parameter to one of:
        //   status (medium) · shift (small) · transmission (any) · solar (large is best) · audio (medium)
        //   feeds (medium) · youtube / instagram / discord (any) · oddity (small or medium, just for fun)
        //   game (any size, medium or large best): a little idle game for this theme that plays itself, one turn per refresh
        // Add :alt or :main after the mode to flip the header color, e.g. shift:main
    """.trimIndent()

    private fun script(first: String, theme: String, body: String = "") =
        "$first\n$header\nconst T = $theme\n$body\nconst PARTS = ((args.widgetParameter || \"\") + \"\")\nScript.setWidget(w)\n"

    private val originalTheme = "{\n  \"hbOn\": false,\n  \"company\": \"Halcyon Biofab\",\n  \"frame\": \"halcyon\"\n}"
    private val illustratedTheme = "{\n  \"hbOn\": true,\n  \"company\": \"Halcyon Biofab\",\n  \"frame\": \"halcyon\"\n}"
    private val hbMeta = """
        const HB_META = {
          status: ['W-01', 'SUBJECT STATUS', 'Care builds momentum.'],
          shift: ['W-02', 'ALLOCATION', 'Your time has been considered.'],
          game: ['W-10', 'SPECIMEN VAT', 'Property status unchanged.'],
          tracker: ['HB-R', 'DISTANT OBSERVATION', 'Return address pending.'],
          dossier: ['HB-D', 'TARGET DOSSIER', 'Custody review pending.']
        };
    """.trimIndent()

    @Test fun readsTheNameFromTheSiteExportAndTheSpecForm() {
        assertEquals("Halcyon Biofab", ScriptInfo.company("// Halcyon Biofab — made with Foundry\nconst x = 1"))
        assertEquals("Halcyon Biofab", ScriptInfo.company("// Halcyon Biofab, made with Foundry"))
        assertEquals("Deep Range", ScriptInfo.company("\uFEFF// Deep Range — made with Foundry"))
        assertNull(ScriptInfo.company("// some other script\nmade with Foundry"))
        assertNull(ScriptInfo.company(""))
    }

    @Test fun originalEditionOffersEachWidgetsIntendedSizes() {
        val info = ScriptInfo.parse(script("// Halcyon Biofab — made with Foundry", originalTheme))
        assertNotNull(info); info!!
        assertEquals("Halcyon Biofab", info.name)
        assertEquals("Original", info.edition)
        assertFalse(info.flexible)
        assertFalse(info.hasHalcyonSetup)
        val sizes = info.modes.associate { it.key to it.sizes }
        assertEquals(
            listOf("status", "shift", "transmission", "solar", "audio", "feeds", "youtube", "instagram", "discord", "oddity", "game"),
            info.modes.map { it.key },
        )
        assertEquals(listOf(Family.MEDIUM), sizes["status"])
        assertEquals(listOf(Family.SMALL), sizes["shift"])
        assertEquals(Family.entries.toList(), sizes["transmission"])
        assertEquals(listOf(Family.LARGE), sizes["solar"])
        assertEquals(listOf(Family.MEDIUM), sizes["audio"])
        assertEquals(listOf(Family.MEDIUM), sizes["feeds"])
        assertEquals(Family.entries.toList(), sizes["youtube"])
        assertEquals(Family.entries.toList(), sizes["discord"])
        assertEquals(listOf(Family.SMALL, Family.MEDIUM), sizes["oddity"])
        assertEquals(Family.entries.toList(), sizes["game"])
        assertEquals(Family.LARGE, info.mode("solar")!!.defaultFamily)
        assertEquals(Family.MEDIUM, info.mode("game")!!.defaultFamily)
        assertEquals(Family.MEDIUM, info.mode("oddity")!!.defaultFamily)
        assertEquals(Family.SMALL, info.mode("shift")!!.defaultFamily)
    }

    @Test fun illustratedEditionOffersEveryWidgetAtEverySize() {
        val info = ScriptInfo.parse(script("// Halcyon Biofab — made with Foundry", illustratedTheme, hbMeta))!!
        assertEquals("Halcyon Biofab Illustrated", info.name)
        assertEquals("Illustrated", info.edition)
        assertTrue(info.flexible)
        assertTrue(info.hasHalcyonSetup)
        assertEquals(listOf("status", "shift", "game", "tracker", "dossier"), info.modes.map { it.key })
        assertTrue(info.modes.all { it.sizes == Family.entries.toList() })
        assertEquals("Subject Status", info.mode("status")!!.title)
        assertEquals("W-01", info.mode("status")!!.code)
        assertEquals("Halcyon", info.scriptName)
        assertEquals("foundry-halcyon-Halcyon.json", info.settingsFileName)
    }

    @Test fun theHbMetaTableIsIgnoredWhenTheEditionIsOff() {
        // Every export carries the Halcyon runtime; only "hbOn": true switches it on.
        val info = ScriptInfo.parse(script("// Halcyon Biofab — made with Foundry", originalTheme, hbMeta))!!
        assertEquals(11, info.modes.size)
        assertFalse(info.flexible)
    }

    @Test fun rejectsTextThatIsNotAWidgetScript() {
        assertNull(ScriptInfo.parse("hello"))
        assertNull(ScriptInfo.parse("// Halcyon Biofab — made with Foundry\nconsole.log(1)"))
    }

    @Test fun settingsKeyMatchesTheScriptsRule() {
        // hbSettings(): Script.name().replace(/[^a-z0-9_-]/gi, '_')
        assertEquals("Halcyon_Biofab", ScriptInfo.settingsKey("Halcyon Biofab"))
        assertEquals("a-b_c__d", ScriptInfo.settingsKey("a-b_c.éd"))
    }

    @Test fun flagOnlyReadsTopLevelThemeKeys() {
        assertTrue(ScriptInfo.flag("const T = {\n  \"hbOn\": true,\n}", "hbOn"))
        assertFalse(ScriptInfo.flag("const T = {\n  \"hbOn\": false,\n}", "hbOn"))
        assertFalse(ScriptInfo.flag("if (T.hbOn) {}", "hbOn"))
    }

    @Test fun calendarLinksGetATime() {
        assertEquals("content://com.android.calendar/time/123", Links.forAndroid("content://com.android.calendar/time/", 123))
        assertEquals("https://music.youtube.com/", Links.forAndroid(" https://music.youtube.com/ ", 123))
        assertEquals("https://www.instagram.com/", Links.forAndroid("https://www.instagram.com/app", 123))
    }

    @Test fun onlyRealImagesAreCachedAsArt() {
        assertTrue(NativeBridge.looksLikeImage(byteArrayOf(0x89.toByte(), 0x50, 0x4E, 0x47, 0x0D, 0x0A)))
        assertTrue(NativeBridge.looksLikeImage(byteArrayOf(0xFF.toByte(), 0xD8.toByte(), 0xFF.toByte(), 0xE0.toByte())))
        assertFalse(NativeBridge.looksLikeImage("<!doctype html><html>".toByteArray()))
        assertFalse(NativeBridge.looksLikeImage(ByteArray(0)))
    }

    @Test fun radioLinksFollowTheScriptsRule() {
        assertTrue(HalcyonSettings.validRadio("youtubemusic://"))
        assertTrue(HalcyonSettings.validRadio("https://example.com/stream"))
        assertFalse(HalcyonSettings.validRadio("javascript://alert(1)"))
        assertFalse(HalcyonSettings.validRadio("not a link"))
    }

    @Test fun allocationChoicesMatchTheScriptsSetup() {
        val now = 1_000_000L
        fun ev(title: String, cal: String, start: Long, end: Long, allDay: Boolean = false) =
            CalEvent(title, start, end, allDay, "Cal $cal", cal, "888888", "", "", "$title$start")
        val picked = HalcyonSettings.allocationChoices(
            listOf(
                ev("Later", "1", now + 5000, now + 6000),
                ev("Standup", "1", now + 2000, now + 3000),
                ev("Standup", "1", now + 9000, now + 9500), // repeat: listed once
                ev("Standup", "2", now + 4000, now + 4500), // other calendar: listed
                ev("Over", "1", now - 5000, now - 1000), // already over
                ev("Holiday", "1", now, now + 86_400_000, allDay = true), // all-day: skipped
            ),
            now,
        )
        assertEquals(listOf("Standup" to "1", "Standup" to "2", "Later" to "1"), picked.map { it.title to it.calendarId })
    }

    // ---- against the site's real sources, so a change to the export format is caught here ----

    private fun repoFile(path: String): File? =
        listOf(File("../../$path"), File("../$path"), File(path)).firstOrNull { it.isFile }

    @Test fun parsesTheRealTemplateHeader() {
        val tpl = repoFile("src/tpl.js")
        assumeTrue("src/tpl.js not found", tpl != null)
        val text = tpl!!.readText()
        val head = text.substring(0, text.indexOf("const T = "))
        val exported = "// Halcyon Biofab — made with Foundry\n" + head + "const T = " + originalTheme + "\n" + text.substring(text.indexOf("const T = ") + "const T = __THEME__".length)
        val info = ScriptInfo.parse(exported)
        assertNotNull(info)
        assertEquals(11, info!!.modes.size)
        assertEquals(listOf(Family.MEDIUM), info.mode("status")!!.sizes)
        assertEquals(listOf(Family.LARGE), info.mode("solar")!!.sizes)
    }

    @Test fun parsesTheRealHalcyonTable() {
        val paint = repoFile("src/halcyon/paint.js")
        assumeTrue("src/halcyon/paint.js not found", paint != null)
        val modes = ScriptInfo.metaModes(paint!!.readText(), "HB_META")
        assertEquals(ScriptInfo.ORDER, modes.map { it.key })
    }

    @Test fun parsesTheRealDeepRangeTable() {
        val paint = repoFile("src/deeprange/paint.js")
        assumeTrue("src/deeprange/paint.js not found", paint != null)
        val modes = ScriptInfo.metaModes(paint!!.readText(), "DR_META")
        assertEquals(ScriptInfo.ORDER.dropLast(1), modes.map { it.key })
    }
}
