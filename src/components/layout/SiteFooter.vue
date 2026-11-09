<script setup>
import { ref } from 'vue'
import { footerColumns, nav, site } from '@/data/site'
import { useCopyToClipboard } from '@/composables/useCopyToClipboard'
import badge from '@/assets/logos/guacado-badge.png'
import AppLink from '@/components/ui/AppLink.vue'

const { copy } = useCopyToClipboard()
const emailEl = ref(null)

// Resolve column labels against the shared nav so URLs live in one place.
const columns = footerColumns.map((col) => ({
  title: col.title,
  items: [
    ...col.items.map((label) => nav.find((n) => n.label === label)),
    ...(col.extra ?? []),
  ],
}))
</script>

<template>
  <footer class="ftr">
    <div class="wrap">
      <div class="ftr__grid">
        <div class="ftr__brand">
          <img :src="badge" alt="Guacado Mexican Grill" width="120" height="120" loading="lazy" />
          <p>Fresh, flavorful Mexican food with bold spices and a lively neighborhood feel.</p>
          <div class="social">
            <a :href="site.facebook" aria-label="Guacado on Facebook">
              <svg viewBox="0 0 24 24"><path d="M14 8.5V6.8c0-.8.5-1 .9-1H17V2.1L14.1 2C10.9 2 10.2 4.4 10.2 6v2.5H8v3.8h2.2V22H14v-9.7h2.9l.4-3.8H14z" /></svg>
            </a>
            <a :href="site.instagram" aria-label="Guacado on Instagram">
              <svg viewBox="0 0 24 24"><path d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2zM17 5.9a1.1 1.1 0 1 0 0 2.3 1.1 1.1 0 0 0 0-2.3zM21.9 7.9c-.1-1.6-.4-3-1.6-4.2S17.7 2.2 16.1 2.1C14.5 2 9.5 2 7.9 2.1 6.3 2.2 4.9 2.5 3.7 3.7S2.2 6.3 2.1 7.9C2 9.5 2 14.5 2.1 16.1c.1 1.6.4 3 1.6 4.2s2.6 1.5 4.2 1.6c1.6.1 6.6.1 8.2 0 1.6-.1 3-.4 4.2-1.6s1.5-2.6 1.6-4.2c.1-1.6.1-6.6 0-8.2zm-2.1 9.9a3.3 3.3 0 0 1-1.9 1.9c-1.3.5-4.4.4-5.9.4s-4.6.1-5.9-.4a3.3 3.3 0 0 1-1.9-1.9c-.5-1.3-.4-4.4-.4-5.8s-.1-4.6.4-5.8a3.3 3.3 0 0 1 1.9-1.9C7.4 3.8 10.5 3.9 12 3.9s4.6-.1 5.9.4a3.3 3.3 0 0 1 1.9 1.9c.5 1.3.4 4.4.4 5.8s.1 4.6-.4 5.8z" /></svg>
            </a>
          </div>
        </div>

        <div v-for="col in columns" :key="col.title">
          <h4>{{ col.title.toUpperCase() }}</h4>
          <ul>
            <li v-for="item in col.items" :key="item.label">
              <AppLink :to="item.to" :href="item.href">{{ item.label }}</AppLink>
            </li>
          </ul>
        </div>

        <div>
          <h4>CONTACT</h4>
          <ul>
            <li>
              <button class="copy" type="button" title="Copy email address" @click="copy(site.email, { fallbackEl: emailEl })">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" /></svg>
                <span ref="emailEl">{{ site.email }}</span>
              </button>
            </li>
            <li class="hours">{{ site.hours }}</li>
          </ul>
        </div>
      </div>

      <div class="ftr__base">
        <span>© 2026 Guacado Mexican Grill</span>
        <a href="#top" class="top">Back to top ↑</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.ftr { border-top: 1px solid var(--line); padding-block: 64px calc(32px + env(safe-area-inset-bottom, 0px)); background: var(--ground); }
.ftr__grid { display: grid; gap: 36px; }
@media (min-width: 860px) { .ftr__grid { grid-template-columns: 1.2fr 1fr 1fr 1fr; } }
.ftr__brand img { width: 120px; height: auto; }
.ftr__brand p { margin-top: 14px; color: var(--ink-muted); font-size: 14.5px; max-width: 30ch; }
h4 { margin: 0 0 12px; font-family: var(--f-cond); font-weight: 400; letter-spacing: 2px; font-size: 17px; color: var(--accent-text); }
ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
a { text-decoration: none; color: var(--ink); }
ul a:hover { color: var(--lime); }
.hours { color: var(--ink-muted); font-size: 14.5px; }
.copy {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  background: var(--surface);
  border: 1px solid var(--line);
  color: var(--ink);
  padding: 8px 12px;
  border-radius: var(--r-sm);
  font: 600 14px var(--f-body);
  cursor: pointer;
  max-width: 100%;
  overflow-wrap: anywhere;
  text-align: left;
}
.copy svg { width: 15px; height: 15px; flex: none; }
.social { display: flex; gap: 10px; margin-top: 14px; }
.social a { width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center; border: 1px solid var(--line); }
.social a:hover { border-color: var(--lime); }
.social svg { width: 18px; height: 18px; fill: currentColor; }
.ftr__base {
  margin-top: 48px;
  padding-top: 20px;
  border-top: 1px solid var(--line);
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
  justify-content: space-between;
  font-size: 13px;
  color: var(--ink-muted);
}
.top { color: var(--ink-muted); }
</style>
