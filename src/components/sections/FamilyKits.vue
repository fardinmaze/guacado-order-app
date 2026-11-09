<script setup>
import { ref } from 'vue'
import menu from '@/data/menu.json'
import { useMotion, revealCards, revealHeads, tiltCards } from '@/composables/useMotion'
import KitCard from '@/components/ui/KitCard.vue'

defineProps({ alt: { type: Boolean, default: true } })

const kits = menu.familyKits
const root = ref(null)

useMotion(root, ({ root: el }) => {
  revealHeads(el)
  revealCards()
  return tiltCards(el, '[data-kit]')
})
</script>

<template>
  <section id="kits" ref="root" class="band" :class="{ 'band--alt': alt }">
    <div class="wrap">
      <div class="kits__head">
        <span class="eyebrow">For the whole crew</span>
        <h2 class="fk" data-reveal>Family Kit<em>{{ kits.serves.toUpperCase() }}</em></h2>
      </div>
      <div class="kits">
        <KitCard v-for="k in kits.items" :key="k.name" :name="k.name" :price="k.price" :calories="k.calories" :includes="k.includes" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.kits__head { display: grid; gap: 8px; margin-bottom: 40px; }
.fk { font-family: var(--f-script); font-size: clamp(56px, 9vw, 112px); line-height: 0.9; color: var(--ink); }
.fk em {
  font-style: normal;
  font-family: var(--f-cond);
  font-size: clamp(20px, 2.4vw, 28px);
  letter-spacing: 2px;
  color: var(--lime);
  margin-left: 14px;
  vertical-align: middle;
}
.kits { display: grid; gap: 18px; }
@media (min-width: 900px) { .kits { grid-template-columns: repeat(3, 1fr); } }
</style>
