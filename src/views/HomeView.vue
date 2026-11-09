<script setup>
import HeroPromo from '@/components/sections/HeroPromo.vue'
import CategoryGrid from '@/components/sections/CategoryGrid.vue'
import BuildYourOwn from '@/components/sections/BuildYourOwn.vue'
import UpsellBand from '@/components/sections/UpsellBand.vue'
import CrowdPleasers from '@/components/sections/CrowdPleasers.vue'
import LocationsSection from '@/components/sections/LocationsSection.vue'
import JoinFranchise from '@/components/sections/JoinFranchise.vue'
</script>

<template>
  <!-- Sales funnel: offer > choose a category > customise > add-ons > group orders > where to pick up. -->
  <HeroPromo />
  <CategoryGrid />
  <BuildYourOwn />
  <UpsellBand />
  <CrowdPleasers />
  <LocationsSection :limit="6" />
  <JoinFranchise />
</template>
