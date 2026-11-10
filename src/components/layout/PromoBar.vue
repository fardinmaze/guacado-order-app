<script setup>
import locations from '@/data/locations.json'
import { site } from '@/data/site'
import { locationStats } from '@/utils/locations'

const { open } = locationStats(locations)
</script>

<template>
  <div class="promo">
    <div class="wrap promo__in">
      <span>{{ site.hoursOpen }}</span>
      <span class="dot" aria-hidden="true" />
      <span class="hide-sm">Order ahead for pickup at {{ open }} locations</span>
      <a :href="site.orderUrl" class="promo__cta">Order now <span aria-hidden="true">→</span></a>
    </div>
  </div>
</template>

<style scoped>
.promo { background: var(--guac); color: var(--on-green); font-size: 13.5px; font-weight: 600; }
.promo__in { min-height: 38px; display: flex; align-items: center; justify-content: center; gap: 12px; text-align: center; }
.dot { width: 4px; height: 4px; border-radius: 50%; background: var(--lime); flex: none; }
.promo__cta { font-weight: 800; color: var(--lime); text-decoration: none; white-space: nowrap; }
.promo__cta:hover { text-decoration: underline; }
@media (max-width: 639px) { .hide-sm { display: none; } }
</style>
