<template>
  <div v-if="loading" class="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
    <div class="text-sm font-semibold">Loading board…</div>
    <div class="mt-1 text-sm text-slate-600 dark:text-slate-300">Preparing tasks and members.</div>
  </div>

  <div v-else-if="projects.error" class="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
    <div class="text-sm font-semibold">Couldn’t load project</div>
    <div class="mt-1 text-sm">Please try again.</div>
  </div>

  <div v-else class="flex flex-col gap-5">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div class="text-sm font-semibold">{{ project?.name || 'Kanban board' }}</div>
        <div class="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Drag tasks across stages. Changes are persisted in the mocked REST API.
        </div>
      </div>

      <BaseButton v-if="perms.can('tasks:create')" @click="taskFormOpen = true">Create task</BaseButton>
    </div>

    <div class="flex flex-col gap-3 lg:flex-row">
      <BaseInput v-model="taskSearchInput" label="Search" placeholder="Search by task title" />
      <BaseSelect v-model="statusFilter" label="Status" :options="statusOptions" />
      <BaseSelect v-model="assigneeFilter" label="Assignee" :options="assigneeOptions" />
    </div>

    <div class="grid gap-4 lg:grid-cols-3">
      <div v-for="col in columns" :key="col.key" class="rounded-2xl border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div>
            <div class="text-sm font-semibold">{{ col.title }}</div>
            <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ col.items.length }} tasks</div>
          </div>
        </div>

        <div class="p-4">
          <Draggable
            :list="col.items"
            group="tasks"
            item-key="id"
            class="flex min-h-[140px] flex-col gap-3"
            :disabled="!perms.can('tasks:update')"
            @change="(evt) => onDragChange(col.key, evt)"
          >
            <template #item="{ element }">
              <TaskCard
                :task="element"
                :assignee="element.assigneeId ? users.byId[element.assigneeId] : null"
                @open="openDetails"
              />
            </template>

            <template #footer>
              <div
                v-if="!col.items.length"
                class="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
              >
                Drop tasks here
              </div>
            </template>
          </Draggable>
        </div>
      </div>
    </div>

    <TaskFormModal
      :open="taskFormOpen"
      :project-id="projectId"
      :members="members"
      @close="taskFormOpen = false"
      @created="onCreated"
    />

    <TaskDetailsModal
      :open="detailsOpen"
      :project-id="projectId"
      :task-id="selectedTaskId"
      :members="members"
      :tasks-by-project="allTasks"
      @close="closeDetails"
      @updated="onUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import Draggable from 'vuedraggable'

import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'

import { useProjectsStore } from '@/modules/projects/store'
import { useProjectActivityStore } from '@/modules/projects/activityStore'
import { useTasksStore } from '@/modules/tasks/store'
import { useUsersStore } from '@/modules/users/store'
import { usePermissions } from '@/modules/auth/permissions'

import TaskCard from '@/modules/tasks/components/TaskCard.vue'
import TaskDetailsModal from '@/modules/tasks/components/TaskDetailsModal.vue'
import TaskFormModal from '@/modules/tasks/components/TaskFormModal.vue'

import type { Task, TaskStatus } from '@/types/tasks'

import { debounce } from '@/utils/debounce'

const route = useRoute()

const projects = useProjectsStore()
const activity = useProjectActivityStore()
const tasks = useTasksStore()
const users = useUsersStore()
const perms = usePermissions()

const loading = ref(true)
const taskFormOpen = ref(false)

const detailsOpen = ref(false)
const selectedTaskId = ref<string | null>(null)

const projectId = computed(() => String(route.params.id))

const project = computed(() => projects.byId[projectId.value])

const members = computed(() => users.membersForProjects)

const allTasks = computed<Task[]>(() => tasks.byProjectId[projectId.value] ?? [])

const taskSearchInput = ref('')
const taskSearch = ref('')
const statusFilter = ref<'all' | TaskStatus>('all')
const assigneeFilter = ref<string>('all')

const applyTaskSearch = debounce((value: string) => {
  taskSearch.value = value
}, 250)

watch(taskSearchInput, (value) => {
  applyTaskSearch(value)
})

const statusOptions = computed(() => [
  { value: 'all', label: 'All' },
  { value: 'todo', label: 'To do' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
])

const assigneeOptions = computed(() => {
  const base = [{ value: 'all', label: 'All' }, { value: 'unassigned', label: 'Unassigned' }]
  return base.concat(members.value.map((m) => ({ value: m.id, label: m.name })))
})

const filteredTasks = computed(() => {
  const q = taskSearch.value.trim().toLowerCase()
  return allTasks.value.filter((t) => {
    const matchesQuery = !q || t.title.toLowerCase().includes(q)

    const matchesStatus = statusFilter.value === 'all' ? true : t.status === statusFilter.value

    const matchesAssignee =
      assigneeFilter.value === 'all'
        ? true
        : assigneeFilter.value === 'unassigned'
          ? !t.assigneeId
          : t.assigneeId === assigneeFilter.value

    return matchesQuery && matchesStatus && matchesAssignee
  })
})

const localTodo = ref<Task[]>([])
const localInProgress = ref<Task[]>([])
const localDone = ref<Task[]>([])

const columns = computed(() => [
  { key: 'todo' as const, title: 'To do', items: localTodo.value },
  { key: 'in_progress' as const, title: 'In progress', items: localInProgress.value },
  { key: 'done' as const, title: 'Done', items: localDone.value },
])

function syncColumns(list: Task[]) {
  localTodo.value = list.filter((t) => t.status === 'todo')
  localInProgress.value = list.filter((t) => t.status === 'in_progress')
  localDone.value = list.filter((t) => t.status === 'done')
}

onMounted(async () => {
  await users.fetchMembersIfNeeded()
  await projects.fetchById(projectId.value)
  await tasks.fetchForProject(projectId.value)
  syncColumns(allTasks.value)
  loading.value = false
})

watch([allTasks, filteredTasks], () => {
  syncColumns(filteredTasks.value)
})

async function onDragChange(status: TaskStatus, evt: { added?: { element: Task } }) {
  if (!evt.added) return

  await tasks.move(projectId.value, evt.added.element.id, status)
  await tasks.fetchForProject(projectId.value)
  await activity.fetchForProject(projectId.value)
}

function onCreated() {
  tasks.fetchForProject(projectId.value)
  activity.fetchForProject(projectId.value)
}

function onUpdated() {
  tasks.fetchForProject(projectId.value)
  activity.fetchForProject(projectId.value)
}

function openDetails(taskId: string) {
  selectedTaskId.value = taskId
  detailsOpen.value = true
}

function closeDetails() {
  detailsOpen.value = false
  selectedTaskId.value = null
}
</script>
