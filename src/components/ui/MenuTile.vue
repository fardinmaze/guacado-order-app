<script setup>
import { site } from '@/data/site'
import { money } from '@/utils/format'
import LoopVideo from './LoopVideo.vue'

// Photo card for the menu grid. The whole card links to the item on the menu page
// (stretched link on the name); the Order button sits above it and goes to checkout.
// A tile with a `video` plays it while hovered (in view on touch screens).
defineProps({
  tile: { type: Object, required: true }, // { name, blurb, calories?, from, image, video?, badge?, to }
})
</script>

<template>
  <article class="tile">
    <div class="tile__img">
      <LoopVideo v-if="tile.video" :src="tile.video" :poster="tile.image" mode="hover" hover-closest=".tile" />
      <img v-else :src="tile.image" :alt="tile.name" width="1400" height="1046" loading="lazy" />
      <span v-if="tile.badge" class="tile__badge">{{ tile.badge }}</span>
    </div>
    <div class="tile__body">
      <h3 class="display"><RouterLink :to="tile.to" class="tile__link">{{ tile.name }}</RouterLink></h3>
      <p>{{ tile.blurb }}</p>
      <div class="tile__foot">
        <span class="from">From <b class="display">{{ money(tile.from) }}</b></span>
        <a :href="site.orderUrl" class="tile__order">Order <span class="sr-only">{{ tile.name }}</span></a>
      </div>
      <small v-if="tile.calories">{{ tile.calories }}</small>
    </div>
  </article>
</template>

<style scoped>
.tile {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--surface-raised);
  border-radius: var(--r-lg);
  overflow: hidden;
  border: 1.5px solid var(--line);
  transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
}
.tile:hover { box-shadow: var(--shadow-lift); border-color: transparent; transform: translateY(-3px); }
.tile:hover img, .tile:hover video { transform: scale(1.04); }
.tile__img { position: relative; background: #000; aspect-ratio: 4 / 3; overflow: hidden; }
.tile__img img, .tile__img video { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); }
.tile__badge {
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
.tile__body { display: grid; gap: 8px; padding: 18px 20px 20px; flex: 1; align-content: start; }
h3 { font-size: clamp(28px, 2.6vw, 34px); }
.tile__link { text-decoration: none; }
.tile__link::after { content: ''; position: absolute; inset: 0; border-radius: inherit; }
p { font-size: 15px; color: var(--ink-muted); }
.tile__foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 8px; }
.from { font-size: 13px; font-weight: 700; color: var(--ink-muted); text-transform: uppercase; letter-spacing: 0.06em; }
.from b { display: block; font-size: 30px; line-height: 1; color: var(--ink); letter-spacing: 0; }
.tile__order {
  position: relative;
  z-index: 1;
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
.tile__order:hover { background: var(--guac-dark); }
small { font-size: 12.5px; color: var(--ink-muted); }
</style>
