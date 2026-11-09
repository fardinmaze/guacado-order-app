<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useBuilder } from '@/composables/useBuilder'
import { useOrderBar } from '@/composables/useOrderBar'
import { price } from '@/utils/format'
import { EXTRA_PROTEIN_PRICE, GUAC_PRICE } from '@/utils/pricing'
import { guac as guacImg } from '@/assets/illustrations'
import menu from '@/data/menu.json'
import SectionHead from '@/components/ui/SectionHead.vue'
import OptionChip from '@/components/ui/OptionChip.vue'
import HeatIcons from '@/components/ui/HeatIcons.vue'
import BuilderStep from '@/components/builder/BuilderStep.vue'
import ExtraToggle from '@/components/builder/ExtraToggle.vue'
import OrderTicket from '@/components/builder/OrderTicket.vue'

const b = useBuilder()
const { state, options } = b
const root = ref(null)
const bar = useOrderBar()

const cheapest = Math.min(...options.proteins.map((p) => p.price))

// While the builder is on screen, the mobile order bar shows this order and its total.
const inView = ref(false)
const publish = () => {
  if (inView.value) bar.set({ label: `${state.base} · ${state.protein}`, total: b.total.value })
}
watch([b.total, () => state.base, () => state.protein], publish)

let io
onMounted(() => {
  if (typeof IntersectionObserver !== 'function') return
  io = new IntersectionObserver(([e]) => {
    inView.value = e.isIntersecting
    if (inView.value) publish()
    else bar.clear()
  }, { rootMargin: '-30% 0px -30% 0px' })
  io.observe(root.value)
})
onBeforeUnmount(() => {
  io?.disconnect()
  bar.clear()
})
</script>

<template>
  <section id="build" ref="root" class="band band--alt">
    <div class="wrap">
      <SectionHead
        :eyebrow="`Build your own · From $${cheapest.toFixed(2)}`"
        title="Make it exactly how you like it"
        lead="Four quick picks. Your protein sets the price; base, toppings and sauce are on us."
      />

      <div class="byo">
        <div class="steps">
          <BuilderStep :number="1" title="Choose your base" :note="menu.buildYourOwn.calories" :active="state.step === 1">
            <div class="chips" role="group" aria-label="Base">
              <OptionChip v-for="v in options.bases" :key="v" :pressed="state.base === v" @click="b.setBase(v)">{{ v }}</OptionChip>
            </div>
          </BuilderStep>

          <BuilderStep :number="2" title="Choose your protein" note="Sets your price" :active="state.step === 2">
            <div class="chips" role="group" aria-label="Protein">
              <OptionChip v-for="p in options.proteins" :key="p.name" :pressed="state.protein === p.name" @click="b.setProtein(p.name)">
                {{ p.name }} <small>{{ price(p.price) }}</small>
              </OptionChip>
            </div>
          </BuilderStep>

          <BuilderStep :number="3" title="Choose your toppings" :note="menu.buildYourOwn.toppingsNote" :active="state.step === 3">
            <div class="chips" role="group" aria-label="Toppings">
              <OptionChip v-for="t in options.toppings" :key="t" :pressed="state.toppings.includes(t)" @click="b.toggleTopping(t)">{{ t }}</OptionChip>
            </div>
            <div class="extras">
              <ExtraToggle label="Add fresh guac" :price="GUAC_PRICE" :pressed="state.guac" @click="b.toggleGuac()">
                <img :src="guacImg" alt="" width="44" height="44" />
              </ExtraToggle>
              <ExtraToggle label="Extra protein" :price="EXTRA_PROTEIN_PRICE" :pressed="state.extraProtein" @click="b.toggleExtraProtein()">
                <span class="x2" aria-hidden="true">2X</span>
              </ExtraToggle>
            </div>
          </BuilderStep>

          <BuilderStep :number="4" title="Choose a homemade sauce" note="Chili icons show heat" :active="state.step === 4">
            <div class="chips" role="group" aria-label="Sauce">
              <OptionChip v-for="s in options.sauces" :key="s.name" :pressed="state.sauce === s.label" @click="b.setSauce(s.label)">
                {{ s.label }} <HeatIcons :level="s.heat" />
              </OptionChip>
            </div>
          </BuilderStep>
        </div>

        <OrderTicket :summary="b.summary.value" :total="b.total.value" :progress="b.progress.value" @reset="b.reset()" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.byo { display: grid; gap: 20px; }
@media (min-width: 960px) { .byo { grid-template-columns: minmax(0, 1fr) 360px; gap: 32px; align-items: start; } }
.steps { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.extras { display: grid; gap: 10px; }
@media (min-width: 620px) { .extras { grid-template-columns: 1fr 1fr; } }
.x2 {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--chili);
  display: grid;
  place-items: center;
  font: 900 20px/1 var(--f-display);
  color: #fff;
  flex: none;
}
</style>
