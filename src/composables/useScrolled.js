import { onBeforeUnmount, onMounted, ref } from 'vue'

/** True once the page has scrolled past `threshold` px. */
export function useScrolled(threshold = 10) {
  const scrolled = ref(false)
  const update = () => (scrolled.value = window.scrollY > threshold)
  onMounted(() => {
    update()
    window.addEventListener('scroll', update, { passive: true })
  })
  onBeforeUnmount(() => window.removeEventListener('scroll', update))
  return scrolled
}
