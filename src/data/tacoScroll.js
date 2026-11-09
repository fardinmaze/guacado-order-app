// Scroll-scrubbed "taco being made" video (components/sections/TacoScroll.vue).
// `at` = the second of the clip where each step starts (the clip is 19.5 s). Edit to re-time a step.
// `tags` are the little stickers shown with the step; `tone` picks their colour.
// The wording describes what the footage shows; it is not a recipe or menu claim.
export const tacoScroll = {
  src: '/media/bowl-build.mp4',
  poster: '/media/bowl-poster.jpg',
  duration: 19.5,
  steps: [
    { at: 0, name: 'The bowl', note: 'An empty bowl, ready to be built.', tags: [{ t: 'Fresh start', tone: 'lime' }, { t: 'Your way', tone: 'chili' }] },
    { at: 1, name: 'Yellow rice', note: 'The base goes in first.', tags: [{ t: 'Golden', tone: 'lime' }, { t: 'Fluffy', tone: 'ink' }] },
    { at: 3, name: 'Black beans', note: 'A scoop of hearty black beans.', tags: [{ t: 'Hearty', tone: 'ink' }, { t: 'Steaming', tone: 'chili' }] },
    { at: 5, name: 'Grilled chicken', note: 'Sliced and still sizzling.', tags: [{ t: 'Sizzling', tone: 'chili' }, { t: 'Grilled', tone: 'ink' }] },
    { at: 6.8, name: 'Peppers & onions', note: 'Fajita-style veg on top.', tags: [{ t: 'Fajita', tone: 'leaf' }, { t: 'Charred', tone: 'chili' }] },
    { at: 8.5, name: 'Sweet corn', note: 'A golden shower of corn.', tags: [{ t: 'Sweet', tone: 'lime' }, { t: 'Crisp', tone: 'ink' }] },
    { at: 10, name: 'Tomato & cheese', note: 'Diced tomato, shredded cheese.', tags: [{ t: 'Fresh', tone: 'leaf' }, { t: 'Melty', tone: 'chili' }] },
    { at: 11.5, name: 'Guacamole', note: 'A proud scoop of guac.', tags: [{ t: 'Guac!', tone: 'leaf' }, { t: 'Creamy', tone: 'lime' }] },
    { at: 13, name: 'Sour cream', note: 'Cool and creamy.', tags: [{ t: 'Cool', tone: 'ink' }, { t: 'Creamy', tone: 'lime' }] },
    { at: 14.5, name: 'Sauce', note: 'A warm drizzle to finish.', tags: [{ t: 'Drizzled', tone: 'chili' }, { t: 'Zesty', tone: 'lime' }] },
    { at: 16, name: 'Cilantro', note: 'A fresh, green flurry.', tags: [{ t: 'Fresh', tone: 'leaf' }, { t: 'Finishing touch', tone: 'ink' }] },
    { at: 17.5, name: 'Ready to eat', note: 'Built your way, made fresh.', tags: [{ t: 'Made fresh', tone: 'lime' }, { t: 'Ready!', tone: 'chili' }] },
  ],
}

/** Index of the step playing at clip time `t` (seconds). */
export function stepAt(steps, t) {
  let idx = 0
  steps.forEach((s, i) => {
    if (t >= s.at) idx = i
  })
  return idx
}

/** Share of the scroll spent on the clip; the rest holds the last frame so the finale can play. */
export const PLAY_SHARE = 0.9

/** Scroll progress (0..1) -> clip time in seconds. */
export const clipTime = (progress, duration) => Math.min(1, progress / PLAY_SHARE) * (duration - 0.05)
