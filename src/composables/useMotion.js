import gsap from 'gsap'

// The sales layout keeps motion to feedback only (the ticket total tween).
// Scroll choreography from the brand build was removed: content is visible on load.
export { gsap }

export const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
