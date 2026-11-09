<script setup>
import { vMagnetic } from '@/directives/magnetic'

// variant: primary | lime | ghost. Renders RouterLink (to), <a> (href) or <button>.
// Theming hooks for coloured bands: --btn-ghost-ink, --btn-ghost-line,
// --btn-primary-bg, --btn-primary-ink.
const props = defineProps({
  variant: { type: String, default: 'primary' },
  to: { type: String, default: '' },
  href: { type: String, default: '' },
  magnetic: { type: Boolean, default: undefined },
})

// Primary and lime buttons are magnetic by default.
const isMagnetic = props.magnetic ?? props.variant !== 'ghost'
</script>

<template>
  <RouterLink v-if="to" v-magnetic="isMagnetic" :to="to" class="btn" :class="`btn--${variant}`">
    <slot />
  </RouterLink>
  <a v-else-if="href" v-magnetic="isMagnetic" :href="href" class="btn" :class="`btn--${variant}`">
    <slot />
  </a>
  <button v-else v-magnetic="isMagnetic" type="button" class="btn" :class="`btn--${variant}`">
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: var(--f-cond);
  font-size: 20px;
  letter-spacing: 2px;
  line-height: 1;
  min-height: 48px;
  padding: 16px 28px 13px;
  border-radius: var(--r-pill);
  border: 2px solid transparent;
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s, box-shadow 0.25s, border-color 0.2s, color 0.2s;
}
.btn--primary {
  background: var(--btn-primary-bg, var(--guac));
  color: var(--btn-primary-ink, var(--on-green));
}
.btn--primary:hover { background: var(--guac-bright); box-shadow: var(--shadow-glow); }
.btn--lime { background: var(--lime); color: var(--on-lime); }
.btn--lime:hover { box-shadow: var(--shadow-glow); }
.btn--ghost {
  background: transparent;
  color: var(--btn-ghost-ink, var(--ink));
  border-color: var(--btn-ghost-line, var(--line));
}
.btn--ghost:hover { border-color: var(--btn-ghost-ink, var(--ink)); }
.btn :deep(svg) { width: 18px; height: 18px; }
</style>
