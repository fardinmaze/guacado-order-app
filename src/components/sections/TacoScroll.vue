<script setup>
import { computed, ref } from 'vue'
import { site } from '@/data/site'
import { clipTime, stepAt, tacoScroll } from '@/data/tacoScroll'
import { useMotion } from '@/composables/useMotion'
import BaseButton from '@/components/ui/BaseButton.vue'

// Full-window scroll-scrubbed video. Scrolling moves the video's currentTime (the clip is encoded with
// every frame a keyframe, so seeking is instant). Giant step words sit BEHIND the food: the footage is
// blended with `screen`, so its black lets the type show through. Sticker tags sit in front.
// No reduced motion / no JS: one normal-height screen with the finished bowl and the step list.
const { src, poster, steps } = tacoScroll
const LAST = steps.length - 1
const root = ref(null)
const video = ref(null)
const live = ref(false)
const active = ref(LAST)
const progress = ref(1)
const finale = computed(() => active.value === LAST)

const words = (name) => name.toUpperCase().split(' ').map((w) => [...w])
const sparks = Array.from({ length: 16 }, (_, i) => ({ a: (360 / 16) * i, d: 24 + (i % 4) * 7, s: 0.8 + (i % 3) * 0.35 }))
const state = (i) => (i === active.value ? 'on' : i < active.value ? 'past' : 'next')

useMotion(root, ({ gsap, ScrollTrigger: ST, root: el }) => {
  const v = video.value
  live.value = true
  active.value = 0
  progress.value = 0

  let dur = tacoScroll.duration
  let target = 0
  let cur = 0
  const onMeta = () => {
    dur = v.duration || dur
    v.play?.().then(() => v.pause()).catch(() => {}) // iOS decodes seeks only after a first play
  }
  if (v.readyState >= 1) onMeta()
  else v.addEventListener('loadedmetadata', onMeta, { once: true })

  const st = ST.create({
    trigger: el,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      progress.value = self.progress
      target = clipTime(self.progress, dur)
      active.value = stepAt(steps, target)
    },
  })

  // Ease toward the scroll position; only seek once the previous seek has landed.
  const tick = () => {
    cur += (target - cur) * 0.2
    if (Math.abs(target - cur) < 0.004) cur = target
    if (!v.seeking && Math.abs(v.currentTime - cur) > 0.015) v.currentTime = cur
  }
  gsap.ticker.add(tick)
  requestAnimationFrame(() => ST.refresh()) // the tall height lands on the next render

  return () => {
    gsap.ticker.remove(tick)
    v.removeEventListener('loadedmetadata', onMeta)
    st.kill()
    live.value = false
    active.value = LAST
    progress.value = 1
  }
})
</script>

<template>
  <section id="taco" ref="root" class="taco" :class="{ 'is-live': live }" :style="{ '--n': steps.length }" aria-label="How a burrito bowl is made">
    <div class="pin" :class="{ 'is-finale': finale }">
      <!-- 1. Giant words (behind the food) -->
      <div class="words" aria-hidden="true">
        <div v-for="(s, i) in steps" :key="s.name" class="slide" :class="state(i)">
          <p class="num">{{ String(i + 1).padStart(2, '0') }}</p>
          <h2 class="big">
            <span v-for="(w, wi) in words(s.name)" :key="wi" class="w">
              <span v-for="(c, ci) in w" :key="ci" class="ch" :style="{ '--i': ci + wi * 3 }">{{ c }}</span>
            </span>
          </h2>
        </div>
      </div>

      <!-- 2. The footage -->
      <video ref="video" class="clip" :src="src" :poster="poster" muted playsinline preload="auto" disablepictureinpicture aria-label="A burrito bowl being built layer by layer" />

      <!-- 3. Stickers, notes and the finale (in front) -->
      <div class="front" aria-hidden="true">
        <div v-for="(s, i) in steps" :key="s.name" class="slide slide--front" :class="[state(i), i % 2 ? 'flip' : '']">
          <span v-for="(tag, ti) in s.tags" :key="tag.t" class="tag" :class="[`tone-${tag.tone}`, `t${ti}`]">{{ tag.t }}</span>
          <p class="note">{{ s.note }}</p>
        </div>

        <div class="burst" :class="{ go: finale }">
          <span v-for="(p, i) in sparks" :key="i" class="spark" :style="{ '--a': p.a + 'deg', '--d': p.d + 'vmin', '--s': p.s, '--k': i }">✦</span>
          <span class="stamp"><span>READY</span></span>
        </div>
      </div>

      <div class="cta" :class="{ show: finale }">
        <BaseButton to="/menu" variant="lime">SEE THE MENU</BaseButton>
        <BaseButton :href="site.orderUrl" variant="ghost">ORDER ONLINE</BaseButton>
      </div>

      <div class="hud" aria-hidden="true">
        <span class="hud__n">{{ active + 1 }} / {{ steps.length }}</span>
        <span class="hud__bar"><span :style="{ transform: `scaleX(${progress})` }" /></span>
      </div>

      <p class="sr-only" aria-live="polite">{{ steps[active].name }}. {{ steps[active].note }}</p>
    </div>

    <ol v-if="!live" class="list wrap" aria-label="Making of a burrito bowl">
      <li v-for="s in steps" :key="s.name"><strong>{{ s.name }}</strong> · {{ s.note }}</li>
    </ol>
  </section>
