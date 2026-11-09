<script setup>
import { nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ScrollTrigger } from '@/composables/useMotion'
import ScrollProgress from '@/components/layout/ScrollProgress.vue'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import ToastNotice from '@/components/layout/ToastNotice.vue'

// Page content changes height on route change; let ScrollTrigger re-measure.
const route = useRoute()
watch(() => route.path, async () => {
  await nextTick()
  ScrollTrigger.refresh()
})
</script>

<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <ScrollProgress />
  <SiteHeader />
  <main id="main">
    <RouterView />
  </main>
  <SiteFooter />
  <ToastNotice />
</template>
