<script setup>
import { site } from '@/data/site'
import { addOns, photos, videos } from '@/data/catalog'
import { money } from '@/utils/format'
import { GUAC_PRICE } from '@/utils/pricing'
import BaseButton from '@/components/ui/BaseButton.vue'
import LoopVideo from '@/components/ui/LoopVideo.vue'
</script>

<template>
  <section class="band band--alt upsell" aria-labelledby="guac-title">
    <div class="wrap">
      <!-- Feature promo: guac is the one paid add-on that fits every entrée. -->
      <div class="promo">
        <div class="promo__media media-card">
          <LoopVideo :src="videos.guac" :poster="photos.guac" label="A scoop of fresh guacamole landing on a burrito bowl" />
          <span class="promo__price display">+{{ money(GUAC_PRICE) }}</span>
        </div>
        <div class="promo__copy">
          <span class="eyebrow">Add-on</span>
          <h2 id="guac-title" class="display">Fresh guac<br />on anything</h2>
          <p>Bowl, burrito, nachos or tacos. Add a scoop of fresh guac for <b>{{ money(GUAC_PRICE) }}</b>.</p>
          <BaseButton :href="site.orderUrl" size="lg">Order now</BaseButton>
        </div>
      </div>

      <div class="meal">
        <h2 class="display meal__title">Make it a meal</h2>
        <ul class="meal__list">
          <li v-for="a in addOns" :key="a.name" class="meal__item">
            <div>
              <b>{{ a.name }}</b>
              <span v-if="a.note || a.calories">{{ [a.note, a.calories].filter(Boolean).join(' · ') }}</span>
            </div>
            <strong class="display">{{ money(a.price) }}</strong>
          </li>
        </ul>
        <BaseButton :href="site.orderUrl" variant="outline">Add to your order</BaseButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.promo { display: grid; gap: 24px; }
@media (min-width: 900px) { .promo { grid-template-columns: 1.2fr 1fr; align-items: center; gap: 56px; } }
.promo__media { aspect-ratio: 16 / 9; }
.promo__price {
  position: absolute;
  right: 16px;
  bottom: 16px;
  z-index: 1;
  background: var(--lime);
  color: var(--on-lime);
  font-size: clamp(26px, 3vw, 36px);
  padding: 10px 16px 8px;
  border-radius: var(--r-md);
}
.promo__copy { display: grid; gap: 16px; justify-items: start; }
.promo h2 { font-size: clamp(48px, 6.4vw, 92px); line-height: 0.86; }
.promo p { font-size: 18px; color: var(--ink-muted); max-width: 36ch; }
.promo p b { color: var(--ink); }

.meal { padding-top: clamp(48px, 6vw, 80px); display: grid; gap: 20px; justify-items: start; }
.meal__title { font-size: clamp(30px, 3.6vw, 44px); }
.meal__list { list-style: none; margin: 0; padding: 0; width: 100%; display: grid; gap: 12px; }
@media (min-width: 640px) { .meal__list { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1040px) { .meal__list { grid-template-columns: repeat(4, 1fr); } }
.meal__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  border: 1.5px solid var(--line);
  border-radius: var(--r-md);
}
.meal__item b { display: block; font-size: 16px; }
.meal__item span { font-size: 13px; color: var(--ink-muted); }
.meal__item strong { font-size: 26px; color: var(--accent-text); white-space: nowrap; }
</style>
