<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { findItem } from '@/order/lib/catalog'
import { cents, summaryParts, validate } from '@/order/lib/pricing'
import { useOrder } from '@/order/useOrder'
import { useToast } from '@/composables/useToast'
import ModifierGroup from '@/order/components/ModifierGroup.vue'
import MealExtras from '@/order/components/MealExtras.vue'
import StickyBar from '@/order/components/StickyBar.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

// MENU-02/03/05/06/09: Base → Protein → Toppings → Sauce → Review.
// The step lives in the URL (?step=) and the choices in the persisted store, so refresh and the
// back gesture both keep the meal. Defaults make the starting bowl $12.95.
const props = defineProps({ store: { type: String, required: true } })
const route = useRoute()
const router = useRouter()
const order = useOrder()
const toast = useToast()

const SLUG = 'build-your-own'
const item = findItem(SLUG)
const STEPS = [
  { key: 'base', groups: ['base'], title: 'Pick your base' },
  { key: 'protein', groups: ['protein'], title: 'Pick your protein' },
  { key: 'toppings', groups: ['toppings', 'addons'], title: 'Add toppings' },
  { key: 'sauce', groups: ['sauce'], title: 'Pick your sauce' },
  { key: 'review', groups: [], title: 'Review your meal' },
]

const editLine = computed(() => order.state.lines.find((l) => l.id === route.query.edit) ?? null)
watch(
  () => route.query.edit,
  () => order.openDraft(SLUG, editLine.value),
  { immediate: true },
)

const idx = computed(() => Math.max(0, STEPS.findIndex((s) => s.key === route.query.step)))
const step = computed(() => STEPS[idx.value])
const draft = computed(() => order.state.draft)
const sel = computed(() => draft.value?.selections ?? {})
const groupOf = (key) => item.groups.find((g) => g.key === key)
const errors = computed(() => validate(item, sel.value))
const errorFor = (key) => (errors.value.find((e) => e.group === key) ? errors.value.find((e) => e.group === key).message : '')
const stepOk = computed(() => !step.value.groups.some((k) => errorFor(k)))
const unit = computed(() => order.draftUnit.value * (draft.value?.qty ?? 1))
const caption = computed(() => summaryParts(item, sel.value).slice(0, 2).join(' · '))

const heading = ref(null)
watch(step, async () => {
  await nextTick()
  heading.value?.focus() // screen readers land on the new step
  window.scrollTo({ top: 0, behavior: 'instant' })
})

const go = (key) => router.push({ query: { ...route.query, step: key } })
const next = () => stepOk.value && go(STEPS[idx.value + 1].key)
function back() {
  if (window.history.state?.back?.includes('step=')) return router.back()
  if (idx.value > 0) return router.replace({ query: { ...route.query, step: STEPS[idx.value - 1].key } })
  router.push(`/order/${props.store}`)
}
function add() {
  if (errors.value.length) return
  const wasEdit = !!draft.value.editId
  order.commitDraft()
  toast.show(wasEdit ? 'Meal updated' : 'Added to your bag')
  router.push(`/order/${props.store}`)
}
</script>

<template>
  <div v-if="draft" class="b">
    <div class="b__top">
      <button type="button" class="back" @click="back"><span aria-hidden="true">←</span> Back</button>
      <p class="b__n">Step {{ idx + 1 }} of {{ STEPS.length }}</p>
    </div>
    <div class="prog" role="progressbar" :aria-valuenow="idx + 1" aria-valuemin="1" :aria-valuemax="STEPS.length" :aria-label="`Step ${idx + 1} of ${STEPS.length}`">
      <span v-for="(s, i) in STEPS" :key="s.key" :class="{ on: i <= idx }" />
    </div>

    <h1 ref="heading" class="b__h" tabindex="-1">{{ step.title }}</h1>

    <div v-if="step.key !== 'review'" class="b__groups">
      <ModifierGroup
        v-for="k in step.groups"
        :key="k"
        :group="groupOf(k)"
        :picks="sel[k] ?? []"
        :error="errorFor(k)"
        :hide="k === 'addons' ? ['Extra Protein'] : []"
        :extra-on-protein="k === 'protein'"
        :heading-level="step.groups.length > 1 ? 'h2' : 'h2'"
        @pick="order.pick(k, $event)"
        @level="(name, lvl) => order.level(k, name, lvl)"
      />
    </div>

    <div v-else class="rev">
      <ul class="rev__list">
        <li v-for="s in STEPS.slice(0, 4)" :key="s.key" class="rev__row">
          <div>
            <p class="rev__k">{{ s.key }}</p>
            <p class="rev__v">{{ s.groups.flatMap((k) => (sel[k] ?? []).filter((p) => p.name !== 'Extra Protein').map((p) => p.name + (p.level && p.level !== 'regular' ? ` (${p.level})` : ''))).join(', ') || 'None' }}</p>
          </div>
          <button type="button" class="lnk" @click="go(s.key)">Change<span class="sr-only"> {{ s.key }}</span></button>
        </li>
      </ul>
      <MealExtras :label="draft.label" :qty="draft.qty" @update:label="order.setLabel" @update:qty="order.setQty" />
      <p v-if="errors.length" class="rev__err" role="alert">{{ errors[0].message }}</p>
    </div>

    <StickyBar :total="cents(unit)" :caption="caption">
      <BaseButton v-if="step.key !== 'review'" variant="lime" :disabled="!stepOk" @click="next">NEXT</BaseButton>
      <BaseButton v-else variant="lime" :disabled="errors.length > 0" @click="add">{{ draft.editId ? 'UPDATE' : 'ADD TO BAG' }}</BaseButton>
    </StickyBar>
  </div>
</template>

<style scoped>
.b__top { display: flex; align-items: center; justify-content: space-between; }
.back { min-height: 44px; padding: 0 12px 0 0; border: 0; background: none; color: var(--ink); font: 800 15px var(--f-body); cursor: pointer; }
.b__n { font: 400 16px/1 var(--f-cond); letter-spacing: 2px; text-transform: uppercase; color: var(--ink-muted); }
.prog { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin: 4px 0 22px; }
.prog span { height: 6px; border-radius: 3px; background: var(--line); transition: background 0.2s; }
.prog span.on { background: var(--lime); }
.b__h { font: 400 clamp(28px, 8vw, 38px)/1 var(--f-display); text-transform: uppercase; margin-bottom: 20px; outline: none; }
.b__groups { display: grid; gap: 28px; }
.rev { display: grid; gap: 24px; }
.rev__list { list-style: none; margin: 0; padding: 0; border: 1.5px solid var(--line); border-radius: var(--r-md); background: var(--surface); }
.rev__row { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 12px 8px 12px 16px; border-top: 1px solid var(--line); }
.rev__row:first-child { border-top: 0; }
.rev__k { font: 400 15px/1 var(--f-cond); letter-spacing: 2px; text-transform: uppercase; color: var(--accent-text); }
.rev__v { font-weight: 700; }
.lnk { min-height: 44px; padding: 0 12px; border: 0; background: none; color: var(--ink); font: 700 14px var(--f-body); text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
.rev__err { color: var(--chili); font-weight: 700; }
</style>
