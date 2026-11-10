<script setup>
import { site } from '@/data/site'
import { money } from '@/utils/format'
import { optionLabel } from '@/data/catalog'

// One orderable item on the menu page. `prices` = [{ label, price }] (label may be '').
defineProps({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  calories: { type: String, default: '' },
  prices: { type: Array, required: true },
  image: { type: String, default: '' },
  imageFit: { type: String, default: 'cover' }, // cover (photo) | contain (illustration)
  includes: { type: Array, default: () => [] },
  badge: { type: String, default: '' },
})
</script>

<template>
  <article class="item">
    <div v-if="image" class="item__img" :class="`is-${imageFit}`">
      <img :src="image" alt="" loading="lazy" />
      <span v-if="badge" class="item__badge">{{ badge }}</span>
    </div>
    <div class="item__body">
      <h3 class="display">{{ name }}</h3>
      <p v-if="description">{{ description }}</p>
      <ul v-if="includes.length" class="item__incl" aria-label="Includes">
        <li v-for="i in includes" :key="i">{{ i }}</li>
      </ul>
      <small v-if="calories">{{ calories }}</small>
      <div class="item__foot">
        <ul class="item__prices">
          <li v-for="p in prices" :key="p.label + p.price">
            <span v-if="p.label">{{ optionLabel(p.label) }}</span>
            <b class="display">{{ money(p.price) }}</b>
          </li>
        </ul>
        <a :href="site.orderUrl" class="item__order">Order <span class="sr-only">{{ name }}</span></a>
      </div>
    </div>
  </article>
</template>

<style scoped>
.item {
  display: flex;
  flex-direction: column;
  background: var(--surface-raised);
  border-radius: var(--r-lg);
  overflow: hidden;
  box-shadow: var(--shadow-card);
}
.item__img { position: relative; aspect-ratio: 4 / 3; background: #000; }
.item__img img { width: 100%; height: 100%; object-fit: cover; }
.item__img.is-contain { background: var(--surface); display: grid; place-items: center; }
.item__img.is-contain img { width: 70%; height: 80%; object-fit: contain; }
.item__badge {
  position: absolute;
  top: 14px;
  left: 14px;
  background: var(--lime);
  color: var(--on-lime);
  font: 800 12.5px/1 var(--f-display);
  font-stretch: 80%;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 7px 10px;
  border-radius: var(--r-sm);
}
.item__body { display: grid; gap: 8px; padding: 18px 20px 20px; flex: 1; align-content: start; }
h3 { font-size: clamp(26px, 2.4vw, 32px); }
p { font-size: 15px; color: var(--ink-muted); }
small { font-size: 12.5px; color: var(--ink-muted); }
.item__incl { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
.item__incl li { font-size: 12.5px; font-weight: 600; padding: 4px 10px; border-radius: var(--r-pill); background: var(--surface); }
.item__foot { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; margin-top: auto; padding-top: 10px; }
.item__prices { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 4px 16px; }
.item__prices li { display: grid; }
.item__prices span { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-muted); }
.item__prices b { font-size: 26px; line-height: 1; }
.item__order {
  flex: none;
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
  text-decoration: none;
}
.item__order:hover { background: var(--guac-dark); }
</style>
