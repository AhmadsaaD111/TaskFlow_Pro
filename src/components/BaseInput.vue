<template>
  <label class="block">
    <span v-if="label" class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-200">{{ label }}</span>
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :class="[
        'w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition',
        'border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/15',
        'dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:ring-slate-100/15',
        error ? 'border-rose-400 focus:ring-rose-500/15 dark:border-rose-600' : '',
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="hint" class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ hint }}</p>
    <p v-if="error" class="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">{{ error }}</p>
  </label>
</template>

<script setup lang="ts">
type Props = {
  modelValue: string
  label?: string
  hint?: string
  error?: string
  type?: string
  placeholder?: string
  autocomplete?: string
}

defineProps<Props>()

defineEmits<{ (e: 'update:modelValue', value: string): void }>()
</script>
