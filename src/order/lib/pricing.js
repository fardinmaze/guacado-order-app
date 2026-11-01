// Ordering price rules (docs: 03-TECH-SPEC §4). Integer cents everywhere; never floats.
// The client's totals are display-only: the server must re-price before taking payment.

export const LEVELS = ['light', 'regular', 'extra', 'side']
export const LEVEL_LABEL = { light: 'Light', regular: 'Regular', extra: 'Extra', side: 'On the side' }
export const EXTRA_PROTEIN_CENTS = 295
export const GUAC_CENTS = 195

export const cents = (n) => '$' + (n / 100).toFixed(2)

const optionOf = (group, name) => group.options.find((o) => o.name === name)
const isExtraProteinAddon = (g, o) => g.key === 'addons' && o.name === 'Extra Protein'

/** Does the guest want extra protein? Either the protein's "Extra" level or the Extra Protein add-on. Charged once. */
export function hasExtraProtein(item, sel) {
  if (item.kind !== 'BUILDER') return false
  const viaLevel = (sel.protein ?? []).some((p) => p.level === 'extra')
  const viaAddon = (sel.addons ?? []).some((p) => p.name === 'Extra Protein')
  return viaLevel || viaAddon
}

/** Unit price of one item with these selections. */
export function unitCents(item, sel) {
  let price = item.basePriceCents ?? 0
  let add = 0
  for (const g of item.groups ?? []) {
    for (const pick of sel[g.key] ?? []) {
      const opt = optionOf(g, pick.name)
      if (!opt) continue
      if (g.setsPrice) price = opt.priceCents // absolute price (protein, size)
      else if (!isExtraProteinAddon(g, opt)) add += opt.priceCents
    }
  }
  if (hasExtraProtein(item, sel)) add += EXTRA_PROTEIN_CENTS
  return price + add
}

/** Cheapest way to order the item: used for "From $X". */
export function fromCents(item) {
  const setters = (item.groups ?? []).filter((g) => g.setsPrice)
  if (!setters.length) return item.basePriceCents ?? 0
  return Math.min(...setters.flatMap((g) => g.options.map((o) => o.priceCents)))
}

/** Defaults: every option flagged isDefault, at "regular". */
export function defaultSelection(item) {
  const sel = {}
  for (const g of item.groups ?? []) {
    const picks = g.options.filter((o) => o.isDefault).map((o) => ({ name: o.name, level: 'regular' }))
    if (!picks.length && g.minSelect > 0 && g.maxSelect === 1) picks.push({ name: g.options[0].name, level: 'regular' })
    sel[g.key] = picks
  }
  return sel
}

/** Validation, mirrored on the server. Returns [{ group, message }]; empty = valid. */
export function validate(item, sel) {
  const errors = []
  for (const g of item.groups ?? []) {
    const picks = sel[g.key] ?? []
    for (const p of picks) {
      if (!optionOf(g, p.name)) errors.push({ group: g.key, message: `${p.name} is not available for ${g.name.toLowerCase()}.` })
      if (p.level && p.level !== 'regular' && !g.allowLevels) errors.push({ group: g.key, message: `${g.name} cannot be changed to ${p.level}.` })
      if (p.level && !LEVELS.includes(p.level)) errors.push({ group: g.key, message: `Unknown level ${p.level}.` })
    }
    if (picks.length < g.minSelect) {
      errors.push({
        group: g.key,
        message: g.minSelect === g.maxSelect && g.minSelect > 1 ? `Pick exactly ${g.minSelect}.` : `Choose ${g.minSelect === 1 ? 'one' : g.minSelect}: ${g.name.replace(/^Choose /i, '').toLowerCase()}.`,
      })
    }
    if (picks.length > g.maxSelect) errors.push({ group: g.key, message: `Pick up to ${g.maxSelect}.` })
  }
  return errors
}

/** Selection change rules (pure; the store and the components share them). */
export function togglePick(group, picks, name) {
  const has = picks.some((p) => p.name === name)
  if (group.maxSelect === 1) {
    if (has) return group.minSelect === 0 ? [] : picks // a required single choice cannot be cleared
    return [{ name, level: 'regular' }]
  }
  if (has) return picks.filter((p) => p.name !== name)
  if (picks.length >= group.maxSelect) return picks // at the cap: ignore (UI shows the limit)
  return [...picks, { name, level: 'regular' }]
}

export function setLevel(picks, name, level) {
  return picks.map((p) => (p.name === name ? { ...p, level } : p))
}

/** Human summary of a line, e.g. ["Bowl", "Grill Chicken", "Rice, Beans (light)", ...]. */
export function summaryParts(item, sel) {
  const parts = []
  for (const g of item.groups ?? []) {
    const picks = (sel[g.key] ?? []).filter((p) => !(g.key === 'addons' && p.name === 'Extra Protein' && item.kind === 'BUILDER'))
    if (!picks.length) continue
    const text = picks
      .map((p) => {
        const opt = optionOf(g, p.name)
        const lvl = g.allowLevels && p.level && p.level !== 'regular' ? ` (${LEVEL_LABEL[p.level].toLowerCase()})` : ''
        return `${opt ? p.name : p.name}${lvl}`
      })
      .join(', ')
    parts.push(text)
  }
  if (hasExtraProtein(item, sel) && !(sel.protein ?? []).some((p) => p.level === 'extra')) parts.push('Extra protein')
  return parts
}

export const lineCents = (item, line) => unitCents(item, line.selections) * line.qty

/** Tax: half-up per order. rate null = owner has not confirmed it yet, so we show none. */
export function taxCents(subtotal, rate) {
  if (rate == null) return null
  return Math.floor(subtotal * rate + 0.5)
}

export function tipCents(subtotal, pct) {
  return Math.floor((subtotal * pct) / 100 + 0.5)
}

export function totals(subtotal, { rate = null, tipPct = 0 } = {}) {
  const tax = taxCents(subtotal, rate)
  const tip = tipCents(subtotal, tipPct)
  return { subtotal, tax, tip, total: subtotal + (tax ?? 0) + tip, taxPending: tax === null }
}
