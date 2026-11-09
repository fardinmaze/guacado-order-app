<script setup>
import HeroSection from '@/components/sections/HeroSection.vue'
import MarqueeStrip from '@/components/sections/MarqueeStrip.vue'
import TacoScroll from '@/components/sections/TacoScroll.vue'
import BuildYourOwn from '@/components/sections/BuildYourOwn.vue'
import HouseFavorites from '@/components/sections/HouseFavorites.vue'
import MenuSection from '@/components/sections/MenuSection.vue'
import FamilyKits from '@/components/sections/FamilyKits.vue'
import CateringBand from '@/components/sections/CateringBand.vue'
import LocationsSection from '@/components/sections/LocationsSection.vue'
import JoinFranchise from '@/components/sections/JoinFranchise.vue'
</script>

<template>
  <!-- Section order per BRAND.md §8. Rhythm: ground > surface > ground ... with one guac band. -->
  <HeroSection />
  <MarqueeStrip />
  <TacoScroll />
  <BuildYourOwn />
  <HouseFavorites />
  <MenuSection />
  <FamilyKits />
  <CateringBand />
  <LocationsSection />
  <JoinFranchise />
</template>
