import { describe, expect, it } from 'vitest'
import menu from '@/data/menu.json'
import { addOns, featuredTiles, fromPrices, moreTiles, optionLabel } from '@/data/catalog'

describe('sales catalog', () => {
  it('derives every "from" price from menu.json', () => {
    expect(fromPrices).toEqual({
      byo: 11.95,
      birria: 11.95,
      tacos: 11.95,
      tostada: 8.95,
      kits: 49.95,
      kids: 8.95,
      sides: 0.95,
      drinks: 1.95,
    })
  })

  it('every tile has a price and a menu-page link', () => {
    ;[...featuredTiles, ...moreTiles].forEach((t) => {
      expect(t.from).toBeGreaterThan(0)
      expect(t.to).toMatch(/^\/menu#/)
    })
  })

  it('add-ons are real menu items at menu prices', () => {
    expect(addOns.map((a) => [a.name, a.price])).toEqual([
      ['Chips & Guac', 6.45],
      ['Churros', 3.95],
      ['Organic Lemonade', 4.95],
      ['Shake', 4.95],
    ])
  })

  it('formats price option labels', () => {
    expect(menu.featured[0].prices.map((p) => optionLabel(p.label))).toEqual(['2 pc', '3 pc', 'Pie'])
    expect(optionLabel('2')).toBe('2 for')
  })
})
