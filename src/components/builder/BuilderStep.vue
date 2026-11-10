<script setup>
// One numbered card of the Build-Your-Own flow. `active` = the step last touched.
defineProps({
  number: { type: Number, required: true },
  title: { type: String, required: true },
  note: { type: String, default: '' },
  active: { type: Boolean, default: false },
})
</script>

<template>
  <article class="step" :class="{ 'is-active': active }" :data-step="number">
    <div class="step__top">
      <span class="step__n" aria-hidden="true">{{ number }}</span>
      <h3 class="step__t display">{{ title }}</h3>
      <span v-if="note" class="step__note">{{ note }}</span>
    </div>
    <slot />
  </article>
</template>

<style scoped>
.step {
  background: var(--surface-raised);
  border: 1.5px solid var(--line);
  border-radius: var(--r-lg);
  padding: clamp(18px, 2.4vw, 28px);
  display: grid;
  gap: 16px;
  transition: border-color 0.2s;
}
.step.is-active { border-color: var(--guac); }
.step__top { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.step__n {
  width: 36px;
  height: 36px;
  flex: none;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font: 900 18px/1 var(--f-display);
  background: var(--ink);
  color: #fff;
}
.step.is-active .step__n { background: var(--guac); }
.step__t { font-size: clamp(22px, 2.2vw, 28px); }
.step__note { margin-left: auto; font-size: 13px; color: var(--ink-muted); font-weight: 600; }
</style>
