<script setup>
import { computed, reactive, ref } from 'vue'
import { site } from '@/data/site'
import { findItem } from '@/order/lib/catalog'
import { asapMinutes, minutesUntilClose, pickupSlots } from '@/order/lib/hours'
import { cents, lineCents, summaryParts } from '@/order/lib/pricing'
import { useOrder } from '@/order/useOrder'
import OptionChip from '@/components/ui/OptionChip.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import StickyBar from '@/order/components/StickyBar.vue'

// CART-04/05/07: pickup time, guest details, tip and a summary. Totals here are display-only.
// Taking payment needs the server + Stripe (not part of this front-end build), so the final
// button is intentionally disabled and says why.
const order = useOrder()
const store = computed(() => order.store.value)
const now = new Date()
const isOpen = computed(() => !!store.value && minutesUntilClose(store.value, now) !== null)
const slots = computed(() => (store.value ? pickupSlots(store.value, now) : []))

const when = ref(isOpen.value ? 'asap' : 'later')
const slot = ref(slots.value[0]?.at ?? '')
const tipPct = ref(0)
const f = reactive({ name: '', phone: '', email: '' })
const touched = reactive({ name: false, phone: false, email: false })

const rules = {
  name: (v) => (v.trim() ? '' : 'Tell us the name for the order.'),
  phone: (v) => (v.replace(/\D/g, '').length >= 10 ? '' : 'Enter a 10-digit mobile number.'),
  email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? '' : 'Enter an email, like you@example.com.'),
}
const err = (k) => (touched[k] ? rules[k](f[k]) : '')
const valid = computed(() => Object.keys(rules).every((k) => !rules[k](f[k])) && (when.value === 'asap' || !!slot.value))

const lines = computed(() =>
  order.state.lines.map((l) => {
    const item = findItem(l.itemSlug)
    return { l, item, parts: summaryParts(item, l.selections), price: lineCents(item, l) }
  }),
)
const t = computed(() => order.totalsFor(tipPct.value))
const eta = computed(() => asapMinutes(12, 0))
</script>

<template>
  <div v-if="!store" class="empty">
    <h1 class="t">Pick a restaurant first</h1>
    <p>We need to know which kitchen is cooking.</p>
    <BaseButton variant="lime" to="/order">CHOOSE RESTAURANT</BaseButton>
  </div>

  <div v-else-if="!lines.length" class="empty">
    <h1 class="t">Your bag is empty</h1>
    <p>Add something from the menu, then come back to check out.</p>
    <BaseButton variant="lime" :to="`/order/${store.slug}`">BACK TO MENU</BaseButton>
  </div>

  <form v-else class="co" novalidate @submit.prevent>
    <RouterLink class="back" :to="`/order/${store.slug}`"><span aria-hidden="true">←</span> Menu</RouterLink>
    <h1 class="t">Checkout</h1>

    <section class="card" aria-labelledby="c-pick">
      <h2 id="c-pick" class="card__h">Pickup time</h2>
      <p class="where">{{ store.address }}, {{ store.city }}</p>
      <div class="seg" role="radiogroup" aria-labelledby="c-pick">
        <button type="button" role="radio" :aria-checked="when === 'asap'" :disabled="!isOpen" @click="when = 'asap'">
          ASAP <small v-if="isOpen">~{{ eta }} min</small>
        </button>
        <button type="button" role="radio" :aria-checked="when === 'later'" @click="when = 'later'">Schedule</button>
      </div>
      <p v-if="!isOpen" class="note">This restaurant is closed right now. Pick a time after it opens.</p>
      <label v-if="when === 'later'" class="fld">
        <span>Time</span>
        <select v-model="slot">
          <option v-for="s in slots" :key="s.at" :value="s.at">{{ s.label }}</option>
        </select>
      </label>
    </section>

    <section class="card" aria-labelledby="c-who">
      <h2 id="c-who" class="card__h">Your details</h2>
      <label class="fld">
        <span>Name</span>
        <input v-model="f.name" type="text" autocomplete="name" :aria-invalid="!!err('name')" @blur="touched.name = true" />
        <em v-if="err('name')" role="alert">{{ err('name') }}</em>
      </label>
      <label class="fld">
        <span>Mobile</span>
        <input v-model="f.phone" type="tel" inputmode="tel" autocomplete="tel-national" placeholder="(555) 123-4567" :aria-invalid="!!err('phone')" @blur="touched.phone = true" />
        <em v-if="err('phone')" role="alert">{{ err('phone') }}</em>
      </label>
      <label class="fld">
        <span>Email</span>
        <input v-model="f.email" type="email" inputmode="email" autocomplete="email" :aria-invalid="!!err('email')" @blur="touched.email = true" />
        <em v-if="err('email')" role="alert">{{ err('email') }}</em>
      </label>
    </section>

    <section class="card" aria-labelledby="c-tip">
      <h2 id="c-tip" class="card__h">Tip <small>(optional)</small></h2>
      <div class="tips" role="group" aria-labelledby="c-tip">
        <OptionChip v-for="p in [0, 10, 15, 20]" :key="p" :pressed="tipPct === p" @click="tipPct = p">{{ p ? p + '%' : 'No tip' }}</OptionChip>
      </div>
    </section>

    <section class="card" aria-labelledby="c-sum">
      <h2 id="c-sum" class="card__h">Order summary</h2>
      <ul class="sum">
        <li v-for="x in lines" :key="x.l.id">
          <div>
            <strong>{{ x.l.qty }} × {{ x.item.name }}</strong>
            <span v-if="x.l.label" class="for"> for {{ x.l.label }}</span>
            <p v-if="x.parts.length" class="parts">{{ x.parts.join(' · ') }}</p>
          </div>
          <span class="p">{{ cents(x.price) }}</span>
        </li>
      </ul>
      <dl class="tot">
        <div><dt>Subtotal</dt><dd>{{ cents(t.subtotal) }}</dd></div>
        <div v-if="t.taxPending"><dt>Tax</dt><dd class="pend">Confirmed at your restaurant</dd></div>
        <div v-else><dt>Tax</dt><dd>{{ cents(t.tax) }}</dd></div>
        <div v-if="t.tip"><dt>Tip</dt><dd>{{ cents(t.tip) }}</dd></div>
        <div class="grand"><dt>Total</dt><dd>{{ cents(t.total) }}<span v-if="t.taxPending">+ tax</span></dd></div>
      </dl>
    </section>

    <aside class="pay" role="note">
      <strong>Online payment isn't switched on yet.</strong>
      <span>To order right now, use delivery or pickup on DoorDash.</span>
      <a :href="site.orderUrl" target="_blank" rel="noopener">Order on DoorDash<span class="sr-only"> (opens in a new tab)</span></a>
    </aside>

    <StickyBar :total="cents(t.total)" :caption="valid ? 'Ready when payment is' : 'Fill in your details'">
      <BaseButton variant="lime" disabled>PLACE ORDER</BaseButton>
    </StickyBar>
  </form>
