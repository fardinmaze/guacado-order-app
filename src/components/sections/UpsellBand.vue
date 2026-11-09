<script setup>
import { site } from '@/data/site'
import { addOns, photos } from '@/data/catalog'
import { money } from '@/utils/format'
import { GUAC_PRICE } from '@/utils/pricing'
import BaseButton from '@/components/ui/BaseButton.vue'
</script>

<template>
  <section class="upsell" aria-labelledby="guac-title">
    <!-- Feature promo: guac is the one paid add-on that fits every entrée. -->
    <div class="promo">
      <div class="wrap promo__in">
        <div class="promo__art">
          <img :src="photos.bowl" alt="A burrito bowl topped with a scoop of fresh guacamole" width="1280" height="720" loading="lazy" />
        </div>
        <div class="promo__copy">
          <span class="eyebrow">Add-on</span>
          <h2 id="guac-title" class="display">Fresh guac<br />on anything</h2>
          <p>Bowl, burrito, nachos or tacos. Make it better for <b>+{{ money(GUAC_PRICE) }}</b>.</p>
          <BaseButton :href="site.orderUrl" variant="lime" size="lg">Order now</BaseButton>
        </div>
      </div>
    </div>

    <div class="wrap meal">
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
  </section>
</template>

<style scoped>
.promo { background: #000; color: var(--on-night); }
.promo__in { display: grid; gap: 12px; padding-bottom: clamp(36px, 5vw, 56px); }
@media (min-width: 900px) { .promo__in { grid-template-columns: 1.15fr 1fr; align-items: center; gap: 40px; padding-block: 24px; } }
.promo__art { margin-inline: calc(var(--gut-l) * -1) calc(var(--gut-r) * -1); }
.promo__art img { width: 100%; height: auto; -webkit-mask-image: radial-gradient(ellipse 56% 58% at 50% 50%, #000 66%, transparent 100%);
  mask-image: radial-gradient(ellipse 56% 58% at 50% 50%, #000 66%, transparent 100%); }
@media (min-width: 900px) { .promo__art { margin: 0 0 0 -40px; } }
.promo__copy { display: grid; gap: 16px; justify-items: start; }
.promo .eyebrow { color: var(--lime); }
.promo h2 { font-size: clamp(48px, 7vw, 96px); line-height: 0.86; }
.promo p { font-size: 18px; color: var(--on-night-muted); max-width: 36ch; }
.promo p b { color: var(--lime); }

.meal { padding-block: clamp(40px, 5vw, 64px) 0; display: grid; gap: 20px; justify-items: start; }
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
