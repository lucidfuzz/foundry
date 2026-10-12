package io.github.lucidfuzz.foundry

// Everything the app needs to know about an exported Foundry widget script is read from the script itself: its name (first
// line), its edition (the theme JSON), and which widgets it offers at which sizes (the header comment, or the edition's own
// widget table). Pure Kotlin so it can be unit-tested without a phone.

/** The three Scriptable widget sizes, with the design size (in points) each widget is drawn at. */
enum class Family(val key: String, val label: String, val designWidth: Int, val designHeight: Int) {
    SMALL("small", "Small", 170, 170),
    MEDIUM("medium", "Medium", 364, 170),
    LARGE("large", "Large", 364, 382);

    companion object {
        fun of(key: String?): Family? = entries.firstOrNull { it.key == key }
    }
}

/** One widget a theme offers. [sizes] are the sizes the user may pick; [note] is the script's own size advice. */
data class Mode(val key: String, val title: String, val code: String, val sizes: List<Family>, val note: String) {
    /** The size used for previews and offered first: medium when allowed (as on the site), otherwise the intended size. */
    val defaultFamily: Family get() = if (Family.MEDIUM in sizes) Family.MEDIUM else sizes.first()
}

data class ThemeInfo(
    /** Display name (also the theme's file name), e.g. "Halcyon Biofab Illustrated". */
    val name: String,
    /** The company name from the script's first line, e.g. "Halcyon Biofab". */
    val company: String,
    /** The theme's frame id from its JSON, e.g. "halcyon". */
    val frame: String,
    /** "Original", "Illustrated", "Expanded", or "" for themes without editions. */
    val edition: String,
    /** True for editions that draw every widget at every size (Illustrated, Expanded). */
    val flexible: Boolean,
    val modes: List<Mode>,
) {
    /**
     * The script name passed to the runtime (Script.name()), which keys the theme's shared settings file. Like the site's
     * Android pack it is the company's first word, e.g. "Halcyon", so every edition and colorway of a theme shares it.
     */
    val scriptName: String get() = company.trim().split(Regex("\\s+")).firstOrNull()?.takeIf { it.isNotEmpty() } ?: "Foundry"
    /** Halcyon Illustrated has two setup screens (allocation and radio) that write the script's settings file. */
    val hasHalcyonSetup: Boolean get() = frame == "halcyon" && flexible
    /** The settings file the script reads: foundry-halcyon-<Name>.json, matching hbSettings() in the script. */
    val settingsFileName: String get() = "foundry-halcyon-" + ScriptInfo.settingsKey(scriptName) + ".json"
    fun mode(key: String?): Mode? = modes.firstOrNull { it.key == key }
}

object ScriptInfo {
    /** The modes the spec lists, in the order the app shows them. Anything else a script offers follows these. */
    val ORDER = listOf(
        "status", "shift", "transmission", "solar", "audio", "feeds", "youtube", "instagram", "discord", "oddity", "game",
        "tracker", "dossier",
    )

    private val NAMES = mapOf("youtube" to "YouTube")

