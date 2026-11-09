<script setup>
import { ref } from 'vue'
import menu from '@/data/menu.json'
import { favoriteCopy } from '@/data/site'
import { illustrations } from '@/assets/illustrations'
import { useMotion, revealCards, revealHeads, tiltCards } from '@/composables/useMotion'
import SectionHead from '@/components/ui/SectionHead.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import FeaturePanel from '@/components/ui/FeaturePanel.vue'

defineProps({ showLink: { type: Boolean, default: true } })

const root = ref(null)

// Normalise featured items: multi-price (label/price) or a single `price`.
// Meta line = first option phrase ("Soft or Crispy") or the item's section, then calories.
const panels = menu.featured.map((f) => {
  const copy = favoriteCopy[f.name] ?? {}
  return {
    title: f.name,
    meta: `${copy.meta ?? f.options?.split(' · ')[0] ?? f.section} · ${f.calories}`,
    image: illustrations[copy.image],
    text: copy.text ?? f.description,
    prices: f.prices ?? [{ price: f.price }],
  }
})

const kids = menu.kidsMeal
const kidsCalories = kids.items.map((i) => i.calories)

useMotion(root, ({ gsap, root: el }) => {
  revealHeads(el)
  revealCards()
  gsap.from(el.querySelectorAll('.panel__img'), {
    scale: 0.6,
    rotate: -14,
    duration: 1,
    ease: 'back.out(1.6)',
    stagger: 0.12,
    scrollTrigger: { trigger: el.querySelector('.fav'), start: 'top 80%' },
  })
  return tiltCards(el, '[data-panel]')
})
</script>

<template>
  <section id="favorites" ref="root" class="band band--alt">
    <div class="wrap">
      <div class="fav__head">
        <SectionHead eyebrow="Off the board" title="House favorites" />
        <BaseButton v-if="showLink" variant="ghost" to="/menu">FULL MENU</BaseButton>
      </div>
      <div class="fav">
        <FeaturePanel v-for="p in panels" :key="p.title" :title="p.title" :meta="p.meta" :image="p.image" :prices="p.prices">
          {{ p.text }}
        </FeaturePanel>
        <FeaturePanel
          kid
          title="Kids Meal"
          :meta="kids.note"
          :image="illustrations.guac"
          :prices="[{ label: 'Either', price: kids.items[0].price }]"
        >
          <b>Create Your Own</b> ({{ kidsCalories[0] }}): a meat or guac and two toppings with two soft or crispy
          tortillas. Or a <b>Cheese Quesadilla</b> ({{ kidsCalories[1] }}).
        </FeaturePanel>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fav__head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: end; gap: 20px; margin-bottom: 40px; }
.fav { display: grid; gap: 20px; }
@media (min-width: 760px) { .fav { grid-template-columns: 1fr 1fr; } }
</style>
