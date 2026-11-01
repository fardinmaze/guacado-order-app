<script setup>
import { computed } from 'vue'
import { cents } from '@/order/lib/pricing'
import HeatIcons from '@/components/ui/HeatIcons.vue'
import LevelControl from './LevelControl.vue'

// One choice group (base, protein, toppings, size...). Rows are `button[aria-pressed]`;
// when the group allows levels, a picked row opens a Light/Regular/Extra/Side control.
const props = defineProps({
  group: { type: Object, required: true },
  picks: { type: Array, default: () => [] },
  error: { type: String, default: '' },
  hide: { type: Array, default: () => [] }, // option names handled elsewhere (Extra Protein)
  extraOnProtein: { type: Boolean, default: false },
  headingLevel: { type: String, default: 'h2' },
})
const emit = defineEmits(['pick', 'level'])

const options = computed(() => props.group.options.filter((o) => !props.hide.includes(o.name)))
const isPicked = (name) => props.picks.some((p) => p.name === name)
const levelOf = (name) => props.picks.find((p) => p.name === name)?.level ?? 'regular'
const compact = computed(() => !props.group.allowLevels && options.value.every((o) => !o.priceCents))
const rule = computed(() => {
  const { minSelect: min, maxSelect: max } = props.group
  if (max === 1) return min ? 'Pick one' : 'Pick one · optional'
  if (min === max) return `Pick exactly ${max}`
  return min ? `Pick ${min}–${max}` : `Up to ${max} · optional`
})
const atCap = computed(() => props.group.maxSelect > 1 && props.picks.length >= props.group.maxSelect)
const priceText = (o) => (o.priceCents ? (props.group.setsPrice ? cents(o.priceCents) : `+${cents(o.priceCents)}`) : '')
</script>

<template>
  <fieldset class="grp" :class="{ 'has-error': error }">
    <legend class="grp__head">
      <component :is="headingLevel" class="grp__title">{{ group.name }}</component>
      <span class="grp__rule">{{ rule }}<template v-if="group.maxSelect > 1"> · {{ picks.length }} chosen</template></span>
    </legend>

    <ul class="opts" :class="{ compact }">
      <li v-for="o in options" :key="o.name" class="opt" :class="{ on: isPicked(o.name) }">
        <button
          type="button"
          class="opt__btn"
          :aria-pressed="isPicked(o.name)"
          :disabled="!isPicked(o.name) && atCap"
          @click="emit('pick', o.name)"
        >
          <span class="opt__tick" aria-hidden="true">
            <svg v-if="isPicked(o.name)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10" /></svg>
          </span>
          <span class="opt__name">{{ o.name }}</span>
          <HeatIcons v-if="o.heat" :level="o.heat" />
          <span v-if="priceText(o)" class="opt__price">{{ priceText(o) }}</span>
        </button>
        <LevelControl
          v-if="group.allowLevels && isPicked(o.name)"
          class="opt__lv"
          :label="o.name"
          :extra-price="extraOnProtein"
          :model-value="levelOf(o.name)"
          @update:model-value="emit('level', o.name, $event)"
        />
      </li>
    </ul>
    <p v-if="atCap" class="grp__hint">That's the limit. Untick one to swap.</p>
    <p v-if="error" class="grp__err" role="alert">{{ error }}</p>
  </fieldset>
</template>

<style scoped>
.grp { border: 0; margin: 0; padding: 0; min-width: 0; }
.grp__head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; width: 100%; padding: 0; margin-bottom: 12px; }
.grp__title { font: 400 22px/1.1 var(--f-display); text-transform: uppercase; }
.grp__rule { font: 400 15px/1 var(--f-cond); letter-spacing: 1.5px; color: var(--accent-text); white-space: nowrap; text-transform: uppercase; }
.opts { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.opts.compact { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.opt { display: grid; gap: 8px; }
.opt__btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 56px;
  padding: 10px 16px 10px 12px;
  border-radius: var(--r-md);
  border: 1.5px solid var(--line);
  background: var(--surface);
  color: var(--ink);
  text-align: left;
  font: 700 16px/1.2 var(--f-body);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.opt__btn:active:not(:disabled) { transform: scale(0.985); }
.opt__btn:disabled { opacity: 0.45; cursor: not-allowed; }
.opt.on .opt__btn { border-color: var(--lime); background: var(--surface-raised); }
.opt__tick { flex: none; width: 24px; height: 24px; border-radius: 50%; border: 2px solid var(--ink-muted); display: grid; place-items: center; color: var(--on-lime); }
.opt.on .opt__tick { background: var(--lime); border-color: var(--lime); }
.opt__tick svg { width: 14px; height: 14px; }
.opt__name { flex: 1; min-width: 0; }
.opt__price { font: 400 20px/1 var(--f-cond); letter-spacing: 1px; color: var(--lime); }
.grp__hint { margin-top: 8px; font-size: 14px; color: var(--ink-muted); }
.grp__err { margin-top: 8px; font-size: 14px; font-weight: 700; color: var(--chili); }
.has-error .opt__btn { border-color: var(--chili); }
@media (max-width: 359px) { .opts.compact { grid-template-columns: 1fr; } }
</style>
