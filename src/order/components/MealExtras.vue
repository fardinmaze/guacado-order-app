<script setup>
// "Name this meal" and the quantity stepper, shared by the builder review and the item page.
defineProps({
  label: { type: String, default: '' },
  qty: { type: Number, required: true },
})
const emit = defineEmits(['update:label', 'update:qty'])
</script>

<template>
  <div class="mx">
    <label class="mx__f">
      <span class="mx__l">Name this meal <small>(optional)</small></span>
      <input
        :value="label"
        type="text"
        maxlength="30"
        autocomplete="off"
        placeholder="Sara's bowl"
        @input="emit('update:label', $event.target.value)"
      />
      <span class="mx__h">We'll call this name when it's ready on the shelf.</span>
    </label>

    <div class="mx__q">
      <span class="mx__l" id="qty-l">How many?</span>
      <div class="step" role="group" aria-labelledby="qty-l">
        <button type="button" aria-label="One fewer" :disabled="qty <= 1" @click="emit('update:qty', qty - 1)">−</button>
        <output aria-live="polite">{{ qty }}</output>
        <button type="button" aria-label="One more" :disabled="qty >= 20" @click="emit('update:qty', qty + 1)">+</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mx { display: grid; gap: 20px; }
.mx__f { display: grid; gap: 6px; }
.mx__l { font: 400 18px/1 var(--f-cond); letter-spacing: 2px; text-transform: uppercase; color: var(--accent-text); }
.mx__l small { font: 400 14px var(--f-body); letter-spacing: 0; text-transform: none; color: var(--ink-muted); }
.mx input { min-height: 52px; padding: 0 16px; border-radius: var(--r-md); border: 1.5px solid var(--line); background: var(--surface); color: var(--ink); font: 600 16px var(--f-body); }
.mx__h { font-size: 13px; color: var(--ink-muted); }
.mx__q { display: flex; align-items: center; justify-content: space-between; }
.step { display: inline-flex; align-items: center; border: 1.5px solid var(--line); border-radius: var(--r-pill); background: var(--surface); }
.step button { width: 52px; height: 52px; border: 0; background: transparent; color: var(--ink); font: 700 24px/1 var(--f-body); cursor: pointer; border-radius: 50%; }
.step button:disabled { opacity: 0.35; cursor: not-allowed; }
.step output { min-width: 36px; text-align: center; font: 800 20px var(--f-body); }
</style>
