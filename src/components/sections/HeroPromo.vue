<script setup>
import menu from '@/data/menu.json'
import locations from '@/data/locations.json'
import { site } from '@/data/site'
import { fromPrices, optionLabel, photos, videos } from '@/data/catalog'
import { money } from '@/utils/format'
import { locationStats } from '@/utils/locations'
import BaseButton from '@/components/ui/BaseButton.vue'
import LoopVideo from '@/components/ui/LoopVideo.vue'

// White Chipotle-style hero: offer on the left, the bowl-build clip in a big media card,
// and a second card pushing the signature birria tacos.
const byo = menu.buildYourOwn
const birria = menu.featured.find((f) => f.name === 'Birria Tacos')
const stats = locationStats(locations)
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="wrap hero__in">
      <div class="hero__copy">
        <span class="tag">Build your own · From {{ money(fromPrices.byo) }}</span>
        <h1 id="hero-title" class="display">Your bowl.<br /><em>Your way.</em></h1>
        <p class="hero__lead">
          Pick a base, a protein, fresh toppings and a homemade sauce. Your protein sets the price; everything else is on us.
        </p>
        <div class="hero__actions">
          <BaseButton :href="site.orderUrl" size="lg">Order now</BaseButton>
          <BaseButton to="/#build" variant="outline" size="lg">Build yours</BaseButton>
        </div>
        <p class="hero__cal">{{ byo.calories }}</p>
      </div>

      <div class="hero__media media-card">
        <LoopVideo :src="videos.loop" :poster="photos.bowl" label="A burrito bowl being built layer by layer: rice, beans, grilled chicken, toppings, guac and sauce" />
      </div>
    </div>

    <div class="wrap">
      <a class="birria" :href="site.orderUrl">
        <span class="birria__img media-card"><img :src="photos.birria" alt="" width="1400" height="1046" /></span>
        <span class="birria__copy">
          <span class="eyebrow">Signature · {{ birria.options }}</span>
          <b class="display">Birria tacos</b>
          <span class="birria__prices">
            <span v-for="p in birria.prices" :key="p.label">{{ optionLabel(p.label) }} <strong>{{ money(p.price) }}</strong></span>
          </span>
        </span>
        <span class="birria__go">Order</span>
      </a>

      <ul class="trust" aria-label="Why order from Guacado">
        <li><b>Open till 3am</b> every day</li>
        <li><b>{{ stats.open }} locations</b> in {{ stats.states }} states</li>
        <li><b>Order ahead</b> and skip the line</li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.hero { background: var(--ground); padding-top: clamp(20px, 3vw, 40px); }
.hero__in { display: grid; gap: 24px; }
@media (min-width: 900px) { .hero__in { grid-template-columns: 0.9fr 1.1fr; align-items: center; gap: 48px; } }
.hero__copy { display: grid; gap: 18px; justify-items: start; order: 2; }
@media (min-width: 900px) { .hero__copy { order: 0; } }
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
h1 { font-size: clamp(56px, 8.6vw, 120px); line-height: 0.86; }
h1 em { font-style: normal; color: var(--guac); }
.hero__lead { font-size: clamp(16px, 1.5vw, 19px); color: var(--ink-muted); max-width: 42ch; }
.hero__actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 4px; }
.hero__cal { font-size: 12.5px; color: var(--ink-muted); }
.hero__media { aspect-ratio: 16 / 10; }
@media (min-width: 900px) { .hero__media { aspect-ratio: 4 / 3.4; } }
.hero__media :deep(video) { object-position: 50% 70%; }

/* Secondary offer strip under the hero. */
.birria {
  margin-top: 20px;
  display: grid;
  grid-template-columns: 96px 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 12px 16px 12px 12px;
  border: 1.5px solid var(--line);
  border-radius: var(--r-lg);
  text-decoration: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.birria:hover { border-color: var(--ink); box-shadow: var(--shadow-card); }
.birria__img { width: 96px; aspect-ratio: 1; border-radius: var(--r-md); }
.birria__img img { width: 100%; height: 100%; object-fit: cover; }
.birria__copy { display: grid; gap: 4px; min-width: 0; }
.birria__copy b { font-size: clamp(26px, 3vw, 34px); }
.birria__prices { display: flex; flex-wrap: wrap; gap: 4px 14px; font-size: 13.5px; color: var(--ink-muted); font-weight: 600; }
.birria__prices strong { color: var(--ink); }
.birria__go {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 22px;
  border-radius: var(--r-pill);
  background: var(--guac);
  color: var(--on-green);
  font: 800 16px/1 var(--f-display);
  font-stretch: 80%;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
@media (max-width: 520px) {
  .birria { grid-template-columns: 72px 1fr; }
  .birria__img { width: 72px; }
  .birria__go { grid-column: 1 / -1; justify-content: center; }
}

.trust {
  list-style: none;
  margin: 0;
  padding: 20px 0 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px 32px;
  font-size: 14.5px;
  color: var(--ink-muted);
}
.trust b { color: var(--ink); }
.trust li { display: flex; gap: 6px; align-items: center; }
.trust li::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--guac); }
</style>
