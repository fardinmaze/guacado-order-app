<script setup>
import { ref } from 'vue'
import { site } from '@/data/site'
import { useMotion } from '@/composables/useMotion'
import BaseButton from '@/components/ui/BaseButton.vue'
import HeroAvatar from '@/components/ui/HeroAvatar.vue'

const root = ref(null)
const photos = { dip: '/media/hero-1.jpg', tacos: '/media/hero-2.jpg' } // served from public/

// Load timeline, idle float, stamp spin and scroll parallax (BRAND.md §9).
// All animate FROM a visible state, so content is readable if motion is skipped.
useMotion(root, ({ gsap }) => {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
  tl.from('.ln > span', { yPercent: 110, duration: 1, stagger: 0.08 })
    .from('[data-hero]', { y: 24, opacity: 0, duration: 0.7, stagger: 0.07 }, '-=.7')
    .from('.hero-av', { scale: 0.7, y: 70, rotate: -5, opacity: 0, duration: 1.4, ease: 'elastic.out(1,.75)' }, 0.1)
    .from('.f-dip', { x: 120, y: -40, rotate: 8, scale: 0.85, opacity: 0, duration: 1.2 }, 0.3)
    .from('.f-tacos', { x: -120, y: 60, rotate: -8, scale: 0.85, opacity: 0, duration: 1.2 }, 0.45)
    .from('.stamp', { scale: 0, rotate: -90, duration: 0.9, ease: 'back.out(1.8)' }, 0.7)

  const float = { sine: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.4 }
  gsap.to('.f-tacos', { y: '-=12', rotate: -1.5, duration: 3.2, ease: float.sine, ...float })
  gsap.to('.av__bob', { y: -10, duration: 3.4, ease: float.sine, ...float })
  gsap.to('.f-dip', { y: '+=12', rotate: 1.5, duration: 2.8, ease: float.sine, ...float })
  gsap.to('.stamp text', { rotate: 360, transformOrigin: '80px 80px', duration: 22, repeat: -1, ease: 'none' })

  const scrub = { trigger: root.value, start: 'top top', end: 'bottom top', scrub: true }
  gsap.to('.float', { yPercent: -25, ease: 'none', stagger: 0.1, scrollTrigger: scrub })
})
</script>

<template>
  <section ref="root" class="hero">
    <div class="wrap hero__grid">
      <div class="hero__copy">
        <span class="hours" data-hero><i />{{ site.hoursOpen }}</span>
        <p class="script" data-hero>From our fresh selection</p>
        <h1 aria-label="Build your own!">
          <span class="ln"><span>Build</span></span>
          <span class="ln"><span>your</span></span>
          <span class="ln"><span>own<span class="bang">!</span></span></span>
        </h1>
        <p class="lead" data-hero>
          Pick a base, grill it with your protein, load the toppings and finish with a homemade sauce.
          Bowls, burritos, nachos, quesadillas and crunch wraps, made your way.
        </p>
        <div class="hero__actions" data-hero>
          <BaseButton :href="site.orderUrl">
            ORDER ONLINE
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </BaseButton>
          <BaseButton variant="ghost" href="#build">BUILD YOUR BOWL</BaseButton>
        </div>
      </div>

      <div class="hero__art" aria-hidden="true">
        <svg class="stamp" viewBox="0 0 160 160">
          <defs><path id="stamp-circ" d="M80,80 m-62,0 a62,62 0 1,1 124,0 a62,62 0 1,1 -124,0" /></defs>
          <circle cx="80" cy="80" r="78" fill="#0a120e" stroke="#c8d82c" stroke-width="2" />
          <text><textPath href="#stamp-circ">FRESH · GRILLED · BUILT YOUR WAY · </textPath></text>
          <circle cx="80" cy="80" r="18" fill="#874c1b" />
        </svg>
        <img class="float f-dip" :src="photos.dip" alt="" width="1400" height="1045" fetchpriority="high" />
        <img class="float f-tacos" :src="photos.tacos" alt="" width="1400" height="1045" fetchpriority="high" />
        <HeroAvatar class="hero-av" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero { padding-block: clamp(28px, 5vw, 64px) clamp(56px, 8vw, 104px); overflow: hidden; }
.hero__grid { display: grid; gap: 40px; align-items: center; }
@media (min-width: 960px) { .hero__grid { grid-template-columns: 1.15fr 0.85fr; } }
.hero__copy { min-width: 0; display: flex; flex-direction: column; gap: 22px; position: relative; z-index: 2; }
.hours {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  align-self: flex-start;
  background: var(--surface-raised);
  border: 1px solid var(--line);
  border-radius: var(--r-pill);
  padding: 8px 16px 8px 10px;
  font-size: 14px;
  font-weight: 600;
}
.hours i { width: 10px; height: 10px; border-radius: 50%; background: var(--lime); box-shadow: 0 0 0 4px rgba(200, 216, 44, 0.2); }
h1 {
  font-family: var(--f-display);
  font-size: clamp(54px, 10.4vw, 138px);
  line-height: 0.88;
  letter-spacing: -1px;
  text-transform: uppercase;
}
.ln { display: block; overflow: hidden; padding-bottom: 0.06em; }
.ln > span { display: inline-block; }
.bang { color: var(--lime); }
.hero__actions { display: flex; flex-wrap: wrap; gap: 12px; }

.hero__art { position: relative; aspect-ratio: 4 / 5; max-width: 560px; width: 100%; justify-self: center; }
.hero-av { position: absolute; z-index: 2; left: 6%; top: 3%; width: 88%; aspect-ratio: 1792 / 2400; }
/* Photos sit on pure black: screen-blend them into the page and feather the edges. */
.float {
  position: absolute;
  height: auto;
  mix-blend-mode: screen;
  -webkit-mask-image: radial-gradient(closest-side, #000 78%, transparent 100%);
  mask-image: radial-gradient(closest-side, #000 78%, transparent 100%);
}
.f-dip { z-index: 1; width: 56%; right: -10%; top: -3%; }
.f-tacos { z-index: 1; width: 70%; left: -14%; bottom: -3%; }
.stamp { position: absolute; z-index: 3; left: 0; top: 4%; width: 30%; transform: rotate(-12deg); }
.stamp text { font-family: var(--f-cond); letter-spacing: 4px; font-size: 15px; fill: var(--ink); }
</style>
