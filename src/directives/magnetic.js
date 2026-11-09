import { canHover, gsap, prefersReducedMotion } from '@/composables/useMotion'

/**
 * v-magnetic: the element drifts toward the pointer (BRAND.md §9 "Buttons").
 * Pass `false` to opt out. No-op on touch devices and with reduced motion.
 */
export const vMagnetic = {
  mounted(el, { value }) {
    if (value === false || prefersReducedMotion() || !canHover()) return
    const move = (e) => {
      const r = el.getBoundingClientRect()
      gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.18, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.3 })
    }
    const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,.4)' })
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    el._magneticOff = () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      gsap.set(el, { clearProps: 'x,y' })
    }
  },
  unmounted(el) {
    el._magneticOff?.()
  },
}
