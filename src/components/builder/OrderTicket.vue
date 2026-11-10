<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { money } from '@/utils/format'
import { site } from '@/data/site'
import { gsap, prefersReducedMotion } from '@/composables/useMotion'
import { useCopyToClipboard } from '@/composables/useCopyToClipboard'
import BaseButton from '@/components/ui/BaseButton.vue'

// Sticky order summary: progress bar, rows, a live total that tweens, and checkout.
const props = defineProps({
  summary: { type: Object, required: true }, // { base, protein, toppings, sauce }
  total: { type: Number, required: true },
  progress: { type: Number, required: true }, // 25..100
})
defineEmits(['reset'])

const shown = ref(props.total)
const totalEl = ref(null)
let tween

watch(
  () => props.total,
  (to, from) => {
    tween?.kill()
    if (prefersReducedMotion()) return (shown.value = to)
    const o = { v: from }
    tween = gsap.to(o, { v: to, duration: 0.45, ease: 'power2.out', onUpdate: () => (shown.value = o.v) })
    gsap.fromTo(totalEl.value, { scale: 1.1 }, { scale: 1, duration: 0.35, ease: 'back.out(3)' })
  },
)

const orderText = computed(
  () => `${props.summary.base}: ${props.summary.protein}; toppings: ${props.summary.toppings}; sauce: ${props.summary.sauce}. ${money(props.total)}`,
)
// Screen readers hear one settled message, not 30 tween frames.
const announcement = computed(() => `Your order: ${orderText.value}.`)

// The online ordering site cannot receive a pre-built order, so let guests copy it.
const { copy } = useCopyToClipboard()
const copyOrder = () => copy(orderText.value, { success: 'Order copied' })

onBeforeUnmount(() => tween?.kill())
</script>

<template>
  <aside class="ticket" aria-label="Your order">
    <slot name="media" />
    <div class="ticket__head">
      <h3 class="display">Your order</h3>
      <button type="button" class="reset" @click="$emit('reset')">Start over</button>
    </div>
    <div class="ticket__bar" aria-hidden="true"><i :style="{ transform: `scaleX(${progress / 100})` }" /></div>
    <dl>
      <div><dt>Base</dt><dd>{{ summary.base }}</dd></div>
      <div><dt>Protein</dt><dd>{{ summary.protein }}</dd></div>
      <div><dt>Toppings</dt><dd>{{ summary.toppings }}</dd></div>
      <div><dt>Sauce</dt><dd>{{ summary.sauce }}</dd></div>
    </dl>
    <div class="ticket__total" aria-hidden="true">
      <span>Total</span><strong ref="totalEl" class="display">{{ money(shown) }}</strong>
    </div>
    <BaseButton :href="site.orderUrl" size="lg" block>Order this online</BaseButton>
    <button type="button" class="copy" @click="copyOrder">Copy my order</button>
    <small>Menu-board prices before tax. Final price and availability are set by your location at checkout.</small>
    <p class="sr-only" aria-live="polite">{{ announcement }}</p>
  </aside>
</template>

<style scoped>
.ticket {
  position: sticky;
  top: calc(var(--header-h) + 16px);
  background: var(--surface-raised);
  border-radius: var(--r-lg);
  padding: 24px;
  box-shadow: var(--shadow-lift);
  display: grid;
  gap: 16px;
}
.ticket__head { display: flex; justify-content: space-between; align-items: center; }
h3 { font-size: 32px; }
.reset { background: none; border: 0; padding: 8px 0; color: var(--ink-muted); font-weight: 600; font-size: 13.5px; text-decoration: underline; cursor: pointer; }
.ticket__bar { height: 6px; border-radius: 3px; background: var(--surface); overflow: hidden; }
.ticket__bar i { display: block; height: 100%; background: var(--guac); border-radius: 3px; transform-origin: left; transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
dl { margin: 0; display: grid; gap: 10px; }
dl div { display: grid; grid-template-columns: 82px 1fr; gap: 8px; font-size: 15px; padding-bottom: 10px; border-bottom: 1px dashed var(--line); }
dt { font-size: 12.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-muted); padding-top: 2px; }
dd { margin: 0; font-weight: 600; min-width: 0; }
.ticket__total { display: flex; justify-content: space-between; align-items: baseline; }
.ticket__total span { font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; }
.ticket__total strong { font-size: 52px; line-height: 1; color: var(--accent-text); font-variant-numeric: tabular-nums; }
.copy {
  min-height: 44px;
  border-radius: var(--r-pill);
  border: 1.5px solid var(--line);
  background: transparent;
  font-weight: 700;
  font-size: 14.5px;
  color: var(--ink);
  cursor: pointer;
}
.copy:hover { border-color: var(--ink); }
small { font-size: 12px; color: var(--ink-muted); line-height: 1.45; }
@media (max-width: 959px) { .ticket { position: static; } }
</style>
