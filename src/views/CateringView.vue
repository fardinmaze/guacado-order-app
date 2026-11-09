<script setup>
import menu from '@/data/menu.json'
import { links, occasions, site } from '@/data/site'
import BaseButton from '@/components/ui/BaseButton.vue'
import MenuItemCard from '@/components/ui/MenuItemCard.vue'

const kits = menu.familyKits
</script>

<template>
  <section id="catering" class="cater">
    <div class="wrap cater__in">
      <div class="cater__copy">
        <span class="eyebrow">Catering</span>
        <h1 class="display">Let us cater your next event</h1>
        <p>
          Every event is built around your tastes and your guest list, from a birthday at home to a company lunch.
          Tell us the date and headcount and we'll plan the spread.
        </p>
        <div class="cater__actions">
          <BaseButton :href="links.cateringPackages" variant="lime" size="lg">Catering packages</BaseButton>
          <BaseButton :href="`mailto:${site.email}?subject=Catering%20enquiry`" variant="light" size="lg">Email us</BaseButton>
        </div>
      </div>
      <ul class="occ" aria-label="Occasions we cater">
        <li v-for="o in occasions" :key="o">{{ o }}</li>
      </ul>
    </div>
  </section>

  <section id="kits" class="band band--alt">
    <div class="wrap">
      <span class="eyebrow">Smaller group? Order a kit today</span>
      <h2 class="display sec">Family Kits <small>{{ kits.serves }}</small></h2>
      <div class="grid">
        <MenuItemCard
          v-for="k in kits.items"
          :key="k.name"
          :name="k.name"
          :calories="k.calories"
          :prices="[{ label: '', price: k.price }]"
          :includes="k.includes"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.cater { background: var(--guac); color: var(--on-green); padding-block: clamp(48px, 7vw, 96px); }
.cater__in { display: grid; gap: 32px; align-items: center; }
@media (min-width: 900px) { .cater__in { grid-template-columns: 1.3fr 0.7fr; } }
.cater__copy { display: grid; gap: 18px; justify-items: start; }
.cater .eyebrow { color: var(--lime); }
h1 { font-size: clamp(48px, 7vw, 96px); }
.cater p { max-width: 52ch; font-size: 18px; opacity: 0.92; }
.cater__actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 6px; }
.occ { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
.occ li { font: 900 clamp(20px, 2.2vw, 26px)/1 var(--f-display); font-stretch: 72%; text-transform: uppercase; padding: 12px 16px; border-radius: var(--r-pill); background: rgba(255, 255, 255, 0.12); }
.sec { font-size: clamp(34px, 4.4vw, 54px); margin: 8px 0 24px; display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 16px; }
.sec small { font: 700 15px/1.2 var(--f-body); text-transform: none; color: var(--ink-muted); }
.grid { display: grid; gap: 18px; }
@media (min-width: 900px) { .grid { grid-template-columns: repeat(3, 1fr); } }
</style>
