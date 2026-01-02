<template>
  <div
    class="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
    :style="{ backgroundColor: color }"
    :title="name"
  >
    {{ initials }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Props = {
  name: string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: '#64748b',
})

const initials = computed(() => {
  const parts = props.name.trim().split(/\s+/).slice(0, 2)
  const chars = parts.map((p) => p.charAt(0).toUpperCase())
  return chars.join('') || 'U'
})
</script>
