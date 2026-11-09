import { readonly, ref } from 'vue'

// Module-level singleton: any component can raise the toast.
const message = ref('')
const visible = ref(false)
let timer

export function useToast() {
  function show(text, ms = 1800) {
    message.value = text
    visible.value = true
    clearTimeout(timer)
    timer = setTimeout(() => (visible.value = false), ms)
  }
  return { message: readonly(message), visible: readonly(visible), show }
}
