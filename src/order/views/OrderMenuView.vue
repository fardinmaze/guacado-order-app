<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { site } from '@/data/site'
import { tacos, birria, tostada, guac } from '@/assets/illustrations'
import { calLabel, categories, categoryFrom, isQuickAdd } from '@/order/lib/catalog'
import { cents, fromCents } from '@/order/lib/pricing'
import { useOrder } from '@/order/useOrder'
import { useBagSheet } from '@/order/useBagSheet'
import { useToast } from '@/composables/useToast'
import StickyBar from '@/order/components/StickyBar.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

// MENU-01: build-your-own hero, a card per category with "From $X", then every item with its price.
const props = defineProps({ store: { type: String, required: true } })
const router = useRouter()
const order = useOrder()
const { show: showBag } = useBagSheet()
const toast = useToast()

const art = { 'build-your-own': guac, tacos, specials: tostada, kids: tacos, sides: guac, dips: guac, beverages: tostada, desserts: birria, 'family-kits': birria }
const byo = categories[0].items[0]
const from = computed(() => cents(fromCents(byo)))
const base = (slug) => `/order/${props.store}${slug}`

function quick(item) {
  order.quickAdd(item.slug)
  toast.show(`${item.name} added`)
}
function jump(slug) {
  document.getElementById(`cat-${slug}`)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
}
</script>

<template>
  <div>
    <RouterLink class="hero" :to="base('/build')">
      <img :src="guac" alt="" width="120" height="120" />
      <span class="hero__txt">
        <span class="eyebrow">Our signature</span>
        <span class="hero__t">Build your own!</span>
        <span class="hero__s">Base, protein, toppings, sauce · from {{ from }}</span>
      </span>
      <span class="hero__go" aria-hidden="true">→</span>
    </RouterLink>

    <nav class="cats" aria-label="Menu categories">
      <h2 class="sr-only">Categories</h2>
      <a v-for="c in categories" :key="c.slug" :href="`#cat-${c.slug}`" class="cat" @click.prevent="jump(c.slug)">
        <img :src="art[c.slug]" alt="" width="56" height="56" loading="lazy" />
        <span class="cat__n">{{ c.name }}</span>
        <span class="cat__f">From {{ cents(categoryFrom(c)) }}</span>
      </a>
    </nav>

    <section v-for="c in categories" :id="`cat-${c.slug}`" :key="c.slug" class="sec" :aria-labelledby="`h-${c.slug}`">
      <h2 :id="`h-${c.slug}`" class="sec__h">{{ c.name }}</h2>
      <ul class="items">
        <li v-for="i in c.items" :key="i.slug" class="item">
          <component :is="isQuickAdd(i) ? 'div' : 'RouterLink'" class="item__main" v-bind="isQuickAdd(i) ? {} : { to: base(i.kind === 'BUILDER' ? '/build' : `/item/${i.slug}`) }">
            <span class="item__name">{{ i.name }}</span>
            <span v-if="i.description" class="item__d">{{ i.description }}</span>
            <span v-else-if="i.includes" class="item__d">{{ i.includes.join(' · ') }}</span>
            <span class="item__meta">
              <span class="item__p">{{ isQuickAdd(i) ? '' : 'From ' }}{{ cents(fromCents(i)) }}</span>
              <span v-if="calLabel(i)" class="item__c">{{ calLabel(i) }}</span>
            </span>
          </component>
          <button v-if="isQuickAdd(i)" type="button" class="add" :aria-label="`Add ${i.name} to bag`" @click="quick(i)">+</button>
          <RouterLink v-else class="add add--go" :to="base(i.kind === 'BUILDER' ? '/build' : `/item/${i.slug}`)" :aria-label="`Choose options for ${i.name}`">→</RouterLink>
        </li>
      </ul>
    </section>

    <a class="deliver" :href="site.orderUrl" target="_blank" rel="noopener">
      Want it delivered? Order on DoorDash <span aria-hidden="true">→</span><span class="sr-only"> (opens in a new tab)</span>
    </a>

    <StickyBar v-if="order.count.value" :total="cents(order.subtotal.value)" :caption="`${order.count.value} in your bag`">
      <BaseButton variant="lime" @click="showBag">VIEW BAG</BaseButton>
    </StickyBar>
  </div>
