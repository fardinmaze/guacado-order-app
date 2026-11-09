<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { nav, site } from '@/data/site'
import { gsap, prefersReducedMotion } from '@/composables/useMotion'
import logo from '@/assets/logos/guacado-wordmark-reverse.png'
import AppLink from '@/components/ui/AppLink.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

// Full-screen guac drawer with a circle reveal (BRAND.md §7, §9).
// Escape closes; Tab is trapped inside; the parent returns focus to the burger.
const props = defineProps({ open: { type: Boolean, default: false } })
const emit = defineEmits(['close'])

const root = ref(null)
const closeBtn = ref(null)

function onEnter(el, done) {
  if (prefersReducedMotion()) return done()
  gsap.fromTo(el, { clipPath: 'circle(0% at 92% 4%)' }, { clipPath: 'circle(150% at 92% 4%)', duration: 0.7, ease: 'power3.inOut', onComplete: done })
  gsap.from(el.querySelectorAll('nav a'), { y: 40, opacity: 0, stagger: 0.05, delay: 0.25, duration: 0.5, ease: 'power3.out' })
}
function onLeave(el, done) {
  done()
}

function onKeydown(e) {
  if (e.key === 'Escape') return emit('close')
  if (e.key !== 'Tab' || !root.value) return
  const focusable = root.value.querySelectorAll('a[href], button:not([disabled])')
  if (!focusable.length) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
}

watch(
  () => props.open,
  async (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    if (isOpen) {
      document.addEventListener('keydown', onKeydown)
      await nextTick()
      closeBtn.value?.focus()
    } else {
      document.removeEventListener('keydown', onKeydown)
    }
  },
)

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <!-- Teleported: the sticky header's backdrop-filter would otherwise become the containing block for `position: fixed`. -->
  <Teleport to="body">
  <Transition :css="false" @enter="onEnter" @leave="onLeave">
    <div v-if="open" id="drawer" ref="root" class="drawer" role="dialog" aria-modal="true" aria-label="Site menu">
      <div class="drawer__top">
        <img :src="logo" alt="Guacado Mexican Grill" width="150" height="36" />
        <button ref="closeBtn" class="burger" type="button" aria-label="Close menu" @click="emit('close')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>
      <nav aria-label="Mobile">
        <AppLink v-for="item in nav" :key="item.label" :to="item.to" :href="item.href" @click="emit('close')">
          {{ item.label }}
        </AppLink>
      </nav>
      <div class="drawer__foot">
        <span>{{ site.hoursLong }}</span>
        <span>{{ site.email }}</span>
        <BaseButton variant="lime" :href="site.orderUrl">ORDER ONLINE</BaseButton>
      </div>
    </div>
  </Transition>
  </Teleport>
</template>

<style scoped>
.drawer {
  position: fixed;
  inset: 0;
  z-index: 70;
  background: var(--guac);
  color: var(--on-green);
  display: flex;
  flex-direction: column;
  padding: calc(20px + env(safe-area-inset-top, 0px)) var(--gut-r) calc(28px + env(safe-area-inset-bottom, 0px)) var(--gut-l);
  overflow-y: auto;
}
.drawer__top { display: flex; justify-content: space-between; align-items: center; }
.drawer__top img { width: 150px; height: auto; }
nav { display: flex; flex-direction: column; margin-top: 36px; }
nav a {
  font-family: var(--f-display);
  font-size: clamp(30px, 9vw, 46px);
  line-height: 1.2;
  text-decoration: none;
  padding: 6px 0;
  border-bottom: 1px solid rgba(246, 241, 231, 0.18);
}
.drawer__foot { margin-top: auto; padding-top: 28px; display: flex; flex-direction: column; gap: 12px; font-size: 15px; }
.burger {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1.5px solid rgba(246, 241, 231, 0.4);
  background: transparent;
  color: var(--on-green);
  display: grid;
  place-items: center;
  cursor: pointer;
}
.burger svg { width: 22px; height: 22px; }
</style>
