<script setup>
// Thumb-zone action bar pinned to the bottom of the screen. The total sits in a polite live
// region so a screen reader hears "Total $15.90" after each change (not on every frame).
defineProps({
  total: { type: String, required: true },
  caption: { type: String, default: '' },
})
</script>

<template>
  <div class="bar">
    <div class="bar__in">
      <div class="bar__sum">
        <span class="bar__cap">{{ caption }}</span>
        <strong class="bar__total" aria-live="polite" aria-atomic="true"><span class="sr-only">Total </span>{{ total }}</strong>
      </div>
      <div class="bar__act"><slot /></div>
    </div>
  </div>
</template>

<style scoped>
.bar {
  position: fixed;
  inset: auto 0 0;
  z-index: 40;
  background: rgba(17, 29, 23, 0.94);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid var(--line);
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
.bar__in { display: flex; align-items: center; gap: 16px; max-width: 720px; margin: 0 auto; padding: 12px var(--gut-r) 12px var(--gut-l); }
.bar__sum { display: grid; min-width: 0; }
.bar__cap { font-size: 13px; color: var(--ink-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bar__total { font: 400 32px/1 var(--f-cond); letter-spacing: 1px; color: var(--lime); }
.bar__act { margin-left: auto; display: flex; gap: 8px; }
.bar__act :deep(.btn) { min-height: 52px; padding-inline: 24px; }
</style>
