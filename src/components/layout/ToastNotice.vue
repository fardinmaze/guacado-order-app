<script setup>
import { useToast } from '@/composables/useToast'

const { message, visible } = useToast()
</script>

<template>
  <div class="toast" :class="{ show: visible }" role="status">{{ message }}</div>
</template>

<style scoped>
.toast {
  position: fixed;
  left: 50%;
  bottom: calc(92px + env(safe-area-inset-bottom, 0px));
  transform: translate(-50%, 140%);
  background: var(--ink);
  color: #fff;
  font-weight: 700;
  padding: 12px 20px;
  border-radius: var(--r-pill);
  z-index: 90;
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.toast.show { transform: translate(-50%, 0); }
@media (min-width: 900px) { .toast { bottom: calc(24px + env(safe-area-inset-bottom, 0px)); } }
.toast:not(.show) { visibility: hidden; transition: transform 0.35s, visibility 0s 0.35s; }
</style>