</template>

<style scoped>
.empty { display: grid; gap: 12px; justify-items: start; padding-top: 24px; color: var(--ink-muted); }
.t { font: 400 clamp(32px, 9vw, 44px)/1 var(--f-display); text-transform: uppercase; margin: 4px 0 16px; color: var(--ink); }
.back { display: inline-flex; align-items: center; gap: 6px; min-height: 44px; font-weight: 800; font-size: 15px; text-decoration: none; }
.co { display: grid; gap: 16px; }
.co .t { margin-bottom: 4px; }
.card { padding: 18px 16px; border-radius: var(--r-md); border: 1.5px solid var(--line); background: var(--surface); display: grid; gap: 14px; }
.card__h { font: 400 22px/1 var(--f-display); text-transform: uppercase; }
.card__h small { font: 400 14px var(--f-body); text-transform: none; color: var(--ink-muted); }
.where { color: var(--ink-muted); font-size: 14px; margin-top: -6px; }
.seg { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; padding: 4px; border-radius: var(--r-pill); background: var(--ground); border: 1px solid var(--line); }
.seg button { min-height: 48px; border: 0; border-radius: var(--r-pill); background: transparent; color: var(--ink-muted); font: 700 15px var(--f-body); cursor: pointer; display: grid; place-content: center; }
.seg button small { font: 400 15px/1 var(--f-cond); letter-spacing: 1px; }
.seg button[aria-checked='true'] { background: var(--lime); color: var(--on-lime); }
.seg button:disabled { opacity: 0.4; cursor: not-allowed; }
.note { font-size: 14px; color: var(--chili); font-weight: 700; }
.fld { display: grid; gap: 6px; }
.fld span { font: 400 16px/1 var(--f-cond); letter-spacing: 2px; text-transform: uppercase; color: var(--accent-text); }
.fld input, .fld select { min-height: 52px; padding: 0 14px; border-radius: var(--r-md); border: 1.5px solid var(--line); background: var(--ground); color: var(--ink); font: 600 16px var(--f-body); width: 100%; }
.fld input[aria-invalid='true'] { border-color: var(--chili); }
.fld em { font-style: normal; font-size: 14px; font-weight: 700; color: var(--chili); }
.tips { display: flex; flex-wrap: wrap; gap: 8px; }
.sum { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
.sum li { display: flex; justify-content: space-between; gap: 12px; }
.sum .for { color: var(--lime); }
.parts { font-size: 13px; color: var(--ink-muted); }
.p { font: 400 20px/1 var(--f-cond); letter-spacing: 1px; }
.tot { margin: 0; display: grid; gap: 6px; padding-top: 12px; border-top: 1px solid var(--line); }
.tot div { display: flex; justify-content: space-between; gap: 12px; }
.tot dt { color: var(--ink-muted); }
.tot dd { margin: 0; font-weight: 700; }
.tot .pend { font-size: 14px; font-weight: 400; color: var(--ink-muted); text-align: right; }
.tot .grand { padding-top: 8px; font-size: 18px; }
.tot .grand dt { color: var(--ink); font-weight: 800; }
.tot .grand dd { font: 400 28px/1 var(--f-cond); letter-spacing: 1px; color: var(--lime); }
.tot .grand dd span { font: 400 13px var(--f-body); color: var(--ink-muted); margin-left: 6px; }
.pay { display: grid; gap: 4px; padding: 16px; border-radius: var(--r-md); border: 1.5px dashed var(--chili); color: var(--ink-muted); }
.pay strong { color: var(--ink); }
.pay a { color: var(--lime); font-weight: 800; min-height: 44px; display: inline-flex; align-items: center; }
</style>
