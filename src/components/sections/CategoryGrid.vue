<script setup>
import { featuredTiles, moreTiles } from '@/data/catalog'
import { money } from '@/utils/format'
import SectionHead from '@/components/ui/SectionHead.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import MenuTile from '@/components/ui/MenuTile.vue'
</script>

<template>
  <section id="menu" class="band">
    <div class="wrap">
      <SectionHead eyebrow="Our menu" title="What are you craving?">
        <BaseButton to="/menu" variant="outline">See full menu</BaseButton>
      </SectionHead>

      <div class="feature">
        <MenuTile v-for="t in featuredTiles" :key="t.id" :tile="t" />
      </div>

      <ul class="more">
        <li v-for="t in moreTiles" :key="t.id">
          <RouterLink :to="t.to" class="more__card">
            <span class="more__name">{{ t.name }}</span>
            <span class="more__blurb">{{ t.blurb }}</span>
            <span class="more__price">From <b>{{ money(t.from) }}</b></span>
            <span class="more__go" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6" /></svg>
            </span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.feature { display: grid; gap: 18px; }
@media (min-width: 700px) { .feature { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1040px) { .feature { grid-template-columns: repeat(3, 1fr); } }

.more { list-style: none; margin: 18px 0 0; padding: 0; display: grid; gap: 12px; }
@media (min-width: 640px) { .more { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1040px) { .more { grid-template-columns: repeat(3, 1fr); } }
.more__card {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas: 'name go' 'blurb go' 'price go';
  gap: 4px 16px;
  align-items: center;
  height: 100%;
  padding: 18px 18px 18px 20px;
  border-radius: var(--r-md);
  background: var(--surface);
  text-decoration: none;
  transition: background 0.15s, box-shadow 0.15s;
}
.more__card:hover { background: #efe7d6; }
.more__card:hover .more__go { background: var(--guac); color: var(--on-green); }
.more__name { grid-area: name; font: 900 24px/1 var(--f-display); font-stretch: 72%; text-transform: uppercase; }
.more__blurb { grid-area: blurb; font-size: 14px; color: var(--ink-muted); }
.more__price { grid-area: price; font-size: 13px; font-weight: 700; color: var(--ink-muted); margin-top: 4px; }
.more__price b { color: var(--accent-text); font-size: 15px; }
.more__go {
  grid-area: go;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--surface-raised);
  color: var(--ink);
  transition: background 0.15s, color 0.15s;
}
.more__go svg { width: 18px; height: 18px; }
</style>
