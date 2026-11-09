<script setup>
import menu from '@/data/menu.json'
import locations from '@/data/locations.json'
import { site } from '@/data/site'
import { optionLabel, photos } from '@/data/catalog'
import { money } from '@/utils/format'
import { locationStats } from '@/utils/locations'
import BaseButton from '@/components/ui/BaseButton.vue'

// Lead with the signature item and its prices: the fastest path from landing to ordering.
const birria = menu.featured.find((f) => f.name === 'Birria Tacos')
const stats = locationStats(locations)
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="wrap hero__in">
      <div class="hero__copy">
        <span class="tag">Signature · {{ birria.options }}</span>
        <h1 id="hero-title" class="display">Birria tacos.<br /><em>Dip in.</em></h1>
        <p class="hero__lead">Slow-braised and griddled, served for dipping. Grab two, three, or the whole pie for the table.</p>

        <ul class="prices" aria-label="Birria taco prices">
          <li v-for="p in birria.prices" :key="p.label">
            <span>{{ optionLabel(p.label) }}</span>
            <b class="display">{{ money(p.price) }}</b>
          </li>
        </ul>

        <div class="hero__actions">
          <BaseButton :href="site.orderUrl" variant="lime" size="lg">Order now</BaseButton>
          <BaseButton to="/menu" variant="light" size="lg">View full menu</BaseButton>
        </div>
        <p class="hero__cal">{{ birria.calories }}</p>
      </div>

      <div class="hero__art">
        <img :src="photos.birria" alt="A birria taco being dipped into a cup of broth" width="1400" height="1046" fetchpriority="high" />
      </div>
    </div>

    <ul class="trust wrap" aria-label="Why order from Guacado">
      <li><b>Open till 3am</b> every day</li>
      <li><b>{{ stats.open }} locations</b> in {{ stats.states }} states</li>
      <li><b>Order ahead</b> and skip the line</li>
    </ul>
  </section>
</template>

<style scoped>
/* Pure black so the photo's own black background disappears into the band. */
.hero { background: #000; color: var(--on-night); overflow: hidden; }
.hero__in { display: grid; gap: 8px; padding-top: clamp(24px, 4vw, 48px); }
@media (min-width: 900px) { .hero__in { grid-template-columns: 1fr 1.05fr; align-items: center; gap: 24px; } }
.hero__copy { display: grid; gap: 18px; justify-items: start; position: relative; z-index: 1; order: 2; padding-bottom: 8px; }
@media (min-width: 900px) { .hero__copy { order: 0; padding-block: 48px; } }
.tag {
  font-family: var(--f-display);
  font-weight: 800;
  font-stretch: 80%;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 13px;
  background: var(--lime);
  color: var(--on-lime);
  padding: 7px 12px;
  border-radius: var(--r-sm);
}
h1 { font-size: clamp(56px, 9vw, 124px); line-height: 0.86; }
h1 em { font-style: normal; color: var(--lime); }
.hero__lead { font-size: clamp(16px, 1.5vw, 19px); color: var(--on-night-muted); max-width: 42ch; }
.prices { list-style: none; margin: 4px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
.prices li {
  display: grid;
  gap: 2px;
  padding: 10px 16px 12px;
  border: 1px solid var(--night-line);
  border-radius: var(--r-md);
  background: var(--night-raised);
  min-width: 96px;
}
.prices span { font-size: 12.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--on-night-muted); }
.prices b { font-size: 30px; line-height: 1; }
.hero__actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 6px; }
.hero__cal { font-size: 12.5px; color: var(--on-night-muted); }
.hero__art { margin-inline: calc(var(--gut-l) * -1) calc(var(--gut-r) * -1); }
.hero__art img { width: 100%; height: auto; max-height: 62vh; object-fit: cover; object-position: 50% 40%; -webkit-mask-image: radial-gradient(ellipse 56% 58% at 50% 50%, #000 66%, transparent 100%);
  mask-image: radial-gradient(ellipse 56% 58% at 50% 50%, #000 66%, transparent 100%); }
@media (min-width: 900px) {
  .hero__art { margin: 0 -40px 0 0; }
  .hero__art img { max-height: none; }
}
.trust {
  list-style: none;
  margin-top: clamp(16px, 3vw, 32px);
  padding-block: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px 32px;
  border-top: 1px solid var(--night-line);
  font-size: 14.5px;
  color: var(--on-night-muted);
}
.trust b { color: var(--on-night); }
.trust li { display: flex; gap: 6px; align-items: center; }
.trust li::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--lime); }
</style>
