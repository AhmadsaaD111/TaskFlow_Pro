<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition',
      variantClasses,
      disabled || loading ? 'cursor-not-allowed opacity-60' : 'hover:brightness-[0.98] active:brightness-95',
      full ? 'w-full' : '',
    ]"
  >
    <span
      v-if="loading"
      class="h-4 w-4 animate-spin rounded-full border-2 border-current border-b-transparent"
    />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

type Props = {
  variant?: Variant
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  full?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'button',
  disabled: false,
  loading: false,
  full: false,
})

const variantClasses = computed(() => {
  if (props.variant === 'secondary') {
    return 'border border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50'
  }

  if (props.variant === 'ghost') {
    return 'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
  }

  if (props.variant === 'danger') {
    return 'bg-rose-600 text-white hover:bg-rose-500'
  }

  return 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white'
})
</script>
