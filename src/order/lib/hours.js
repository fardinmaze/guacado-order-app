// Store hours and pickup slots, computed in the store's own time zone (03-TECH-SPEC §5).
// Hours such as 10:30 → 03:00 cross midnight and belong to the day they open.

const toMin = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** Minutes since local midnight for `date` in `tz`. */
export function minuteOfDay(date, tz) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(date)
  const get = (t) => Number(parts.find((p) => p.type === t).value)
  return get('hour') * 60 + get('minute')
}

/** UTC offset of `tz` at an instant, in minutes. */
function tzOffset(date, tz) {
  const p = new Intl.DateTimeFormat('en-US', { timeZone: tz, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23' }).formatToParts(date)
  const g = (t) => Number(p.find((x) => x.type === t).value)
  return (Date.UTC(g('year'), g('month') - 1, g('day'), g('hour'), g('minute'), g('second')) - Math.floor(date.getTime() / 1000) * 1000) / 60000
}

/** A wall-clock gap (minutes on the clock) -> real elapsed minutes, correct across a DST change. */
function realMinutes(now, tz, wall) {
  return wall + (tzOffset(now, tz) - tzOffset(new Date(now.getTime() + wall * 60000), tz))
}

export const hoursOf = (store) => store.hours.daily

/** "3am", "10:30am" */
export function clockLabel(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  const h12 = h % 12 || 12
  return `${h12}${m ? ':' + String(m).padStart(2, '0') : ''}${h < 12 ? 'am' : 'pm'}`
}

/** Minutes until it closes if open now, or null when closed. */
export function minutesUntilClose(store, now = new Date()) {
  const { opensAt, closesAt } = hoursOf(store)
  const o = toMin(opensAt)
  const c = toMin(closesAt)
  const m = minuteOfDay(now, store.timezone)
  let wall = null
  if (c > o) wall = m >= o && m < c ? c - m : null // same-day window
  else if (m >= o) wall = 1440 - m + c // evening part of an overnight window
  else if (m < c) wall = c - m // after-midnight part
  return wall === null ? null : realMinutes(now, store.timezone, wall)
}

/** Minutes until it next opens (0 if open now). */
export function minutesUntilOpen(store, now = new Date()) {
  if (minutesUntilClose(store, now) !== null) return 0
  const o = toMin(hoursOf(store).opensAt)
  const m = minuteOfDay(now, store.timezone)
  return realMinutes(now, store.timezone, (o - m + 1440) % 1440)
}

/** { state: 'open'|'closed'|'soon', label } for a store chip or list row. */
export function storeStatus(store, now = new Date()) {
  if (store.status === 'COMING_SOON') return { state: 'soon', label: 'Coming soon' }
  if (store.status === 'PAUSED') return { state: 'closed', label: 'Online ordering paused' }
  const { opensAt, closesAt } = hoursOf(store)
  return minutesUntilClose(store, now) !== null
    ? { state: 'open', label: `Open · closes ${clockLabel(closesAt)}` }
    : { state: 'closed', label: `Closed · opens ${clockLabel(opensAt)}` }
}

const SLOT = 15

/**
 * Pickup slots, 15 minutes apart. Open now: from now + prep (rounded up) to closing − 15m.
 * Closed: from opening + 15m. `max` caps how many are returned.
 * Only whole elapsed minutes are added to `now`, so a DST change cannot shift a slot.
 */
export function pickupSlots(store, now = new Date(), { prepMinutes = 12, max = 48 } = {}) {
  if (store.status !== 'OPEN') return []
  const closeIn = minutesUntilClose(store, now)
  const { opensAt, closesAt } = hoursOf(store)
  const openLen = (toMin(closesAt) - toMin(opensAt) + 1440) % 1440 || 1440
  let firstMin // minutes from now
  let lastMin
  if (closeIn !== null) {
    firstMin = prepMinutes
    lastMin = closeIn - SLOT
  } else {
    firstMin = minutesUntilOpen(store, now) + SLOT
    lastMin = minutesUntilOpen(store, now) + openLen - SLOT
  }
  // Round the first slot up to the next quarter hour on the clock (all US zone offsets are multiples of 15m).
  const start = new Date(now.getTime() + firstMin * 60000)
  const q = SLOT * 60000
  let t = Math.ceil(start.getTime() / q) * q
  const end = now.getTime() + lastMin * 60000
  const fmt = new Intl.DateTimeFormat('en-US', { timeZone: store.timezone, hour: 'numeric', minute: '2-digit' })
  const out = []
  for (; t <= end && out.length < max; t += q) out.push({ at: new Date(t).toISOString(), label: fmt.format(new Date(t)) })
  return out
}

/** ASAP estimate in minutes (03-TECH-SPEC §5): prep + 1 min per 2 queued entrées. */
export const asapMinutes = (prepMinutes = 12, queued = 0) => prepMinutes + Math.ceil(queued / 2)
