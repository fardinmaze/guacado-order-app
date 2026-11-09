<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { AVATAR, HEARTS, irisCentre, isLoveTarget } from '@/data/avatarEyes'
import { gsap, prefersReducedMotion } from '@/composables/useMotion'

// The Guacado mascot. His eyes and head follow the cursor (or a finger on touch screens); with no
// pointer for a few seconds he glances around on his own. Under reduced motion he simply looks ahead.
// The painted irises are hidden by a patch, and a moving iris + pupil is drawn on top (see data/avatarEyes.js).
const photo = '/media/avatar.jpg'
const lovePhoto = '/media/avatar-love.jpg' // same pose with heart eyes
const love = ref(false) // the cursor (or keyboard focus) is on Menu / Order

// Percent geometry so the heart layers scale with the picture.
const pct = (v, of) => `${((v / of) * 100).toFixed(3)}%`
const heartStyle = (h) => ({
  clipPath: `ellipse(${pct(h.rx, AVATAR.w)} ${pct(h.ry, AVATAR.h)} at ${pct(h.cx, AVATAR.w)} ${pct(h.cy, AVATAR.h)})`,
  transformOrigin: `${pct(h.cx, AVATAR.w)} ${pct(h.cy, AVATAR.h)}`,
})
const root = ref(null)
const tilt = ref(null)
const irises = ref([])
const eyeId = (i) => `av-eye-${i}`

let tx = 0 // target gaze, -1..1
let ty = 0
let gx = 0 // eased gaze
let gy = 0
let last = 0 // when the pointer last moved (ms)
let tick

function aim(clientX, clientY) {
  const r = root.value.getBoundingClientRect()
  // Gaze is measured from the face (upper part of the figure), scaled to the window.
  const fx = r.left + r.width * 0.5
  const fy = r.top + r.height * 0.34
  tx = Math.max(-1, Math.min(1, (clientX - fx) / (innerWidth * 0.34)))
  ty = Math.max(-1, Math.min(1, (clientY - fy) / (innerHeight * 0.34)))
  last = performance.now()
}
const onMove = (e) => aim(e.clientX, e.clientY)
const onOver = (e) => { if (isLoveTarget(e.target)) love.value = true }
const onOut = (e) => { if (isLoveTarget(e.target) && !isLoveTarget(e.relatedTarget)) love.value = false }

function paint() {
  AVATAR.eyes.forEach((eye, i) => {
    const c = irisCentre(eye, gx, gy)
    irises.value[i]?.setAttribute('transform', `translate(${c.x.toFixed(1)} ${c.y.toFixed(1)})`)
  })
  if (tilt.value) {
    tilt.value.style.transform = `rotateY(${(gx * 10).toFixed(2)}deg) rotateX(${(-gy * 7).toFixed(2)}deg) translate3d(${(gx * 8).toFixed(1)}px, ${(gy * 5).toFixed(1)}px, 0)`
  }
}

onMounted(() => {
  paint()
  // Hearts also work with reduced motion (they just don't pulse) and with the keyboard.
  document.addEventListener('pointerover', onOver)
  document.addEventListener('pointerout', onOut)
  document.addEventListener('focusin', onOver)
  document.addEventListener('focusout', onOut)
  if (prefersReducedMotion()) return
  addEventListener('pointermove', onMove, { passive: true })
  addEventListener('pointerdown', onMove, { passive: true })
  tick = (time) => {
    // Nobody pointing for 3.5 s: wander gently (and look at nothing in particular).
    if (performance.now() - last > 3500) {
      const s = time
      tx = Math.sin(s * 0.55) * 0.7
      ty = Math.cos(s * 0.4) * 0.35
    }
    gx += (tx - gx) * 0.12
    gy += (ty - gy) * 0.12
    paint()
  }
  gsap.ticker.add(tick)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerover', onOver)
  document.removeEventListener('pointerout', onOut)
  document.removeEventListener('focusin', onOver)
  document.removeEventListener('focusout', onOut)
  removeEventListener('pointermove', onMove)
  removeEventListener('pointerdown', onMove)
  if (tick) gsap.ticker.remove(tick)
})
</script>

