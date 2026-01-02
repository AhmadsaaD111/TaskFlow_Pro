<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div class="absolute inset-0 bg-black/50" @click="$emit('close')" />
      <div
        class="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900"
      >
        <header class="flex items-start justify-between gap-6 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div>
            <div class="text-sm font-semibold">{{ title }}</div>
            <div v-if="subtitle" class="mt-1 text-xs text-slate-600 dark:text-slate-300">{{ subtitle }}</div>
          </div>
          <button
            type="button"
            class="rounded-lg px-2 py-1 text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            @click="$emit('close')"
          >
            Close
          </button>
        </header>

        <div class="px-5 py-4">
          <slot />
        </div>

        <footer v-if="$slots.footer" class="border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
type Props = {
  open: boolean
  title: string
  subtitle?: string
}

defineProps<Props>()

defineEmits<{ (e: 'close'): void }>()
</script>
