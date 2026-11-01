<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { calLabel, findItem } from '@/order/lib/catalog'
import { cents, summaryParts, validate } from '@/order/lib/pricing'
import { useOrder } from '@/order/useOrder'
import { useToast } from '@/composables/useToast'
import ModifierGroup from '@/order/components/ModifierGroup.vue'
import MealExtras from '@/order/components/MealExtras.vue'
import StickyBar from '@/order/components/StickyBar.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

// MENU-07: fixed items whose options come from modifier groups (tacos, birria, dips, kits, kids...).
const props = defineProps({ store: { type: String, required: true }, slug: { type: String, required: true } })
const route = useRoute()
const router = useRouter()
const order = useOrder()
const toast = useToast()

const item = computed(() => findItem(props.slug))
const editLine = computed(() => order.state.lines.find((l) => l.id === route.query.edit) ?? null)
watch(
  () => [props.slug, route.query.edit],
  () => item.value && order.openDraft(props.slug, editLine.value),
  { immediate: true },
)

const draft = computed(() => (order.state.draft?.itemSlug === props.slug ? order.state.draft : null))
const sel = computed(() => draft.value?.selections ?? {})
const errors = computed(() => (item.value ? validate(item.value, sel.value) : []))
const showErrors = ref(false)
const errorFor = (key) => (showErrors.value ? (errors.value.find((e) => e.group === key)?.message ?? '') : '')
const total = computed(() => cents(order.draftUnit.value * (draft.value?.qty ?? 1)))

function back() {
  if (window.history.state?.back) return router.back()
  router.push(`/order/${props.store}`)
}
function add() {
  if (errors.value.length) {
    showErrors.value = true
    document.querySelector('.has-error')?.scrollIntoView({ block: 'center' })
    return
  }
  const wasEdit = !!draft.value.editId
  order.commitDraft()
  toast.show(wasEdit ? 'Updated' : `${item.value.name} added`)
  router.push(`/order/${props.store}`)
}
</script>

<template>
  <div v-if="item && draft">
    <button type="button" class="back" @click="back"><span aria-hidden="true">←</span> Back</button>
    <h1 class="t">{{ item.name }}</h1>
    <p v-if="item.description" class="d">{{ item.description }}</p>
    <p v-if="calLabel(item)" class="cal">{{ calLabel(item) }}</p>

    <div v-if="item.includes" class="inc">
      <h2 class="inc__h">Included</h2>
      <ul>
        <li v-for="x in item.includes" :key="x">{{ x }}</li>
      </ul>
    </div>

    <div class="groups">
      <ModifierGroup
        v-for="g in item.groups"
        :key="g.key"
        :group="g"
        :picks="sel[g.key] ?? []"
        :error="errorFor(g.key)"
        @pick="order.pick(g.key, $event)"
        @level="(name, lvl) => order.level(g.key, name, lvl)"
      />
    </div>

    <MealExtras class="mx" :label="draft.label" :qty="draft.qty" @update:label="order.setLabel" @update:qty="order.setQty" />

    <StickyBar :total="total" :caption="summaryParts(item, sel).slice(0, 2).join(' · ')">
      <BaseButton variant="lime" @click="add">{{ draft.editId ? 'UPDATE' : 'ADD TO BAG' }}</BaseButton>
    </StickyBar>
  </div>
</template>

<style scoped>
.back { min-height: 44px; padding: 0 12px 0 0; border: 0; background: none; color: var(--ink); font: 800 15px var(--f-body); cursor: pointer; }
.t { font: 400 clamp(32px, 9vw, 44px)/1 var(--f-display); text-transform: uppercase; margin: 4px 0 8px; }
.d { color: var(--ink-muted); }
.cal { margin-top: 6px; font-size: 14px; color: var(--ink-muted); }
.inc { margin-top: 20px; padding: 16px; border-radius: var(--r-md); background: var(--surface); border: 1.5px solid var(--line); }
.inc__h { font: 400 16px/1 var(--f-cond); letter-spacing: 2px; text-transform: uppercase; color: var(--accent-text); margin-bottom: 8px; }
.inc ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; }
.inc li::before { content: '✓'; color: var(--lime); font-weight: 800; margin-right: 8px; }
.groups { display: grid; gap: 28px; margin-top: 24px; }
.mx { margin-top: 28px; }
</style>
