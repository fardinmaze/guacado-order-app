<script setup>
import { ref } from 'vue'
import menu from '@/data/menu.json'
import { advisory } from '@/data/site'
import { useMotion, revealHeads } from '@/composables/useMotion'
import SectionHead from '@/components/ui/SectionHead.vue'
import MenuBlock from '@/components/ui/MenuBlock.vue'
import MenuRow from '@/components/ui/MenuRow.vue'

const root = ref(null)

const priceList = (item) => item.prices ?? [item.price]
const shake = (b) => b.flavors ?? []

const bases = menu.buildYourOwn.bases.map((b) => b.toLowerCase()).join(', ').replace(/, ([^,]+)$/, ' or $1')

useMotion(root, ({ gsap, root: el }) => {
  revealHeads(el)
  el.querySelectorAll('[data-block]').forEach((block) => {
    gsap.from(block.querySelector('.tag'), {
      scale: 0.7,
      rotate: -8,
      duration: 0.7,
      ease: 'back.out(2)',
      scrollTrigger: { trigger: block, start: 'top 85%' },
    })
    gsap.from(block.querySelectorAll('[data-row]'), {
      x: -24,
      opacity: 0.15,
      duration: 0.5,
      stagger: 0.04,
      ease: 'power2.out',
      scrollTrigger: { trigger: block, start: 'top 82%' },
    })
  })
})
</script>

<template>
  <section id="menu" ref="root" class="band">
    <div class="wrap">
      <SectionHead eyebrow="The whole board" title="Menu" />

      <div class="menu__grid">
        <MenuBlock title="Proteins" :sub="`Priced with any base: ${bases}`">
          <MenuRow v-for="p in menu.buildYourOwn.proteins" :key="p.name" :name="p.name" :prices="[p.price]" />
        </MenuBlock>

        <MenuBlock title="Sides">
          <MenuRow v-for="s in menu.sides" :key="s.name" :name="s.name" :calories="s.calories" :prices="[s.price]" />
          <div class="sizes" aria-hidden="true"><span>4OZ</span><span>|</span><span>8OZ</span></div>
          <MenuRow v-for="d in menu.dips.items" :key="d.name" :name="d.name" :calories="d.calories" :prices="d.prices" />
        </MenuBlock>

        <MenuBlock title="Beverages">
          <MenuRow v-for="b in menu.beverages" :key="b.name" :name="b.name" :prices="priceList(b)" :flavors="shake(b)" />
        </MenuBlock>

        <MenuBlock title="Desserts">
          <MenuRow v-for="d in menu.desserts" :key="d.name" :name="d.name" :prices="[d.price]" />
        </MenuBlock>
      </div>

      <p class="advisory">{{ advisory }}</p>
    </div>
  </section>
</template>

<style scoped>
.menu__grid { display: grid; gap: clamp(40px, 5vw, 64px) clamp(32px, 5vw, 80px); margin-top: 48px; }
@media (min-width: 900px) { .menu__grid { grid-template-columns: 1fr 1fr; } }
.sizes {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  font-family: var(--f-cond);
  letter-spacing: 2px;
  color: var(--ink-muted);
  font-size: 15px;
  padding: 4px 0 2px;
}
.advisory { margin-top: 48px; font-size: 13px; color: var(--ink-muted); max-width: 90ch; line-height: 1.6; border-top: 1px solid var(--line); padding-top: 20px; }
</style>
