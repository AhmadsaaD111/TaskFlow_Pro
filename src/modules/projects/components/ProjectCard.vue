<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
    <div class="flex items-start justify-between gap-4">
      <div>
        <div class="text-sm font-semibold">{{ project.name }}</div>
        <div class="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
          {{ project.description || 'No description yet.' }}
        </div>
      </div>
      <span
        class="rounded-full px-2 py-1 text-xs font-semibold"
        :class="statusClasses"
      >
        {{ statusLabel }}
      </span>
    </div>

    <div class="mt-4 flex items-center justify-between">
      <div class="text-xs text-slate-500 dark:text-slate-400">Updated {{ updatedLabel }}</div>
      <RouterLink
        class="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        :to="`/app/projects/${project.id}`"
      >
        Open
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '@/types/projects'

const props = defineProps<{ project: Project }>()

const statusLabel = computed(() => {
  if (props.project.status === 'paused') return 'Paused'
  if (props.project.status === 'completed') return 'Completed'
  return 'Active'
})

const statusClasses = computed(() => {
  if (props.project.status === 'paused') {
    return 'bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-200'
  }
  if (props.project.status === 'completed') {
    return 'bg-emerald-100 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-200'
  }
  return 'bg-sky-100 text-sky-900 dark:bg-sky-500/15 dark:text-sky-200'
})

const updatedLabel = computed(() => {
  const d = new Date(props.project.updatedAt)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
})
</script>
