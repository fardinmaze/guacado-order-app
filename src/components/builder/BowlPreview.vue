<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { prefersReducedMotion } from '@/composables/useMotion'

// Builder preview: the bowl-build clip plays forward to `target` (seconds) as the guest
// picks, and jumps back when they undo. The clip is encoded with every frame a keyframe,
// so seeking is instant. Reduced motion: jumps straight to the frame, no playback.
const props = defineProps({
  src: { type: String, required: true },
  poster: { type: String, default: '' },
  target: { type: Number, required: true },
  caption: { type: String, default: '' },
})

const video = ref(null)
const active = ref(false)
let raf = 0
let io

function stop() {
  cancelAnimationFrame(raf)
  video.value?.pause()
}

function goTo(t) {
  const v = video.value
  if (!v || v.readyState < 1) return
  cancelAnimationFrame(raf)
  if (prefersReducedMotion() || t <= v.currentTime + 0.05) {
    v.pause()
    v.currentTime = t
    return
  }
  v.playbackRate = 1.75
  v.play()?.catch?.(() => (v.currentTime = t))
  const tick = () => {
    if (v.currentTime >= t || v.ended) return stop()
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
}

function onLoaded() {
  // First frame shown: the state the builder starts in.
  video.value.currentTime = props.target
}

watch(() => props.target, goTo)

onMounted(() => {
  if (typeof IntersectionObserver !== 'function') return
  io = new IntersectionObserver(([e]) => e.isIntersecting && (active.value = true), { rootMargin: '300px 0px' })
  io.observe(video.value)
})
onBeforeUnmount(() => {
  stop()
  io?.disconnect()
})
</script>

<template>
  <figure class="preview media-card">
    <video
      ref="video"
      :src="active ? src : undefined"
      :poster="poster"
      muted
      playsinline
      preload="auto"
      disablepictureinpicture
      aria-hidden="true"
      @loadedmetadata="onLoaded"
    />
    <figcaption v-if="caption"><span>{{ caption }}</span></figcaption>
  </figure>
</template>

<style scoped>
.preview { margin: 0; aspect-ratio: 16 / 9; }
video { width: 100%; height: 100%; object-fit: cover; object-position: 50% 80%; display: block; }
figcaption {
  position: absolute;
  left: 12px;
  bottom: 12px;
  z-index: 1;
}
figcaption span {
  display: inline-block;
  background: var(--lime);
  color: var(--on-lime);
  font: 800 12.5px/1 var(--f-display);
  font-stretch: 80%;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 7px 10px;
  border-radius: var(--r-sm);
}
</style>