    private val FIRST_LINE = Regex("""^\s*//\s*(.+?)\s*(?:—|–|,|-)\s*made with Foundry\b""", RegexOption.IGNORE_CASE)
    private val FRAME = Regex(""""frame":\s*"(\w+)"""")
    private val HEADER_ITEM = Regex("""([a-z_]+(?:\s*/\s*[a-z_]+)*)\s*\(([^)]*)\)""")
    private val ANY = Regex("""\bany\b""")

    /** "// Halcyon Biofab — made with Foundry" (the site's export) or "// Halcyon Biofab, made with Foundry" -> "Halcyon Biofab". */
    fun company(script: String): String? {
        val first = script.trimStart('\uFEFF').lineSequence().firstOrNull() ?: return null
        return FIRST_LINE.find(first)?.groupValues?.get(1)?.trim()?.takeIf { it.isNotEmpty() }
    }

    /** The same rule the runtime uses to pick the theme's display font: the first "frame" in the theme JSON. */
    fun frame(script: String): String = FRAME.find(script)?.groupValues?.get(1) ?: "halcyon"

    /** A top-level boolean in the theme JSON (exported pretty-printed, two-space indent), e.g. "hbOn": true. */
    fun flag(script: String, key: String): Boolean =
        Regex("""^ {2}"${Regex.escape(key)}":\s*true\b""", RegexOption.MULTILINE).containsMatchIn(script)

    /** Same character rule as the script's hbSettings(): anything outside [A-Za-z0-9_-] becomes "_". */
    fun settingsKey(name: String): String = name.replace(Regex("[^A-Za-z0-9_-]"), "_")

    /**
     * Sizes from the header comment, e.g. "status (medium) · shift (small) · transmission (any) · solar (large is best)".
     * "any" means every size; otherwise every size word named inside the brackets is allowed ("small or medium").
     */
    fun headerModes(script: String): List<Mode> {
        val header = script.trimStart('\uFEFF').lineSequence().drop(1)
            .takeWhile { it.trimStart().startsWith("//") }
            .joinToString(" ") { it.trimStart().removePrefix("//") }
        val found = LinkedHashMap<String, Mode>()
        for (m in HEADER_ITEM.findAll(header)) {
            val note = m.groupValues[2].trim().lowercase()
            val sizes = if (ANY.containsMatchIn(note)) Family.entries.toList()
            else Family.entries.filter { Regex("""\b${it.key}\b""").containsMatchIn(note) }
            if (sizes.isEmpty()) continue
            for (key in m.groupValues[1].split('/').map { it.trim() }.filter { it.isNotEmpty() }) {
                if (key !in found) found[key] = Mode(key, NAMES[key] ?: titleCase(key), "", sizes, note)
            }
        }
        return ordered(found.values)
    }

    /** An edition's widget table, e.g. `const HB_META = { status: ['W-01', 'SUBJECT STATUS', ...], ... };`. Every size. */
    fun metaModes(script: String, table: String): List<Mode> {
        val block = Regex("""const ${Regex.escape(table)}\s*=\s*\{([\s\S]*?)\n\};""").find(script)?.groupValues?.get(1)
            ?: return emptyList()
        val row = Regex("""^\s*([a-z_]+)\s*:\s*\[\s*['"]([^'"]*)['"]\s*,\s*['"]([^'"]*)['"]""", RegexOption.MULTILINE)
        val found = LinkedHashMap<String, Mode>()
        for (m in row.findAll(block)) {
            val key = m.groupValues[1]
            if (key !in found) found[key] = Mode(key, titleCase(m.groupValues[3]), m.groupValues[2], Family.entries.toList(), "any size")
        }
        return ordered(found.values)
    }

    /** Reads a pasted or opened script. Returns null when it isn't a Foundry widget script. */
    fun parse(script: String): ThemeInfo? {
        val company = company(script) ?: return null
        if (!script.contains("Script.setWidget") || !script.contains("widgetParameter")) return null
        val frame = frame(script)
        val illustrated = frame == "halcyon" && flag(script, "hbOn")
        val expanded = frame == "deeprange" && flag(script, "drOn")
        val header = headerModes(script)
        val modes = when {
            illustrated -> metaModes(script, "HB_META").ifEmpty { header.map { it.copy(sizes = Family.entries.toList()) } }
            expanded -> metaModes(script, "DR_META").ifEmpty { header.map { it.copy(sizes = Family.entries.toList()) } }
            else -> header
        }.ifEmpty { ORDER.take(11).map { Mode(it, titleCase(it), "", Family.entries.toList(), "any size") } }
        val edition = when {
            illustrated -> "Illustrated"
            expanded -> "Expanded"
            frame == "halcyon" || frame == "deeprange" -> "Original"
            else -> ""
        }
        // Each edition keeps its own name so importing Original next to Illustrated doesn't replace it.
        val name = if (illustrated || expanded) "$company $edition" else company
        return ThemeInfo(name, company, frame, edition, illustrated || expanded, modes)
    }

    private fun ordered(modes: Collection<Mode>): List<Mode> =
        modes.sortedBy { ORDER.indexOf(it.key).let { i -> if (i < 0) ORDER.size else i } }

    private fun titleCase(s: String): String = s.lowercase().split(' ', '_').filter { it.isNotEmpty() }
        .joinToString(" ") { w -> w.replaceFirstChar { it.uppercaseChar() } }
}
