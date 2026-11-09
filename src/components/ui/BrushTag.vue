<template>
  <span class="tag"><slot /></span>
</template>

<style scoped>
/* Torn brush label from the menu boards (BRAND.md §7). */
.tag {
  display: inline-block;
  font-family: var(--f-display);
  color: var(--on-green);
  font-size: clamp(26px, 2.8vw, 32px);
  line-height: 1;
  padding: 14px 32px 16px;
  background: var(--guac);
  transform: rotate(-1.5deg);
  clip-path: polygon(2% 8%, 10% 0, 40% 6%, 70% 0, 97% 5%, 100% 40%, 98% 92%, 70% 100%, 35% 94%, 6% 100%, 0 60%);
  margin-bottom: 18px;
}
</style>
