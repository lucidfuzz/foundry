const THEME_PAINT = { directive: DIR, longroad: LR, nightfall: NF, grimoire: GM, deeprange: DRG, halcyon: HAL, rabbit: RB, cyber: CY, vapor: VP, nature: NA, market: MK }
Object.keys(GAMES).forEach(f => { if (THEME_PAINT[f]) { THEME_PAINT[f].game = (k, W, H, d) => GAMES[f].paint(k, W, H, d.st, d.inp); THEME_PAINT[f].gameSample = () => gameSample(f) } })
