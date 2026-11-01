<script setup>
import { computed, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ScrollTrigger } from '@/composables/useMotion'
import ScrollProgress from '@/components/layout/ScrollProgress.vue'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import ToastNotice from '@/components/layout/ToastNotice.vue'

// Page content changes height on route change; let ScrollTrigger re-measure.
const route = useRoute()
const inOrder = computed(() => !!route.meta.order)
watch(() => route.path, async () => {
  await nextTick()
  ScrollTrigger.refresh()
})
</script>

<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <!-- The ordering flow brings its own slim header, so the marketing chrome steps aside. -->
  <RouterView v-if="inOrder" />
  <template v-else>
    <ScrollProgress />
    <SiteHeader />
    <main id="main">
      <RouterView />
    </main>
    <SiteFooter />
  </template>
  <ToastNotice />
</template>
