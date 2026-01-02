<template>
  <button
    type="button"
    class="w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
    @click="$emit('open', task.id)"
  >
    <div class="flex items-start justify-between gap-3">
      <div>
        <div class="text-sm font-semibold">{{ task.title }}</div>
        <div class="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-300">
          {{ task.description || 'No description yet.' }}
        </div>
      </div>
      <span class="rounded-full px-2 py-1 text-[11px] font-semibold" :class="priorityClasses">
        {{ priorityLabel }}
      </span>
    </div>

    <div class="mt-3 flex items-center justify-between">
      <div class="text-xs text-slate-500 dark:text-slate-400">
        <span v-if="task.dueDate">Due {{ dueLabel }}</span>
        <span v-else>Unscheduled</span>
      </div>

      <div v-if="assignee" class="flex items-center gap-2">
        <BaseAvatar :name="assignee.name" :color="assignee.avatarColor" />
        <div class="hidden text-xs font-semibold text-slate-700 dark:text-slate-200 sm:block">
          {{ assignee.name.split(' ')[0] }}
        </div>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import BaseAvatar from '@/components/BaseAvatar.vue'

import type { Task } from '@/types/tasks'
import type { User } from '@/types/auth'

const props = defineProps<{ task: Task; assignee?: User | null }>()

defineEmits<{ (e: 'open', taskId: string): void }>()

const priorityLabel = computed(() => {
  if (props.task.priority === 'high') return 'High'
  if (props.task.priority === 'low') return 'Low'
  return 'Medium'
})

const priorityClasses = computed(() => {
  if (props.task.priority === 'high') return 'bg-rose-100 text-rose-900 dark:bg-rose-500/15 dark:text-rose-200'
  if (props.task.priority === 'low') return 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
  return 'bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-200'
})

const dueLabel = computed(() => {
  if (!props.task.dueDate) return ''
  const d = new Date(props.task.dueDate)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
})
</script>
