<template>
  <BaseModal :open="open" title="Create task" subtitle="Add a new task to the kanban board." @close="$emit('close')">
    <form id="taskCreateForm" class="flex flex-col gap-4" @submit.prevent="onSubmit">
      <BaseInput v-model="title" label="Title" placeholder="e.g. Prepare sprint planning" :error="errors.title" />
      <BaseTextarea v-model="description" label="Description" placeholder="What needs to be delivered?" />

      <div class="grid gap-3 sm:grid-cols-2">
        <BaseSelect v-model="priority" label="Priority" :options="priorityOptions" />
        <BaseSelect v-model="assigneeId" label="Assignee" :options="assigneeOptions" />
      </div>

      <BaseInput v-model="dueDate" label="Due date" type="date" />
    </form>

    <template #footer>
      <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <BaseButton variant="secondary" type="button" @click="$emit('close')">Cancel</BaseButton>
        <BaseButton type="submit" form="taskCreateForm" :loading="tasks.loading">Create</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'

import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseModal from '@/components/BaseModal.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import BaseTextarea from '@/components/BaseTextarea.vue'

import type { User } from '@/types/auth'
import type { TaskPriority } from '@/types/tasks'
import { useTasksStore } from '@/modules/tasks/store'
import { useToastsStore } from '@/store/toasts'

const props = defineProps<{ open: boolean; projectId: string; members: User[] }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'created'): void }>()

const tasks = useTasksStore()
const toasts = useToastsStore()

const title = ref('')
const description = ref('')
const priority = ref<TaskPriority>('medium')
const assigneeId = ref('')
const dueDate = ref('')

const errors = reactive<{ title?: string }>({})

watch(
  () => props.open,
  (open) => {
    if (!open) return
    title.value = ''
    description.value = ''
    priority.value = 'medium'
    assigneeId.value = ''
    dueDate.value = ''
    errors.title = undefined
  },
)

const priorityOptions = computed(() => [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
])

const assigneeOptions = computed(() => {
  const base = [{ value: '', label: 'Unassigned' }]
  return base.concat(props.members.map((m) => ({ value: m.id, label: m.name })))
})

function validate() {
  errors.title = undefined
  if (!title.value.trim()) errors.title = 'Task title is required.'
  return !errors.title
}

async function onSubmit() {
  if (!validate()) return

  const created = await tasks.create(props.projectId, {
    title: title.value,
    description: description.value,
    priority: priority.value,
    dueDate: dueDate.value ? new Date(dueDate.value).toISOString() : undefined,
    assigneeId: assigneeId.value || undefined,
  })

  if (created) {
    toasts.success('Task created.')
    emit('created')
    emit('close')
  }
}
</script>
