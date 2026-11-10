<script setup>
// variant: primary (guac) | dark | outline | light (on dark bands) | lime
// size: sm | md | lg. Renders RouterLink (to), <a> (href) or <button>.
defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  to: { type: String, default: '' },
  href: { type: String, default: '' },
  block: { type: Boolean, default: false },
})
</script>

<template>
  <RouterLink v-if="to" :to="to" class="btn" :class="[`btn--${variant}`, `btn--${size}`, { 'btn--block': block }]">
    <slot />
  </RouterLink>
  <a v-else-if="href" :href="href" class="btn" :class="[`btn--${variant}`, `btn--${size}`, { 'btn--block': block }]">
    <slot />
  </a>
  <button v-else type="button" class="btn" :class="[`btn--${variant}`, `btn--${size}`, { 'btn--block': block }]">
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: var(--f-display);
  font-weight: 800;
  font-stretch: 80%;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  line-height: 1;
  border-radius: var(--r-pill);
  border: 2px solid transparent;
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.18s, border-color 0.18s, color 0.18s, transform 0.12s;
}
.btn:active { transform: translateY(1px); }
.btn--sm { font-size: 14px; min-height: 40px; padding: 0 16px; }
.btn--md { font-size: 16px; min-height: 48px; padding: 0 24px; }
.btn--lg { font-size: 19px; min-height: 58px; padding: 0 34px; }
.btn--block { display: flex; width: 100%; }

.btn--primary { background: var(--guac); color: var(--on-green); }
.btn--primary:hover { background: var(--guac-dark); }
.btn--dark { background: var(--ink); color: #fff; }
.btn--dark:hover { background: #000; }
.btn--outline { background: transparent; color: var(--ink); border-color: var(--ink); }
.btn--outline:hover { background: var(--ink); color: #fff; }
.btn--light { background: transparent; color: var(--on-night); border-color: rgba(246, 241, 231, 0.6); }
.btn--light:hover { background: var(--on-night); color: var(--night); border-color: var(--on-night); }
.btn--lime { background: var(--lime); color: var(--on-lime); }
.btn--lime:hover { background: #d8e83c; }
.btn :deep(svg) { width: 18px; height: 18px; flex: none; }
</style>
