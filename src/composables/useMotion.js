import { onBeforeUnmount, onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

export const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

export const canHover = () => typeof matchMedia === 'function' && matchMedia('(hover: hover)').matches

/**
 * Run GSAP choreography scoped to a component root.
 *
 * - Skipped entirely when the guest prefers reduced motion (content stays in place).
 * - Everything is created inside a gsap.context, so it is reverted on unmount.
 * - `setup({ gsap, ScrollTrigger, root })` may return a cleanup function for
 *   non-GSAP resources such as DOM listeners.
 */
export function useMotion(rootRef, setup) {
  let ctx
  let cleanup

  onMounted(() => {
    const root = rootRef.value
    if (!root || prefersReducedMotion()) return
    ctx = gsap.context(() => {
      cleanup = setup({ gsap, ScrollTrigger, root })
    }, root)
  })

  onBeforeUnmount(() => {
    if (typeof cleanup === 'function') cleanup()
    ctx?.revert()
  })
}

/** Cards/panels/kits: batched rise-in (BRAND.md §9 "Cards"). */
export function revealCards(selector = '[data-card]') {
  ScrollTrigger.batch(selector, {
    start: 'top 88%',
    onEnter: (batch) =>
      gsap.from(batch, { y: 60, rotate: 1.5, opacity: 0.15, duration: 0.9, stagger: 0.1, ease: 'power3.out' }),
  })
}

/** Section heads: rise 40px from opacity .15 at top 88%. */
export function revealHeads(root, selector = '[data-reveal]') {
  root.querySelectorAll(selector).forEach((el) =>
    gsap.from(el, {
      y: 40,
      opacity: 0.15,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    }),
  )
}

/** Pointer tilt on hover-capable devices. Returns a cleanup function. */
export function tiltCards(root, selector) {
  if (!canHover()) return () => {}
  const offs = []
  root.querySelectorAll(selector).forEach((el) => {
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      gsap.to(el, { rotateY: x * 6, rotateX: -y * 6, transformPerspective: 900, duration: 0.4, ease: 'power2.out' })
    }
    const leave = () => gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1,.5)' })
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    offs.push(() => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    })
  })
  return () => offs.forEach((off) => off())
}
