<script setup>
import menu from '@/data/menu.json'
import { advisory, site } from '@/data/site'
import { menuSections, photos } from '@/data/catalog'
import { tostada as tostadaImg } from '@/assets/illustrations'
import MenuTabs from '@/components/ui/MenuTabs.vue'
import MenuItemCard from '@/components/ui/MenuItemCard.vue'
import MenuRow from '@/components/ui/MenuRow.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BuildYourOwn from '@/components/sections/BuildYourOwn.vue'

// Order-menu page: every item with its price and an Order button, grouped under sticky tabs.
const featured = Object.fromEntries(menu.featured.map((f) => [f.name, f]))
const asPrices = (item) => item.prices ?? [{ label: '', price: item.price }]
const shake = (b) => b.flavors ?? []

const signature = [
  { ...featured['Birria Tacos'], description: `${featured['Birria Tacos'].options}. Slow-braised and griddled, served for dipping.`, image: photos.birria, badge: 'Signature' },
  { ...featured.Tacos, description: featured.Tacos.options, image: photos.tacos },
  { ...featured.Tostada, image: tostadaImg, imageFit: 'contain', badge: featured.Tostada.section },
]
</script>

<template>
  <div class="page-head">
    <div class="wrap">
      <span class="eyebrow">Order for pickup</span>
      <h1 class="display">Menu</h1>
      <p class="lead">Prices are from our menu board. Tap Order to check out online with your nearest location.</p>
    </div>
  </div>

  <MenuTabs :sections="menuSections" />

  <section id="signature" class="band">
    <div class="wrap">
      <h2 class="display sec">Signature</h2>
      <div class="grid">
        <MenuItemCard
          v-for="i in signature"
          :key="i.name"
          :name="i.name"
          :description="i.description"
          :calories="i.calories"
          :prices="asPrices(i)"
          :image="i.image"
          :image-fit="i.imageFit"
          :badge="i.badge"
        />
      </div>
    </div>
  </section>

  <BuildYourOwn />

  <section id="family-kits" class="band">
    <div class="wrap">
      <h2 class="display sec">Family Kits <small>{{ menu.familyKits.serves }}</small></h2>
      <div class="grid">
        <MenuItemCard
          v-for="k in menu.familyKits.items"
          :key="k.name"
          :name="k.name"
          :calories="k.calories"
          :prices="asPrices(k)"
          :includes="k.includes"
        />
      </div>
    </div>
  </section>

  <section id="kids" class="band band--alt">
    <div class="wrap">
      <h2 class="display sec">Kids Meal <small>{{ menu.kidsMeal.note }}</small></h2>
      <div class="grid">
        <MenuItemCard
          v-for="k in menu.kidsMeal.items"
          :key="k.name"
          :name="k.name"
          :description="k.description"
          :calories="k.calories"
          :prices="asPrices(k)"
        />
      </div>
    </div>
  </section>

  <section id="sides" class="band">
    <div class="wrap">
      <h2 class="display sec">Sides & Dips</h2>
      <div class="board">
        <div class="board__col">
          <MenuRow v-for="s in menu.sides" :key="s.name" :name="s.name" :calories="s.calories" :prices="[s.price]" />
        </div>
        <div class="board__col">
          <div class="sizes" aria-hidden="true"><span>{{ menu.dips.sizes[0] }}</span><span>|</span><span>{{ menu.dips.sizes[1] }}</span></div>
          <MenuRow v-for="d in menu.dips.items" :key="d.name" :name="d.name" :calories="d.calories" :prices="d.prices" />
        </div>
      </div>
      <BaseButton :href="site.orderUrl" class="board__cta">Add sides to your order</BaseButton>
    </div>
  </section>

  <section id="drinks" class="band band--alt">
    <div class="wrap">
      <h2 class="display sec">Drinks & Desserts</h2>
      <div class="board">
        <div class="board__col">
          <h3 class="board__h">Beverages</h3>
          <MenuRow v-for="b in menu.beverages" :key="b.name" :name="b.name" :prices="[b.price]" :flavors="shake(b)" />
        </div>
        <div class="board__col">
          <h3 class="board__h">Desserts</h3>
          <MenuRow v-for="d in menu.desserts" :key="d.name" :name="d.name" :prices="[d.price]" />
        </div>
      </div>
      <BaseButton :href="site.orderUrl" class="board__cta">Add to your order</BaseButton>
      <p class="advisory">{{ advisory }}</p>
    </div>
  </section>
</template>

<style scoped>
.page-head { padding-block: clamp(32px, 5vw, 56px) 20px; }
.page-head .wrap { display: grid; gap: 10px; }
.page-head h1 { font-size: clamp(56px, 9vw, 112px); }
.band { scroll-margin-top: calc(var(--header-h) + 56px); }
.sec { font-size: clamp(34px, 4.4vw, 54px); margin-bottom: 24px; display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 16px; }
.sec small { font: 700 15px/1.2 var(--f-body); text-transform: none; color: var(--ink-muted); }
.grid { display: grid; gap: 18px; }
@media (min-width: 700px) { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1040px) { .grid { grid-template-columns: repeat(3, 1fr); } }
.board { display: grid; gap: 8px 56px; }
@media (min-width: 860px) { .board { grid-template-columns: 1fr 1fr; } }
.board__col { min-width: 0; }
.board__h { font: 800 14px/1 var(--f-display); font-stretch: 80%; text-transform: uppercase; letter-spacing: 0.12em; color: var(--accent-text); padding: 16px 0 4px; }
.board__cta { margin-top: 28px; }
.sizes { display: flex; justify-content: flex-end; gap: 12px; font: 800 13px/1 var(--f-display); letter-spacing: 0.1em; color: var(--ink-muted); padding: 16px 0 4px; text-transform: uppercase; }
.advisory { margin-top: 48px; font-size: 13px; color: var(--ink-muted); max-width: 90ch; line-height: 1.6; border-top: 1px solid var(--line); padding-top: 20px; }
</style>
