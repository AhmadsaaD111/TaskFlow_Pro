<template>
  <div class="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(420px,calc(100vw-2rem))] flex-col gap-2">
    <div
      v-for="t in toasts.items"
      :key="t.id"
      class="pointer-events-auto rounded-xl border px-4 py-3 shadow-lg"
      :class="
        t.type === 'success'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-100'
          : 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-100'
      "
    >
      <div class="flex items-start justify-between gap-3">
        <div class="text-sm font-semibold">
          {{ t.type === 'success' ? 'Success' : 'Error' }}
        </div>
        <button
          type="button"
          class="rounded-md px-2 py-1 text-xs font-semibold opacity-70 hover:opacity-100"
          @click="toasts.dismiss(t.id)"
        >
          Close
        </button>
      </div>
      <div class="mt-1 text-sm opacity-90">
        {{ t.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToastsStore } from '@/store/toasts'

const toasts = useToastsStore()
</script>
