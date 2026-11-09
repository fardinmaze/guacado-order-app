import { useToast } from './useToast'

/** Copy text; falls back to selecting the node so the guest can press Ctrl+C. */
export function useCopyToClipboard() {
  const toast = useToast()

  async function copy(text, { fallbackEl, success = 'Email copied' } = {}) {
    try {
      await navigator.clipboard.writeText(text)
      toast.show(success)
    } catch {
      if (fallbackEl) {
        const range = document.createRange()
        range.selectNodeContents(fallbackEl)
        const sel = getSelection()
        sel.removeAllRanges()
        sel.addRange(range)
      }
      toast.show('Selected. Press Ctrl+C to copy')
    }
  }
  return { copy }
}
