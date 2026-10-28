# Foundry project instructions

Before any prefab design or implementation change, read `docs/APPROVED_DESIGN_DECISIONS.txt` (the canonical design record,
including the WORLD-BUILDING STANDARD), the theme's section of `docs/FOUNDRY_THEME_BIBLE.md`, and `docs/PREFAB_VARIETY.txt`.
Follow the engineering and delivery rules in `CLAUDE.md`. They apply to every contributor: editions never replace originals,
no embedded images or fonts, hosted art via scripts/art.py, realistic Scriptable reads, exports that stay trimmable, start from a
fresh pull of GitHub main.

Treat the user's approved visual direction as the baseline. Inspect the original reference and current approved render before
editing. Preserve detail, palette separation, tone, graphic variety, artwork ownership and size consistency. Do not treat passing
tests as a substitute for visual comparison.

Follow the review checklist and ship gate in the decisions file before presenting changes. Record new user approvals and
corrections there, and include it in future handoffs. Latest explicit user direction overrides older notes. Do not reopen settled
design questions without a concrete conflict.

Navie (the navigation app in `nav/`): read `docs/NAV_SPEC.md` and the Navie section of `CLAUDE.md` first. Theme
data comes only from `src/foundry-data.js`; directions are spoken plainly before any world line; Studio links are untrusted.
