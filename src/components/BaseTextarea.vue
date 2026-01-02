<template>
  <label class="block">
    <span v-if="label" class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-200">{{ label }}</span>
    <textarea
      :value="modelValue"
      :rows="rows"
      :placeholder="placeholder"
      :class="[
        'w-full resize-none rounded-lg border bg-white px-3 py-2 text-sm outline-none transition',
        'border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/15',
        'dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:ring-slate-100/15',
        error ? 'border-rose-400 focus:ring-rose-500/15 dark:border-rose-600' : '',
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <p v-if="error" class="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">{{ error }}</p>
  </label>
</template>

<script setup lang="ts">
type Props = {
  modelValue: string
  label?: string
  error?: string
  placeholder?: string
  rows?: number
}

withDefaults(defineProps<Props>(), {
  label: undefined,
  error: undefined,
  placeholder: undefined,
  rows: 4,
})

defineEmits<{ (e: 'update:modelValue', value: string): void }>()
</script>
