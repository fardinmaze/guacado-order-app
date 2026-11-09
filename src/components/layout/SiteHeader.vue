<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { nav, site } from '@/data/site'
import { useScrolled } from '@/composables/useScrolled'
import logo from '@/assets/logos/guacado-wordmark-reverse.png'
import AppLink from '@/components/ui/AppLink.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import MobileDrawer from './MobileDrawer.vue'

// Sticky header: transparent at the top, blurred bar once scrolled > 10px.
const scrolled = useScrolled(10)
const open = ref(false)
const burger = ref(null)
const route = useRoute()

function close() {
  open.value = false
  burger.value?.focus() // return focus to the trigger
}

watch(() => route.fullPath, () => (open.value = false))
</script>

<template>
  <header id="top" class="hdr" :class="{ 'is-stuck': scrolled }">
    <div class="wrap hdr__in">
      <RouterLink class="hdr__logo" to="/" aria-label="Guacado Mexican Grill home">
        <img :src="logo" alt="Guacado Mexican Grill" width="196" height="47" />
      </RouterLink>
      <nav class="nav" aria-label="Main">
        <AppLink v-for="item in nav" :key="item.label" :to="item.to" :href="item.href">
          {{ item.label.toUpperCase() }}
        </AppLink>
      </nav>
      <BaseButton class="hdr__cta" :href="site.orderUrl">ORDER ONLINE</BaseButton>
      <button
        ref="burger"
        class="burger"
        type="button"
        aria-label="Open menu"
        aria-controls="drawer"
        :aria-expanded="open"
        @click="open = true"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h10" /></svg>
      </button>
    </div>
    <MobileDrawer :open="open" @close="close" />
  </header>
</template>

<style scoped>
.hdr {
  position: sticky;
  top: env(safe-area-inset-top, 0px);
  z-index: 50;
  border-bottom: 1px solid transparent;
  transition: background 0.3s, border-color 0.3s;
}
.hdr.is-stuck {
  background: rgba(10, 18, 14, 0.88);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-color: var(--line);
}
.hdr__in { display: flex; align-items: center; gap: 24px; min-height: 76px; }
.hdr__logo img { width: clamp(150px, 16vw, 196px); height: auto; }
.nav { display: none; gap: 4px; margin-left: auto; }
.nav a {
  position: relative;
  font-family: var(--f-cond);
  font-size: 18px;
  letter-spacing: 2px;
  text-decoration: none;
  padding: 10px 12px;
  border-radius: var(--r-sm);
  color: var(--ink);
}
.nav a::after {
  content: '';
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 6px;
  height: 2px;
  background: var(--lime);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s;
}
.nav a:hover::after,
.nav a.router-link-active::after { transform: scaleX(1); }
.hdr__cta { display: none; }
.burger {
  margin-left: auto;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1.5px solid var(--line);
  background: var(--surface);
  color: var(--ink);
  display: grid;
  place-items: center;
  cursor: pointer;
}
.burger svg { width: 22px; height: 22px; }
@media (min-width: 1080px) {
  .nav { display: flex; }
  .hdr__cta { display: inline-flex; }
  .burger { display: none; }
}
</style>