</template>

<style scoped>
.hero { display: flex; align-items: center; gap: 14px; padding: 18px; border-radius: var(--r-lg); background: var(--guac); color: var(--on-green); text-decoration: none; box-shadow: var(--shadow-card); }
.hero img { flex: none; width: 84px; height: 84px; object-fit: contain; }
.hero__txt { flex: 1; display: grid; gap: 2px; min-width: 0; }
.hero .eyebrow { color: var(--lime); font-size: 14px; }
.hero__t { font: 400 clamp(26px, 7.5vw, 34px)/1 var(--f-display); text-transform: uppercase; }
.hero__s { font-size: 14px; opacity: 0.9; }
.hero__go { flex: none; width: 48px; height: 48px; border-radius: 50%; background: var(--lime); color: var(--on-lime); display: grid; place-items: center; font-size: 24px; font-weight: 800; }

.cats { margin: 22px calc(var(--gut-r) * -1) 0 calc(var(--gut-l) * -1); padding: 4px var(--gut-r) 8px var(--gut-l); display: grid; grid-auto-flow: column; grid-auto-columns: 112px; gap: 10px; overflow-x: auto; scroll-snap-type: x proximity; scrollbar-width: none; }
.cats::-webkit-scrollbar { display: none; }
.cat { scroll-snap-align: start; display: grid; justify-items: center; gap: 2px; padding: 12px 8px; text-align: center; text-decoration: none; border-radius: var(--r-md); background: var(--surface); border: 1.5px solid var(--line); min-height: 44px; }
.cat img { width: 56px; height: 56px; object-fit: contain; }
.cat__n { font-weight: 800; font-size: 14px; line-height: 1.15; }
.cat__f { font: 400 16px/1 var(--f-cond); letter-spacing: 1px; color: var(--lime); }

.sec { margin-top: 32px; scroll-margin-top: 80px; }
.sec__h { font: 400 26px/1 var(--f-display); text-transform: uppercase; margin-bottom: 12px; }
.items { list-style: none; margin: 0; padding: 0; border-radius: var(--r-md); border: 1.5px solid var(--line); background: var(--surface); overflow: hidden; }
.item { display: flex; align-items: stretch; border-top: 1px solid var(--line); }
.item:first-child { border-top: 0; }
.item__main { flex: 1; min-width: 0; display: grid; gap: 3px; padding: 14px 4px 14px 16px; text-decoration: none; color: inherit; align-content: center; }
.item__name { font-weight: 800; font-size: 17px; }
.item__d { font-size: 14px; color: var(--ink-muted); }
.item__meta { display: flex; gap: 10px; align-items: baseline; }
.item__p { font: 400 20px/1 var(--f-cond); letter-spacing: 1px; color: var(--lime); }
.item__c { font-size: 13px; color: var(--ink-muted); }
.add { flex: none; align-self: center; margin: 8px 12px 8px 4px; width: 48px; height: 48px; border-radius: 50%; border: 0; background: var(--lime); color: var(--on-lime); font: 800 26px/1 var(--f-body); cursor: pointer; display: grid; place-items: center; text-decoration: none; }
.add:active { transform: scale(0.94); }
.add--go { background: transparent; border: 1.5px solid var(--line); color: var(--ink); font-size: 22px; }

.deliver { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 32px; min-height: 52px; padding: 12px 20px; border-radius: var(--r-pill); border: 1.5px solid var(--line); color: var(--ink); font-weight: 800; text-decoration: none; }
</style>
