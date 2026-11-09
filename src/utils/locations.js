/** Filter locations by state code and a free-text query (street, city, zip). */
export function filterLocations(list, { state = 'All', query = '' } = {}) {
  const q = query.trim().toLowerCase()
  return list.filter((l) => {
    if (state !== 'All' && l.state !== state) return false
    if (!q) return true
    return `${l.address} ${l.city} ${l.state} ${l.zip}`.toLowerCase().includes(q)
  })
}

export function locationStats(list) {
  return {
    open: list.filter((l) => !l.soon).length,
    soon: list.filter((l) => l.soon).length,
    states: new Set(list.map((l) => l.state)).size,
  }
}

export function stateCounts(list, codes) {
  return [{ code: 'All', count: list.length }, ...codes.map((code) => ({
    code,
    count: list.filter((l) => l.state === code).length,
  }))]
}
