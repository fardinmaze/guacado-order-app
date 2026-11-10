<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { headerNav, nav, site } from '@/data/site'
import { useScrolled } from '@/composables/useScrolled'
import logo from '@/assets/logos/guacado-wordmark.png'
import AppLink from '@/components/ui/AppLink.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import MobileDrawer from './MobileDrawer.vue'

// Sticky white bar. The ORDER button is visible at every width: it is the page's job.
const scrolled = useScrolled(40)
const open = ref(false)
const burger = ref(null)
const route = useRoute()

const links = headerNav.map((label) => nav.find((n) => n.label === label))

function close() {
  open.value = false
  burger.value?.focus() // return focus to the trigger
}

watch(() => route.fullPath, () => (open.value = false))
</script>

<template>
  <header id="top" class="hdr" :class="{ 'is-stuck': scrolled }">
    <div class="wrap hdr__in">
      <button
        ref="burger"
        class="burger"
        type="button"
        aria-label="Open menu"
        aria-controls="drawer"
        :aria-expanded="open"
        @click="open = true"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </button>

      <RouterLink class="hdr__logo" to="/" aria-label="Guacado Mexican Grill home">
        <img :src="logo" alt="Guacado Mexican Grill" width="168" height="40" />
      </RouterLink>

      <nav class="nav" aria-label="Main">
        <AppLink v-for="item in links" :key="item.label" :to="item.to" :href="item.href">{{ item.label }}</AppLink>
      </nav>

      <div class="hdr__actions">
        <RouterLink to="/locations" class="find">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></svg>
          <span>Find a location</span>
        </RouterLink>
        <BaseButton :href="site.orderUrl" class="hdr__order">Order now</BaseButton>
      </div>
    </div>
    <MobileDrawer :open="open" @close="close" />
  </header>
</template>

<style scoped>
.hdr {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--ground);
  border-bottom: 1px solid var(--line);
  transition: box-shadow 0.2s;
}
.hdr.is-stuck { box-shadow: 0 6px 20px -14px rgba(20, 35, 27, 0.45); }
.hdr__in { display: flex; align-items: center; gap: 12px; min-height: var(--header-h); }
.hdr__logo img { width: clamp(124px, 14vw, 168px); height: auto; }
.nav { display: none; gap: 4px; margin-left: 20px; }
.nav a {
  font-family: var(--f-display);
  font-weight: 800;
  font-stretch: 80%;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 16px;
  text-decoration: none;
  padding: 10px 14px;
  border-radius: var(--r-pill);
  color: var(--ink);
  transition: background 0.15s;
}
.nav a:hover { background: var(--surface); }
.nav a.router-link-active { box-shadow: inset 0 -3px 0 var(--guac); border-radius: 0; }
.hdr__actions { margin-left: auto; display: flex; align-items: center; gap: 8px; }
.find {
  display: none;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  font-size: 14.5px;
  text-decoration: none;
  padding: 10px 12px;
  border-radius: var(--r-pill);
}
.find:hover { background: var(--surface); }
.find svg { width: 20px; height: 20px; color: var(--guac); }
.burger {
  width: 44px;
  height: 44px;
  margin-left: -8px;
  border-radius: 50%;
  border: 0;
  background: transparent;
  color: var(--ink);
  display: grid;
  place-items: center;
  cursor: pointer;
}
.burger:hover { background: var(--surface); }
.burger svg { width: 24px; height: 24px; }
@media (max-width: 420px) { .hdr__order { min-height: 42px; padding: 0 16px; font-size: 15px; } }
@media (min-width: 1000px) {
  .nav, .find { display: flex; }
  .burger { display: none; }
}
</style>
