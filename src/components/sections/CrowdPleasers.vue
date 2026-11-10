<script setup>
import menu from '@/data/menu.json'
import { links, occasions, site } from '@/data/site'
import { fromPrices } from '@/data/catalog'
import { money } from '@/utils/format'
import { tacos as tacosImg } from '@/assets/illustrations'
import SectionHead from '@/components/ui/SectionHead.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

// Group orders carry the biggest tickets, so they get their own band (Chipotle "Crowd pleasers").
const kits = menu.familyKits
</script>

<template>
  <section class="band">
    <div class="wrap">
      <SectionHead eyebrow="Feeding a group?" title="Crowd pleasers" />

      <div class="duo">
        <article id="kits" class="card card--kits">
          <div class="card__top">
            <span class="eyebrow">Family Kits · {{ kits.serves }}</span>
            <h3 class="display">Dinner for the whole table</h3>
            <p>Two proteins, tortillas or chips and all the fixings, packed to go.</p>
          </div>
          <ul class="kits">
            <li v-for="k in kits.items" :key="k.name">
              <span>{{ k.name }}</span>
              <b class="display">{{ money(k.price) }}</b>
            </li>
          </ul>
          <div class="card__actions">
            <BaseButton :href="site.orderUrl" size="lg">Order a kit</BaseButton>
            <BaseButton to="/menu#family-kits" variant="outline" size="lg">What's inside</BaseButton>
          </div>
          <img class="card__art" :src="tacosImg" alt="" width="420" height="275" loading="lazy" />
        </article>

        <article id="catering" class="card card--cater">
          <div class="card__top">
            <span class="eyebrow">Catering</span>
            <h3 class="display">Let us cater your next event</h3>
            <p>Every event is built around your tastes and your guest list. Tell us the date and headcount and we'll plan the spread.</p>
          </div>
          <ul class="occ" aria-label="Occasions we cater">
            <li v-for="o in occasions" :key="o">{{ o }}</li>
          </ul>
          <div class="card__actions">
            <BaseButton :href="links.cateringPackages" variant="lime" size="lg">Catering packages</BaseButton>
            <BaseButton :href="`mailto:${site.email}?subject=Catering%20enquiry`" variant="light" size="lg">Email us</BaseButton>
          </div>
          <p class="fine">Family kits start at {{ money(fromPrices.kits) }} and are a quick way to feed a small group.</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.duo { display: grid; gap: 18px; }
@media (min-width: 900px) { .duo { grid-template-columns: 1fr 1fr; } }
.card {
  position: relative;
  overflow: hidden;
  border-radius: var(--r-lg);
  padding: clamp(24px, 3.4vw, 40px);
  display: flex;
  flex-direction: column;
  gap: 22px;
  min-width: 0;
}
.card__top { display: grid; gap: 10px; position: relative; z-index: 1; }
.card h3 { font-size: clamp(34px, 3.8vw, 52px); max-width: 12ch; }
.card p { max-width: 44ch; }
.card__actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: auto; position: relative; z-index: 1; }

.card--kits { background: var(--surface); }
.card--kits p { color: var(--ink-muted); }
.card__art { position: absolute; right: -36px; top: 18px; width: 210px; height: auto; opacity: 0.95; pointer-events: none; }
@media (max-width: 599px) { .card__art { display: none; } }
.kits { list-style: none; margin: 0; padding: 0; display: grid; position: relative; z-index: 1; }
.kits li { display: flex; justify-content: space-between; align-items: baseline; padding: 12px 0; border-bottom: 1px solid var(--line); font-weight: 700; font-size: 17px; }
.kits b { font-size: 28px; color: var(--accent-text); }

.card--cater { background: var(--guac); color: var(--on-green); }
.card--cater .eyebrow { color: var(--lime); }
.card--cater p { opacity: 0.92; }
.card--cater .fine { color: inherit; opacity: 0.8; }
.occ { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
.occ li { font-weight: 700; font-size: 14px; padding: 8px 14px; border-radius: var(--r-pill); background: rgba(255, 255, 255, 0.12); }
</style>
