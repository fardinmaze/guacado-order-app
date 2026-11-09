<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { prefersReducedMotion } from '@/composables/useMotion'

// Muted looping clip. mode="view": plays while on screen. mode="hover": plays while the
// pointer is over the closest `hoverClosest` ancestor (or the video), and like "view" on touch devices.
// The source is only attached once the clip nears the viewport, and reduced-motion
// guests get the poster frame.
const props = defineProps({
  src: { type: String, required: true },
  poster: { type: String, default: '' },
  mode: { type: String, default: 'view' }, // view | hover
  hoverClosest: { type: String, default: '' }, // selector of the ancestor that triggers hover play
  label: { type: String, default: '' },
})

const video = ref(null)
const active = ref(false) // source attached
let io
let offHover = () => {}

// Attach the source first; play() on a <video> without src does nothing.
const play = async () => {
  active.value = true
  await nextTick()
  video.value?.play?.()?.catch?.(() => {})
}
const pause = () => video.value?.pause?.()

onMounted(() => {
  if (prefersReducedMotion() || typeof IntersectionObserver !== 'function') return
  const touch = typeof matchMedia === 'function' && !matchMedia('(hover: hover)').matches
  const hover = props.mode === 'hover' && !touch

  io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) active.value = true
      if (hover) return
      e.isIntersecting && e.intersectionRatio > 0.35 ? play() : pause()
    },
    { rootMargin: '200px 0px', threshold: [0, 0.35] },
  )
  io.observe(video.value)

  if (hover) {
    const el = (props.hoverClosest && video.value.closest(props.hoverClosest)) || video.value
    const enter = () => play()
    const leave = () => { pause(); if (video.value) video.value.currentTime = 0 }
    el.addEventListener('pointerenter', enter)
    el.addEventListener('pointerleave', leave)
    offHover = () => {
      el.removeEventListener('pointerenter', enter)
      el.removeEventListener('pointerleave', leave)
    }
  }
})

onBeforeUnmount(() => {
  io?.disconnect()
  offHover()
})
</script>

<template>
  <video
    ref="video"
    class="loop"
    :src="active ? src : undefined"
    :poster="poster"
    muted
    loop
    playsinline
    preload="none"
    disablepictureinpicture
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
  />
</template>

<style scoped>
.loop { display: block; width: 100%; height: 100%; object-fit: cover; background: #000; }
</style>
