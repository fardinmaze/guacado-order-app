<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PromoBar from '@/components/layout/PromoBar.vue'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import MobileOrderBar from '@/components/layout/MobileOrderBar.vue'
import ToastNotice from '@/components/layout/ToastNotice.vue'

const route = useRoute()
const inOrder = computed(() => !!route.meta.order)
</script>

<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <!-- The ordering flow brings its own slim header, so the marketing chrome steps aside. -->
  <RouterView v-if="inOrder" />
  <template v-else>
    <PromoBar />
    <SiteHeader />
    <main id="main">
      <RouterView />
    </main>
    <SiteFooter />
    <MobileOrderBar />
  </template>
  <ToastNotice />
</template>
