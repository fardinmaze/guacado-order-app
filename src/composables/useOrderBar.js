import { readonly, ref } from 'vue'

// Module-level singleton: the builder publishes its running order here while it is
// in view, and the mobile order bar shows it instead of the generic "Order now".
const current = ref(null) // { label, total } | null

export function useOrderBar() {
  return {
    current: readonly(current),
    set: (order) => (current.value = order),
    clear: () => (current.value = null),
  }
}
