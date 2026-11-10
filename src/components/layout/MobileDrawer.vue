<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { nav, site } from '@/data/site'
import logo from '@/assets/logos/guacado-wordmark.png'
import AppLink from '@/components/ui/AppLink.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

// Left slide-in drawer. Escape closes; Tab is trapped inside; the parent returns focus.
const props = defineProps({ open: { type: Boolean, default: false } })
const emit = defineEmits(['close'])

const root = ref(null)
const closeBtn = ref(null)
const links = nav.filter((n) => n.label !== 'Order')

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
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="open" class="scrim" @click.self="emit('close')">
        <div id="drawer" ref="root" class="drawer" role="dialog" aria-modal="true" aria-label="Site menu">
          <div class="drawer__top">
            <img :src="logo" alt="Guacado Mexican Grill" width="140" height="33" />
            <button ref="closeBtn" class="x" type="button" aria-label="Close menu" @click="emit('close')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
          <BaseButton :href="site.orderUrl" size="lg" block>Order now</BaseButton>
          <nav aria-label="Mobile">
            <AppLink v-for="item in links" :key="item.label" :to="item.to" :href="item.href" @click="emit('close')">
              {{ item.label }}
              <span aria-hidden="true">›</span>
            </AppLink>
          </nav>
          <div class="drawer__foot">
            <span>{{ site.hoursLong }}</span>
            <a :href="`mailto:${site.email}`">{{ site.email }}</a>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.scrim { position: fixed; inset: 0; z-index: 70; background: rgba(10, 15, 12, 0.5); }
.drawer {
  position: absolute;
  inset: 0 auto 0 0;
  width: min(380px, 88vw);
  background: var(--ground);
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: calc(16px + env(safe-area-inset-top, 0px)) 20px calc(24px + env(safe-area-inset-bottom, 0px)) var(--gut-l);
  overflow-y: auto;
}
.drawer__top { display: flex; justify-content: space-between; align-items: center; }
.drawer__top img { width: 140px; height: auto; }
nav { display: flex; flex-direction: column; }
nav a {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--f-display);
  font-weight: 900;
  font-stretch: 72%;
  text-transform: uppercase;
  font-size: 26px;
  text-decoration: none;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
}
nav a span { color: var(--guac); }
.drawer__foot { margin-top: auto; display: grid; gap: 6px; font-size: 14px; color: var(--ink-muted); }
.drawer__foot a { color: var(--ink); font-weight: 600; }
.x { width: 44px; height: 44px; border-radius: 50%; border: 0; background: var(--surface); color: var(--ink); display: grid; place-items: center; cursor: pointer; }
.x svg { width: 22px; height: 22px; }

.drawer-enter-active, .drawer-leave-active { transition: background 0.25s; }
.drawer-enter-active .drawer, .drawer-leave-active .drawer { transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); }
.drawer-enter-from, .drawer-leave-to { background: transparent; }
.drawer-enter-from .drawer, .drawer-leave-to .drawer { transform: translateX(-100%); }
</style>
