<template>
  <BaseModal :open="open" :title="title" subtitle="Update fields and add a quick comment." @close="$emit('close')">
    <div v-if="!task" class="text-sm text-slate-600 dark:text-slate-300">Task not found.</div>

    <div v-else class="flex flex-col gap-5">
      <div class="grid gap-3 sm:grid-cols-2">
        <BaseSelect v-model="status" label="Status" :options="statusOptions" />
        <BaseSelect v-model="priority" label="Priority" :options="priorityOptions" />
      </div>

      <BaseInput v-model="titleInput" label="Title" :error="errors.title" />
      <BaseTextarea v-model="description" label="Description" />

      <div class="grid gap-3 sm:grid-cols-2">
        <BaseSelect v-model="assigneeId" label="Assignee" :options="assigneeOptions" />
        <BaseInput v-model="dueDate" label="Due date" type="date" />
      </div>

      <div class="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
        <div class="text-xs font-semibold text-slate-700 dark:text-slate-200">Comments</div>

        <div v-if="commentsLoading" class="mt-3 text-sm text-slate-600 dark:text-slate-300">Loading comments…</div>

        <div v-else class="mt-3 flex flex-col gap-3">
          <div v-for="c in comments" :key="c.id" class="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <div class="text-xs font-semibold">{{ authorName(c.authorId) }}</div>
            <div class="mt-1 text-sm text-slate-700 dark:text-slate-200">{{ c.message }}</div>
            <div class="mt-2 text-[11px] text-slate-500 dark:text-slate-400">{{ formatTime(c.createdAt) }}</div>
          </div>

          <div v-if="!comments.length" class="text-sm text-slate-600 dark:text-slate-300">
            No comments yet. Add the first update.
          </div>
        </div>

        <form class="mt-4 flex gap-2" @submit.prevent="onAddComment">
          <input
            v-model="comment"
            :disabled="!perms.can('tasks:update')"
            class="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-800 dark:bg-slate-900 dark:focus:ring-slate-100/10"
            placeholder="Write a quick update"
          />
          <BaseButton type="submit" variant="secondary" :disabled="!perms.can('tasks:update')">Send</BaseButton>
        </form>
      </div>
    </div>

    <template #footer>
      <div class="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <BaseButton variant="danger" :loading="tasks.loading" type="button" @click="onDelete">Delete</BaseButton>
        <div class="flex flex-col gap-2 sm:flex-row">
          <BaseButton variant="secondary" type="button" @click="$emit('close')">Close</BaseButton>
          <BaseButton :loading="tasks.loading" type="button" :disabled="!perms.can('tasks:update')" @click="onSave">Save</BaseButton>
        </div>
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

import { usePermissions } from '@/modules/auth/permissions'
import { useTasksStore } from '@/modules/tasks/store'
import type { User } from '@/types/auth'
import type { Task, TaskPriority, TaskStatus } from '@/types/tasks'

const props = defineProps<{
  open: boolean
  projectId: string
  taskId: string | null
  members: User[]
  tasksByProject: Task[]
}>()

const emit = defineEmits<{ (e: 'close'): void; (e: 'updated'): void }>()

const tasks = useTasksStore()
const perms = usePermissions()

const comment = ref('')
const commentsLoading = ref(false)

const titleInput = ref('')
const description = ref('')
const status = ref<TaskStatus>('todo')
const priority = ref<TaskPriority>('medium')
const assigneeId = ref('')
const dueDate = ref('')

const errors = reactive<{ title?: string }>({})

const task = computed(() => props.tasksByProject.find((t) => t.id === props.taskId) ?? null)

const title = computed(() => task.value?.title ?? 'Task details')

const comments = computed(() => (props.taskId ? tasks.commentsByTaskId[props.taskId] ?? [] : []))

watch(
  () => props.open,
  async (open) => {
    if (!open) return

    errors.title = undefined
    comment.value = ''

    if (task.value) {
      titleInput.value = task.value.title
      description.value = task.value.description
      status.value = task.value.status
      priority.value = task.value.priority
      assigneeId.value = task.value.assigneeId ?? ''
      dueDate.value = task.value.dueDate ? isoToDateInput(task.value.dueDate) : ''
    }

    if (props.taskId) {
      commentsLoading.value = true
      await tasks.fetchComments(props.taskId)
      commentsLoading.value = false
    }
  },
)

const statusOptions = computed(() => [
  { value: 'todo', label: 'To do' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
])

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
  if (!titleInput.value.trim()) errors.title = 'Title is required.'
  return !errors.title
}

async function onSave() {
  if (!props.taskId) return
  if (!validate()) return

  const updated = await tasks.update(props.projectId, props.taskId, {
    title: titleInput.value,
    description: description.value,
    status: status.value,
    priority: priority.value,
    assigneeId: assigneeId.value || undefined,
    dueDate: dueDate.value ? new Date(dueDate.value).toISOString() : undefined,
  })

  if (updated) emit('updated')
}

async function onDelete() {
  if (!props.taskId) return

  const ok = window.confirm('Delete this task?')
  if (!ok) return

  const removed = await tasks.remove(props.projectId, props.taskId)
  if (removed) {
    emit('updated')
    emit('close')
  }
}

async function onAddComment() {
  if (!props.taskId) return
  const message = comment.value.trim()
  if (!message) return

  const created = await tasks.addComment(props.taskId, message)
  if (created) comment.value = ''
}

function authorName(userId: string) {
  return props.members.find((m) => m.id === userId)?.name ?? 'Unknown'
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function isoToDateInput(iso: string) {
  const d = new Date(iso)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
</script>
