import { describe, expect, it } from 'vitest'
import { HEARTS, AVATAR, irisCentre, isLoveTarget } from '@/data/avatarEyes'

const el = (html) => {
  const d = document.createElement('div')
  d.innerHTML = html
  return d.firstElementChild
}

describe('avatar eyes', () => {
  it('keeps the iris inside its travel range for any gaze', () => {
    for (const e of AVATAR.eyes) {
      const far = irisCentre(e, 9, -9)
      expect(far.x).toBe(e.cx + e.travel.x)
      expect(far.y).toBe(e.cy - e.travel.y)
    }
  })
  it('has a heart for each eye, inside the artwork', () => {
    expect(HEARTS).toHaveLength(AVATAR.eyes.length)
    HEARTS.forEach((h) => {
      expect(h.cx - h.rx).toBeGreaterThan(0)
      expect(h.cx + h.rx).toBeLessThan(AVATAR.w)
      expect(h.cy + h.ry).toBeLessThan(AVATAR.h)
    })
  })
})

describe('what makes him fall in love', () => {
  it('Menu and Order links and buttons', () => {
    expect(isLoveTarget(el('<a href="/menu">Menu</a>'))).toBe(true)
    expect(isLoveTarget(el('<a href="https://order.online/business/gaucado-14231153">x</a>'))).toBe(true)
    expect(isLoveTarget(el('<a href="#x"><span>ORDER ONLINE</span></a>').firstElementChild)).toBe(true)
    expect(isLoveTarget(el('<button>Order for pickup</button>'))).toBe(true)
    expect(isLoveTarget(el('<a href="/order/brooklyn">x</a>'))).toBe(true)
  })
  it('nothing else', () => {
    expect(isLoveTarget(el('<a href="/locations">Locations</a>'))).toBe(false)
    expect(isLoveTarget(el('<a href="#build">Build your bowl</a>'))).toBe(false)
    expect(isLoveTarget(el('<p>Menu</p>'))).toBe(false)
    expect(isLoveTarget(null)).toBe(false)
  })
})
