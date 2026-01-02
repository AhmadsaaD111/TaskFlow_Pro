import { ref } from 'vue'
import { defineStore } from 'pinia'

import type { ApiError } from '@/types/api'

type ToastType = 'success' | 'error'

export type Toast = {
  id: string
  type: ToastType
  message: string
  createdAt: number
}

export const useToastsStore = defineStore('toasts', () => {
  const items = ref<Toast[]>([])

  function push(type: ToastType, message: string, options: { timeoutMs?: number } = {}) {
    const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`
    const toast: Toast = { id, type, message, createdAt: Date.now() }

    items.value = [toast, ...items.value]

    const timeoutMs = options.timeoutMs ?? (type === 'error' ? 6000 : 3500)
    window.setTimeout(() => {
      items.value = items.value.filter((t) => t.id !== id)
    }, timeoutMs)

    return id
  }

  function dismiss(id: string) {
    items.value = items.value.filter((t) => t.id !== id)
  }

  function success(message: string) {
    push('success', message)
  }

  function error(err: unknown, fallbackMessage = 'Something went wrong. Please try again.') {
    const api = asApiError(err)
    push('error', api?.message ?? fallbackMessage)
  }

  return {
    items,
    push,
    dismiss,
    success,
    error,
  }
})

function asApiError(err: unknown): ApiError | null {
  if (!err || typeof err !== 'object') return null
  if (!('code' in err) || !('message' in err)) return null
  const code = (err as { code?: unknown }).code
  const message = (err as { message?: unknown }).message
  if (typeof code !== 'string' || typeof message !== 'string') return null
  return err as ApiError
}
