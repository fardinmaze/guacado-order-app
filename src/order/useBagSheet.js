import { ref } from 'vue'

// Whether the bag sheet is open. Module-level so the header button and the sticky bars share it.
const open = ref(false)
export function useBagSheet() {
  return { open, show: () => (open.value = true), hide: () => (open.value = false) }
}