<template>
  <div ref="root" class="av" :class="{ 'is-love': love }">
    <div class="av__bob">
      <div ref="tilt" class="av__tilt">
        <img class="av__img" :src="photo" alt="" :width="1100" :height="1473" fetchpriority="high" />
        <img v-for="(h, i) in HEARTS" :key="i" class="av__heart" :src="lovePhoto" alt="" :style="heartStyle(h)" width="1100" height="1473" />
        <svg class="av__eyes" :viewBox="`0 0 ${AVATAR.w} ${AVATAR.h}`" aria-hidden="true">
          <defs>
            <radialGradient id="av-white" cx="50%" cy="50%" r="50%">
              <stop offset="0" stop-color="#f7f5ee" />
              <stop offset="0.6" stop-color="#ebe9df" />
              <stop offset="1" stop-color="#c4c4b2" />
            </radialGradient>
            <radialGradient id="av-iris" cx="50%" cy="50%" r="50%">
              <stop offset="0" stop-color="#5b4a1a" />
              <stop offset="0.72" stop-color="#9a8736" />
              <stop offset="0.93" stop-color="#7d6c2a" />
              <stop offset="1" stop-color="#2a2210" />
            </radialGradient>
            <linearGradient id="av-lid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#141405" stop-opacity="0.5" />
              <stop offset="0.5" stop-color="#141405" stop-opacity="0" />
            </linearGradient>
            <clipPath v-for="(e, i) in AVATAR.eyes" :id="eyeId(i)" :key="i">
              <ellipse :cx="e.cx" :cy="e.cy" :rx="e.rx" :ry="e.ry" />
            </clipPath>
          </defs>
          <g v-for="(e, i) in AVATAR.eyes" :key="i" :clip-path="`url(#${eyeId(i)})`">
            <ellipse :cx="e.cx" :cy="e.cy" :rx="e.rx" :ry="e.ry" fill="url(#av-white)" />
            <g :ref="(el) => (irises[i] = el)" :transform="`translate(${e.cx} ${e.cy})`">
              <circle :r="e.iris" fill="url(#av-iris)" />
              <circle :r="e.pupil" fill="#0b0905" />
              <circle :cx="e.glint.x" :cy="e.glint.y" :r="e.glint.r" fill="#fff" />
            </g>
            <rect :x="e.cx - e.rx" :y="e.cy - e.ry" :width="e.rx * 2" :height="e.ry * 2" fill="url(#av-lid)" />
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.av { perspective: 900px; mix-blend-mode: screen; } /* blends the whole figure with the page, not just inside the tilt */
.av__bob, .av__tilt { width: 100%; height: 100%; }
.av__tilt { position: relative; transform-style: preserve-3d; will-change: transform; transform-origin: 50% 70%; }
/* The artwork has a pure-black backdrop; the screen blend on .av removes it. */
.av__img { display: block; width: 100%; height: 100%; }
.av__eyes { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; transition: opacity 0.12s; }

/* Heart eyes: the love picture, clipped to each eye, pops in over the painted eyes and beats. */
.av__heart { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; transform: scale(0.4); pointer-events: none; transition: opacity 0.15s, transform 0.35s cubic-bezier(0.34, 1.9, 0.5, 1); z-index: 2; }
.is-love .av__heart { opacity: 1; transform: scale(1); animation: beat 0.9s 0.35s ease-in-out infinite; }
.is-love .av__eyes { opacity: 0; }
@keyframes beat {
  0%, 100% { transform: scale(1); }
  14% { transform: scale(1.16); }
  28% { transform: scale(1); }
  42% { transform: scale(1.1); }
  60% { transform: scale(1); }
}
</style>
