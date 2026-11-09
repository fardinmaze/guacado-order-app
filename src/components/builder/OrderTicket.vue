<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { money } from '@/utils/format'
import { site } from '@/data/site'
import { gsap, prefersReducedMotion } from '@/composables/useMotion'
import BaseButton from '@/components/ui/BaseButton.vue'

// Sticky green ticket: progress bar, summary rows and a live total that tweens.
const props = defineProps({
  summary: { type: Object, required: true }, // { base, protein, toppings, sauce }
  total: { type: Number, required: true },
  progress: { type: Number, required: true }, // 25..100
})

const shown = ref(props.total)
const totalEl = ref(null)
let tween

watch(
  () => props.total,
  (to, from) => {
    tween?.kill()
    if (prefersReducedMotion()) return (shown.value = to)
    const o = { v: from }
    tween = gsap.to(o, { v: to, duration: 0.5, ease: 'power2.out', onUpdate: () => (shown.value = o.v) })
    gsap.fromTo(totalEl.value, { scale: 1.12 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' })
  },
)

// Screen readers hear one settled message, not 30 tween frames.
const announcement = computed(
  () => `Your order: ${props.summary.base}, ${props.summary.protein}, ${props.summary.toppings}, ${props.summary.sauce}. Total ${money(props.total)}.`,
)

onBeforeUnmount(() => tween?.kill())
</script>

<template>
  <aside class="ticket" aria-label="Your order">
    <div class="ticket__bar" aria-hidden="true"><i :style="{ width: progress + '%' }" /></div>
    <h3>YOUR ORDER</h3>
    <dl>
      <div><dt>BASE</dt><dd>{{ summary.base }}</dd></div>
      <div><dt>PROTEIN</dt><dd>{{ summary.protein }}</dd></div>
      <div><dt>TOPPINGS</dt><dd>{{ summary.toppings }}</dd></div>
      <div><dt>SAUCE</dt><dd>{{ summary.sauce }}</dd></div>
    </dl>
    <div class="ticket__total" aria-hidden="true">
      <span>TOTAL</span><strong ref="totalEl">{{ money(shown) }}</strong>
    </div>
    <BaseButton variant="lime" :href="site.orderUrl">ORDER THIS ONLINE</BaseButton>
    <small>Menu-board prices before tax. Final price and availability are set by your location at checkout.</small>
    <p class="sr-only" aria-live="polite">{{ announcement }}</p>
  </aside>
</template>

<style scoped>
.ticket {
  position: sticky;
  top: calc(96px + env(safe-area-inset-top, 0px));
  background: var(--guac);
  color: var(--on-green);
  border-radius: var(--r-lg);
  padding: 28px;
  box-shadow: inset 0 0 0 4px var(--lime), var(--shadow-card);
  display: grid;
  gap: 18px;
}
.ticket__bar { height: 6px; border-radius: 3px; background: rgba(246, 241, 231, 0.18); overflow: hidden; }
.ticket__bar i { display: block; height: 100%; background: var(--lime); border-radius: 3px; transition: width 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
h3 { font-family: var(--f-cond); font-size: 44px; line-height: 0.9; }
dl { margin: 0; display: grid; gap: 10px; }
dl div { display: grid; grid-template-columns: 96px 1fr; gap: 8px; font-size: 15px; padding-bottom: 10px; border-bottom: 1px dashed rgba(246, 241, 231, 0.25); }
dt { font-family: var(--f-cond); letter-spacing: 2px; font-size: 15px; opacity: 0.85; padding-top: 2px; }
dd { margin: 0; font-weight: 600; min-width: 0; }
.ticket__total { display: flex; justify-content: space-between; align-items: baseline; }
.ticket__total span { font-family: var(--f-cond); letter-spacing: 2px; font-size: 18px; }
.ticket__total strong { font-family: var(--f-cond); font-weight: 400; font-size: 56px; line-height: 1; color: var(--lime); font-variant-numeric: tabular-nums; }
small { font-size: 12.5px; opacity: 0.8; line-height: 1.45; }
</style>
