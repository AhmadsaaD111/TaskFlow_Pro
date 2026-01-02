<template>
  <label class="block">
    <span v-if="label" class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-200">{{ label }}</span>
    <select
      :value="modelValue"
      :class="[
        'w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition',
        'border-slate-200 text-slate-900 focus:ring-2 focus:ring-slate-900/15',
        'dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:ring-slate-100/15',
        error ? 'border-rose-400 focus:ring-rose-500/15 dark:border-rose-600' : '',
      ]"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="opt in options" :key="opt.value" :value="opt.value" :disabled="opt.disabled">
        {{ opt.label }}
      </option>
    </select>
    <p v-if="error" class="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">{{ error }}</p>
  </label>
</template>

<script setup lang="ts">
type Option = { value: string; label: string; disabled?: boolean }

type Props = {
  modelValue: string
  label?: string
  error?: string
  options: Option[]
}

defineProps<Props>()

defineEmits<{ (e: 'update:modelValue', value: string): void }>()
</script>