</template>

<style scoped>
.taco { background: var(--ground); }
.pin { position: relative; height: 100vh; height: 100svh; min-height: 520px; overflow: hidden; background: var(--ground); isolation: isolate; }
.taco.is-live { height: calc(var(--n) * 52vh + 120vh); }
.taco.is-live .pin { position: sticky; top: 0; }

/* The footage fills the window. Its black blends into the ground; the type behind shows through it. */
.clip {
  position: absolute;
  inset: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 85%;
  transform: scale(1.04);
  transform-origin: 50% 88%;
  mix-blend-mode: screen;
  pointer-events: none;
  transition: transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.is-finale .clip { transform: scale(1.14); }
@media (min-width: 900px) {
  .clip { transform: scale(1.2); }
  .is-finale .clip { transform: scale(1.32); }
}

/* ---- slides: fade + rise in, fade + lift out ---- */
.words, .front { position: absolute; inset: 0; pointer-events: none; }
.words { z-index: 1; }
.front { z-index: 3; }
.slide { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; text-align: center; padding: 84px var(--gut-r) 96px var(--gut-l); }
.slide--front { display: block; padding: 0; }
.slide > *, .slide--front > * { transition: opacity 0.55s ease, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.55s ease; }
.slide.next > * { opacity: 0; transform: translateY(46px) scale(0.96); filter: blur(10px); }
.slide.past > * { opacity: 0; transform: translateY(-46px) scale(1.04); filter: blur(10px); }
.slide.on > * { opacity: 1; transform: none; filter: none; }

.num { font: 400 clamp(20px, 3.4vw, 40px)/1 var(--f-cond); letter-spacing: 8px; color: var(--lime); margin-bottom: 4px; }
.big { font: 400 clamp(60px, 15.5vw, 250px)/0.88 var(--f-display); text-transform: uppercase; letter-spacing: -0.01em; color: var(--ink); text-wrap: balance; }
.w { display: inline-block; margin-inline: 0.12em; white-space: nowrap; }
.ch { display: inline-block; transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.5s; transition-delay: calc(var(--i) * 28ms); }
.slide.next .ch { transform: translateY(70%) rotate(6deg); opacity: 0; }
.slide.past .ch { transform: translateY(-60%) rotate(-5deg); opacity: 0; transition-delay: 0ms; }

/* ---- sticker tags ---- */
.tag {
  position: absolute;
  padding: 0.35em 0.9em 0.3em;
  border-radius: var(--r-pill);
  font: 400 clamp(20px, 3.2vw, 38px)/1 var(--f-cond);
  letter-spacing: 2px;
  text-transform: uppercase;
  white-space: nowrap;
  box-shadow: 0 10px 24px -8px rgba(0, 0, 0, 0.7);
}
.t0 { left: 7%; top: 24%; transform: rotate(-8deg); }
.t1 { right: 7%; bottom: 30%; transform: rotate(6deg); }
.flip .t0 { left: auto; right: 8%; top: 26%; transform: rotate(7deg); }
.flip .t1 { right: auto; left: 8%; bottom: 30%; transform: rotate(-6deg); }
.tone-lime { background: var(--lime); color: var(--on-lime); }
.tone-chili { background: var(--chili); color: #1a0a00; }
.tone-leaf { background: var(--leaf); color: var(--on-lime); }
.tone-ink { background: transparent; color: var(--ink); border: 2.5px solid var(--ink); }
/* Tags keep their rotation when they enter/leave (the slide rules above would reset transform). */
.slide.on .t0 { transform: rotate(-8deg); } .slide.on .t1 { transform: rotate(6deg); }
.slide.on.flip .t0 { transform: rotate(7deg); } .slide.on.flip .t1 { transform: rotate(-6deg); }
.slide.next .t0, .slide.past .t0 { transform: rotate(-8deg) translateY(30px) scale(0.6); }
.slide.next .t1, .slide.past .t1 { transform: rotate(6deg) translateY(30px) scale(0.6); }
.slide.on .t1 { transition-delay: 0.12s; }

.note { position: absolute; left: 0; right: 0; bottom: 74px; padding-inline: var(--gut-l); font-family: var(--f-script); font-size: clamp(24px, 3.6vw, 44px); line-height: 1.1; color: var(--lime); text-align: center; }

/* ---- finale: "Ready to eat" ---- */
.burst { position: absolute; left: 50%; top: 52%; width: 0; height: 0; }
.spark { position: absolute; left: 0; top: 0; font-size: calc(var(--s) * clamp(18px, 3.4vmin, 40px)); color: var(--lime); opacity: 0; }
.burst.go .spark { animation: spark 1.5s cubic-bezier(0.1, 0.7, 0.2, 1) both; animation-delay: calc(var(--k) * 35ms + 0.25s); }
@keyframes spark {
  0% { opacity: 0; transform: rotate(var(--a)) translateX(0) scale(0.2); }
  25% { opacity: 1; }
  100% { opacity: 0; transform: rotate(var(--a)) translateX(var(--d)) scale(1.1) rotate(180deg); }
}
.stamp {
  position: absolute;
  left: 0;
  top: 0;
  width: clamp(130px, 22vmin, 240px);
  aspect-ratio: 1;
  margin: calc(clamp(130px, 22vmin, 240px) / -2) 0 0 calc(clamp(130px, 22vmin, 240px) / -2);
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--lime);
  color: var(--on-lime);
  font: 400 clamp(32px, 6vmin, 64px)/1 var(--f-display);
  letter-spacing: 2px;
  box-shadow: 0 0 0 clamp(6px, 1vmin, 12px) var(--ground), 0 0 0 clamp(9px, 1.4vmin, 16px) var(--lime), 0 24px 60px -10px rgba(0, 0, 0, 0.8);
  opacity: 0;
  transform: translate(26vmin, -26vmin) rotate(25deg) scale(0);
}
.burst.go .stamp { animation: stamp 0.9s 0.45s cubic-bezier(0.34, 1.7, 0.5, 1) forwards, wobble 3.4s 1.4s ease-in-out infinite; }
@keyframes stamp {
  0% { opacity: 0; transform: translate(26vmin, -26vmin) rotate(-40deg) scale(0); }
  100% { opacity: 1; transform: translate(26vmin, -26vmin) rotate(12deg) scale(1); }
}
@keyframes wobble { 0%, 100% { transform: translate(26vmin, -26vmin) rotate(12deg) scale(1); } 50% { transform: translate(26vmin, -26vmin) rotate(8deg) scale(1.05); } }
/* The finale word gets a lime glow. */
.is-finale .slide.on .big { filter: drop-shadow(0 0 28px rgba(200, 216, 44, 0.35)); }

.cta { position: absolute; z-index: 4; left: 0; right: 0; bottom: 24px; display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; padding-inline: var(--gut-l); opacity: 0; transform: translateY(24px); pointer-events: none; transition: opacity 0.5s 0.9s, transform 0.6s 0.9s; }
.cta.show { opacity: 1; transform: none; pointer-events: auto; }
.is-finale .note { opacity: 0; } /* the buttons take the note's place */

.hud { position: absolute; z-index: 4; left: var(--gut-l); right: var(--gut-r); bottom: 12px; display: flex; align-items: center; gap: 12px; pointer-events: none; }
.hud__n { font: 400 16px/1 var(--f-cond); letter-spacing: 3px; color: var(--ink-muted); }
.hud__bar { flex: 1; height: 3px; border-radius: 2px; background: var(--line); overflow: hidden; }
.hud__bar span { display: block; height: 100%; background: var(--lime); transform-origin: left; }
.is-finale .hud { opacity: 0; transition: opacity 0.3s; }
.taco:not(.is-live) .hud { display: none; }

/* ---- not live (no JS / reduced motion): one screen, finished bowl, readable list ---- */
.taco:not(.is-live) .slide:not(.on) { display: none; }
.taco:not(.is-live) .cta { opacity: 1; transform: none; pointer-events: auto; transition: none; }
.taco:not(.is-live) .note { bottom: 96px; opacity: 1; }
.list { list-style: none; margin: 0 auto; padding-block: 32px; display: grid; gap: 6px; color: var(--ink-muted); max-width: 720px; }
.list strong { color: var(--ink); }
.taco:not(.is-live) .burst.go .spark { animation: none; }

@media (max-width: 599px) {
  .tag { font-size: 22px; }
  .t0 { left: 5%; top: 20%; }
  .t1 { right: 5%; bottom: 33%; }
  .flip .t0 { right: 5%; top: 20%; }
  .flip .t1 { left: 5%; bottom: 33%; }
  .note { bottom: 68px; font-size: 24px; }
}
</style>
