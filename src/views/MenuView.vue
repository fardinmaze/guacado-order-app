<script setup>
import MenuSection from '@/components/sections/MenuSection.vue'
import HouseFavorites from '@/components/sections/HouseFavorites.vue'
import FamilyKits from '@/components/sections/FamilyKits.vue'
</script>

<template>
  <MenuSection />
  <HouseFavorites :show-link="false" />
  <FamilyKits :alt="false" />
</template>
