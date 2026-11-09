import { describe, expect, it } from 'vitest'
import { useBuilder } from '@/composables/useBuilder'
import { orderTotal } from '@/utils/pricing'

describe('orderTotal', () => {
  it('uses the protein price alone by default', () => {
    expect(orderTotal({ proteinPrice: 12.95 })).toBe(12.95)
  })
  it('adds $1.95 guac and $2.95 extra protein without float drift', () => {
    expect(orderTotal({ proteinPrice: 12.95, guac: true })).toBe(14.9)
    expect(orderTotal({ proteinPrice: 13.95, guac: true, extraProtein: true })).toBe(18.85)
  })
})

describe('useBuilder', () => {
  it('starts on the board default: $12.95', () => {
    const b = useBuilder()
    expect(b.total.value).toBe(12.95)
    expect(b.summary.value).toEqual({
      base: 'Bowl',
      protein: 'Grill Chicken',
      toppings: 'Rice, Beans, Pico de Gallo',
      sauce: 'Chipotle',
    })
  })

  it('protein sets the price', () => {
    const b = useBuilder()
    b.setProtein('Grilled Steak')
    expect(b.total.value).toBe(13.95)
    b.setProtein('Tofu')
    expect(b.total.value).toBe(11.95)
  })

  it('base, toppings and sauce are free', () => {
    const b = useBuilder()
    b.setBase('Burrito')
    b.toggleTopping('Jalapeños')
    b.setSauce('Smoky Habanero')
    expect(b.total.value).toBe(12.95)
  })

  it('keeps toppings in board order and appends Guac', () => {
    const b = useBuilder()
    b.toggleTopping('Jalapeños')
    b.toggleTopping('Salsa')
    b.toggleGuac()
    expect(b.summary.value.toppings).toBe('Rice, Beans, Pico de Gallo, Salsa, Jalapeños, Guac')
  })

  it('reports "None" with no toppings and "(double)" with extra protein', () => {
    const b = useBuilder()
    ;['Rice', 'Beans', 'Pico de Gallo'].forEach((t) => b.toggleTopping(t))
    b.toggleExtraProtein()
    expect(b.summary.value.toppings).toBe('None')
    expect(b.summary.value.protein).toBe('Grill Chicken (double)')
  })

  it('clicking the active sauce clears it', () => {
    const b = useBuilder()
    b.setSauce('Chipotle')
    expect(b.summary.value.sauce).toBe('No sauce')
  })

  it('tracks step progress at 25% per step', () => {
    const b = useBuilder()
    expect(b.progress.value).toBe(25)
    b.setSauce('Mango')
    expect(b.progress.value).toBe(100)
  })

  it('reset restores defaults', () => {
    const b = useBuilder()
    b.setProtein('Tofu')
    b.toggleGuac()
    b.reset()
    expect(b.total.value).toBe(12.95)
    expect(b.state.guac).toBe(false)
  })
})
