<script setup>
// One numbered card of the Build-Your-Own flow. `active` = the step in view (lime border).
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
      <h3 class="step__t">{{ title }}</h3>
      <span v-if="note" class="step__note">{{ note }}</span>
    </div>
    <slot />
  </article>
</template>

<style scoped>
.step {
  background: var(--surface-raised);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  padding: clamp(22px, 3vw, 34px);
  display: grid;
  gap: 18px;
  transition: border-color 0.3s;
}
.step.is-active { border-color: rgba(200, 216, 44, 0.6); }
.step__top { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.step__n {
  width: 52px;
  height: 52px;
  flex: none;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-family: var(--f-cond);
  font-size: 28px;
  line-height: 1;
  padding-top: 3px;
  background: var(--chili);
  color: var(--on-lime);
}
.step__t { font-family: var(--f-display); font-size: clamp(24px, 2.6vw, 32px); line-height: 1.05; }
.step__note { margin-left: auto; font-size: 13px; color: var(--ink-muted); font-weight: 500; }
</style>
