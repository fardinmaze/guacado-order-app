<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { findItem } from '@/order/lib/catalog'
import { cents, lineCents, summaryParts } from '@/order/lib/pricing'
import { useOrder } from '@/order/useOrder'
import { useBagSheet } from '@/order/useBagSheet'
import BaseButton from '@/components/ui/BaseButton.vue'

// Full-screen sheet on phones, side panel on wide screens. Edit / duplicate / remove per line.
const { open, hide } = useBagSheet()
const order = useOrder()
const router = useRouter()
const root = ref(null)
const closeBtn = ref(null)
let opener = null

const view = (line) => {
  const item = findItem(line.itemSlug)
  return { line, item, parts: summaryParts(item, line.selections), price: lineCents(item, line) }
}

function onKey(e) {
  if (e.key === 'Escape') return hide()
  if (e.key !== 'Tab' || !root.value) return
  const f = root.value.querySelectorAll('a[href], button:not([disabled]), input')
  if (!f.length) return
  const first = f[0]
  const last = f[f.length - 1]
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
}

watch(open, async (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
  if (isOpen) {
    opener = document.activeElement
    document.addEventListener('keydown', onKey)
    await nextTick()
    closeBtn.value?.focus()
  } else {
    document.removeEventListener('keydown', onKey)
    opener?.focus?.()
  }
})
onBeforeUnmount(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', onKey)
})

function edit(v) {
  hide()
  const slug = order.state.storeSlug
  const to = v.item.slug === 'build-your-own'
    ? { path: `/order/${slug}/build`, query: { edit: v.line.id, step: 'review' } }
    : { path: `/order/${slug}/item/${v.item.slug}`, query: { edit: v.line.id } }
  router.push(to)
}
function checkout() {
  hide()
  router.push('/order/checkout')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="scrim" @click.self="hide">
      <div ref="root" class="sheet" role="dialog" aria-modal="true" aria-labelledby="bag-title">
        <header class="sheet__top">
          <h2 id="bag-title">Your bag</h2>
          <button ref="closeBtn" type="button" class="x" aria-label="Close bag" @click="hide">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </header>

        <div v-if="!order.state.lines.length" class="empty">
          <p class="empty__t">Your bag is empty.</p>
          <p>Pick something from the menu and it will wait here, even if you refresh.</p>
          <BaseButton variant="lime" @click="hide">BACK TO MENU</BaseButton>
        </div>

        <ul v-else class="lines">
          <li v-for="v in order.state.lines.map(view)" :key="v.line.id" class="line">
            <div class="line__top">
              <div class="line__main">
                <p class="line__name">
                  {{ v.item.name }}<span v-if="v.line.qty > 1"> × {{ v.line.qty }}</span>
                </p>
                <p v-if="v.line.label" class="line__for">For {{ v.line.label }}</p>
              </div>
              <span class="line__price">{{ cents(v.price) }}</span>
            </div>
            <p v-if="v.parts.length" class="line__sum">{{ v.parts.join(' · ') }}</p>
            <div class="line__act">
              <div class="step" role="group" :aria-label="`Quantity of ${v.item.name}`">
                <button type="button" aria-label="One fewer" @click="order.setLineQty(v.line.id, v.line.qty - 1)">−</button>
                <span aria-live="polite">{{ v.line.qty }}</span>
                <button type="button" aria-label="One more" @click="order.setLineQty(v.line.id, v.line.qty + 1)">+</button>
              </div>
              <button v-if="v.item.groups?.length" type="button" class="lnk" @click="edit(v)">Edit</button>
              <button type="button" class="lnk" @click="order.duplicateLine(v.line.id)">Duplicate</button>
              <button type="button" class="lnk lnk--bad" @click="order.removeLine(v.line.id)">Remove</button>
            </div>
          </li>
        </ul>

        <footer v-if="order.state.lines.length" class="sheet__foot">
          <div class="sub"><span>Subtotal</span><strong>{{ cents(order.subtotal.value) }}</strong></div>
          <BaseButton variant="lime" class="go" @click="checkout">CHECKOUT</BaseButton>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.scrim { position: fixed; inset: 0; z-index: 80; background: rgba(0, 0, 0, 0.6); display: flex; justify-content: flex-end; }
.sheet {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: var(--ground);
  padding-top: env(safe-area-inset-top, 0px);
}
@media (min-width: 640px) { .sheet { width: 440px; border-left: 1px solid var(--line); } }
.sheet__top { display: flex; align-items: center; justify-content: space-between; padding: 16px var(--gut-r) 12px var(--gut-l); border-bottom: 1px solid var(--line); }
.sheet__top h2 { font: 400 28px/1 var(--f-display); text-transform: uppercase; }
.x { width: 48px; height: 48px; border-radius: 50%; border: 1.5px solid var(--line); background: var(--surface); color: var(--ink); display: grid; place-items: center; cursor: pointer; }
.x svg { width: 22px; height: 22px; }
.empty { padding: 48px var(--gut-l); display: grid; gap: 12px; justify-items: start; color: var(--ink-muted); }
.empty__t { font: 400 26px/1.1 var(--f-display); color: var(--ink); text-transform: uppercase; }
.lines { list-style: none; margin: 0; padding: 8px var(--gut-r) 16px var(--gut-l); overflow-y: auto; flex: 1; overscroll-behavior: contain; }
.line { padding: 16px 0; border-bottom: 1px solid var(--line); display: grid; gap: 8px; }
.line__top { display: flex; justify-content: space-between; gap: 12px; }
.line__name { font-weight: 800; font-size: 17px; }
.line__for { font-family: var(--f-script); color: var(--lime); font-size: 20px; line-height: 1.1; }
.line__price { font: 400 24px/1 var(--f-cond); letter-spacing: 1px; color: var(--lime); }
.line__sum { font-size: 14px; color: var(--ink-muted); }
.line__act { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
.step { display: inline-flex; align-items: center; border: 1.5px solid var(--line); border-radius: var(--r-pill); margin-right: auto; }
.step button { width: 44px; height: 44px; border: 0; background: transparent; color: var(--ink); font: 700 22px/1 var(--f-body); cursor: pointer; border-radius: 50%; }
.step span { min-width: 28px; text-align: center; font-weight: 800; }
.lnk { min-height: 44px; padding: 0 12px; border: 0; background: none; color: var(--ink); font: 700 14px/1 var(--f-body); text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
.lnk--bad { color: var(--chili); }
.sheet__foot { padding: 14px var(--gut-r) calc(14px + env(safe-area-inset-bottom, 0px)) var(--gut-l); border-top: 1px solid var(--line); background: var(--surface); display: grid; gap: 12px; }
.sub { display: flex; justify-content: space-between; align-items: baseline; }
.sub strong { font: 400 30px/1 var(--f-cond); letter-spacing: 1px; color: var(--lime); }
.go { width: 100%; }
</style>
