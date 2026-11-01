<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { stateNames } from '@/data/site'
import { cityLine } from '@/utils/format'
import { filterLocations } from '@/utils/locations'
import { stores } from '@/order/lib/catalog'
import { storeStatus } from '@/order/lib/hours'
import { useOrder } from '@/order/useOrder'

// LOC-01/03/04: pick the restaurant first. Search matches street, city and ZIP; "Coming soon" stores
// are listed but cannot be chosen. Open/closed is computed in each store's own time zone.
const router = useRouter()
const order = useOrder()
const query = ref('')
const now = ref(new Date())
const tick = setInterval(() => (now.value = new Date()), 60000)
onBeforeUnmount(() => clearInterval(tick))

const groups = computed(() => {
  const found = filterLocations(stores, { query: query.value })
  return Object.entries(stateNames)
    .map(([code, name]) => ({ code, name, rows: found.filter((s) => s.state === code) }))
    .filter((g) => g.rows.length)
})
const rowsCount = computed(() => groups.value.reduce((n, g) => n + g.rows.length, 0))

function choose(s) {
  if (!order.chooseStore(s.slug)) return
  router.push(`/order/${s.slug}`)
}
</script>

<template>
  <section aria-labelledby="loc-title">
    <p class="eyebrow">Pickup</p>
    <h1 id="loc-title" class="title">Where are we<br />cooking for you?</h1>
    <p class="lead">Pick your restaurant first, so what you order is what that kitchen has.</p>

    <label class="search">
      <span class="sr-only">Search by street, city or ZIP</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
      <input v-model="query" type="search" inputmode="search" autocomplete="postal-code" placeholder="Street, city or ZIP" />
    </label>
    <p class="count" role="status">{{ rowsCount }} {{ rowsCount === 1 ? 'restaurant' : 'restaurants' }}</p>

    <div v-for="g in groups" :key="g.code" class="grp">
      <h2 class="grp__h">{{ g.name }}</h2>
      <ul class="list">
        <li v-for="s in g.rows" :key="s.slug">
          <button
            type="button"
            class="row"
            :class="storeStatus(s, now).state"
            :disabled="s.status !== 'OPEN'"
            @click="choose(s)"
          >
            <span class="row__main">
              <strong>{{ s.address }}</strong>
              <span class="row__city">{{ cityLine(s) }}</span>
              <span class="row__st">{{ storeStatus(s, now).label }}</span>
            </span>
            <svg v-if="s.status === 'OPEN'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </li>
      </ul>
    </div>

    <div v-if="!groups.length" class="none">
      <p>No restaurant matches “{{ query }}”.</p>
      <p>Check the spelling or try a ZIP code.</p>
    </div>
  </section>
</template>

<style scoped>
.title { font: 400 clamp(34px, 9vw, 48px)/1 var(--f-display); text-transform: uppercase; margin: 6px 0 12px; }
.lead { color: var(--ink-muted); margin-bottom: 20px; }
.search { position: relative; display: block; }
.search svg { position: absolute; left: 16px; top: 50%; width: 22px; height: 22px; transform: translateY(-50%); color: var(--ink-muted); }
.search input {
  width: 100%;
  min-height: 56px;
  padding: 0 16px 0 48px;
  border-radius: var(--r-pill);
  border: 1.5px solid var(--line);
  background: var(--surface);
  color: var(--ink);
  font: 600 16px var(--f-body); /* 16px keeps iOS from zooming on focus */
}
.search input::placeholder { color: var(--ink-muted); }
.count { margin: 10px 4px 4px; font-size: 14px; color: var(--ink-muted); }
.grp { margin-top: 24px; }
.grp__h { font: 400 18px/1 var(--f-cond); letter-spacing: 3px; text-transform: uppercase; color: var(--accent-text); margin-bottom: 8px; }
.list { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.row { display: flex; align-items: center; gap: 12px; width: 100%; min-height: 72px; padding: 12px 16px; text-align: left; border-radius: var(--r-md); border: 1.5px solid var(--line); background: var(--surface); color: var(--ink); cursor: pointer; font: inherit; }
.row:active:not(:disabled) { transform: scale(0.985); }
.row:hover:not(:disabled) { border-color: var(--lime); }
.row:disabled { cursor: default; opacity: 0.6; }
.row__main { flex: 1; display: grid; gap: 1px; min-width: 0; }
.row__main strong { font-size: 17px; }
.row__city { font-size: 14px; color: var(--ink-muted); }
.row__st { font-size: 13px; font-weight: 700; color: var(--ink-muted); }
.row.open .row__st { color: var(--lime); }
.row.closed .row__st { color: var(--chili); }
.row svg { width: 22px; height: 22px; flex: none; color: var(--ink-muted); }
.none { margin-top: 32px; padding: 24px; border-radius: var(--r-md); background: var(--surface); color: var(--ink-muted); display: grid; gap: 4px; }
.none p:first-child { color: var(--ink); font-weight: 800; }
</style>
