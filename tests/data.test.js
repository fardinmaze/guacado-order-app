import { describe, expect, it } from 'vitest'
import locations from '@/data/locations.json'
import menu from '@/data/menu.json'
import { nav, ORDER_URL, stateNames } from '@/data/site'
import { cityLine, mapsUrl, shortSauce } from '@/utils/format'
import { filterLocations, locationStats, stateCounts } from '@/utils/locations'

describe('locations data', () => {
  it('matches the totals printed on the site: 19 open, 4 soon, 6 states', () => {
    expect(locations).toHaveLength(23)
    expect(locationStats(locations)).toEqual({ open: 19, soon: 4, states: 6 })
  })
  it('only uses known state codes', () => {
    locations.forEach((l) => expect(stateNames).toHaveProperty(l.state))
  })
  it('filters by state', () => {
    expect(filterLocations(locations, { state: 'NJ' })).toHaveLength(3)
    expect(stateCounts(locations, Object.keys(stateNames))[0]).toEqual({ code: 'All', count: 23 })
  })
  it('searches street, city and zip, case-insensitively', () => {
    expect(filterLocations(locations, { query: 'brooklyn' })).toHaveLength(3)
    expect(filterLocations(locations, { query: '07503' })[0].city).toBe('Paterson')
    expect(filterLocations(locations, { query: 'zzz' })).toHaveLength(0)
  })
  it('combines state and query', () => {
    expect(filterLocations(locations, { state: 'NY', query: 'bronx' })).toHaveLength(3)
    expect(filterLocations(locations, { state: 'NJ', query: 'bronx' })).toHaveLength(0)
  })
})

describe('format helpers', () => {
  it('builds the Google Maps directions link from BRAND.md §11', () => {
    const url = mapsUrl({ address: '939 Main Street', city: 'Paterson', state: 'NJ', zip: '07503' })
    expect(url).toBe(
      'https://www.google.com/maps/search/?api=1&query=Guacado%20Mexican%20Grill%20939%20Main%20Street%20Paterson%20NJ%2007503',
    )
  })
  it('formats the city line and short sauce names', () => {
    expect(cityLine({ city: 'Laurel', state: 'MD', zip: '20707' })).toBe('Laurel, MD 20707')
    expect(shortSauce('Smoky Habanero Sauce')).toBe('Smoky Habanero')
  })
})

describe('brand contract', () => {
  it('keeps nav labels and order exactly (BRAND.md §2)', () => {
    expect(nav.map((n) => n.label)).toEqual(['Menu', 'Order', 'Catering', 'Jobs', 'Locations', 'Franchise Opportunities'])
  })
  it('keeps the live order URL verbatim, including the "gaucado" spelling', () => {
    expect(ORDER_URL).toBe('https://order.online/business/gaucado-14231153')
    expect(nav.find((n) => n.label === 'Order').href).toBe(ORDER_URL)
  })
  it('menu data has no price below zero and every protein is priced', () => {
    menu.buildYourOwn.proteins.forEach((p) => expect(p.price).toBeGreaterThan(0))
  })
})
