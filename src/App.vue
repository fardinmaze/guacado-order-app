<script setup>
import PromoBar from '@/components/layout/PromoBar.vue'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import MobileOrderBar from '@/components/layout/MobileOrderBar.vue'
import ToastNotice from '@/components/layout/ToastNotice.vue'
</script>

<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <PromoBar />
  <SiteHeader />
  <main id="main">
    <RouterView />
  </main>
  <SiteFooter />
  <MobileOrderBar />
  <ToastNotice />
</template>
