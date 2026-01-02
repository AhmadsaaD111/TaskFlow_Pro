<template>
  <div v-if="loading" class="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
    <div class="text-sm font-semibold">Loading project…</div>
    <div class="mt-1 text-sm text-slate-600 dark:text-slate-300">Getting project details and membership.</div>
  </div>

  <div v-else-if="!project" class="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
    <div class="text-sm font-semibold">Project not found</div>
    <div class="mt-1 text-sm">The project might have been removed or you no longer have access.</div>
    <div class="mt-4">
      <BaseButton variant="secondary" @click="router.push({ name: 'projects' })">Back to projects</BaseButton>
    </div>
  </div>

  <div v-else class="flex flex-col gap-6">
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div class="text-lg font-semibold">{{ project.name }}</div>
          <div class="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {{ project.description || 'No description yet.' }}
          </div>

          <div class="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <span class="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-100">
              {{ statusLabel }}
            </span>
            <span>Updated {{ updatedLabel }}</span>
          </div>
        </div>

        <div class="flex flex-col gap-2 sm:flex-row">
          <BaseButton v-if="perms.can('projects:update')" variant="secondary" @click="openEdit">Edit</BaseButton>
          <BaseButton v-if="perms.can('projects:delete')" variant="danger" :loading="projects.loading" @click="onDelete">Delete</BaseButton>
          <RouterLink
            :to="`/app/projects/${project.id}/board`"
            class="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            Open board
          </RouterLink>
        </div>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-sm font-semibold">Activity</div>
          <div class="mt-1 text-sm text-slate-600 dark:text-slate-300">Recent changes for this project.</div>
        </div>
        <BaseButton variant="secondary" :loading="activity.loading" @click="activity.fetchForProject(projectId)">Refresh</BaseButton>
      </div>

      <div v-if="activity.loading" class="mt-4 text-sm text-slate-600 dark:text-slate-300">Loading activity…</div>

      <div v-else class="mt-4 flex flex-col gap-3">
        <div
          v-for="e in activityItems"
          :key="e.id"
          class="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
        >
          <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div class="font-semibold">{{ e.description }}</div>
            <div class="text-xs text-slate-500 dark:text-slate-400">{{ formatTime(e.createdAt) }}</div>
          </div>
          <div class="mt-2 text-xs text-slate-600 dark:text-slate-300">
            {{ actorLabel(e.actorId) }} ({{ e.actorRole }})
          </div>
        </div>

        <div v-if="!activityItems.length" class="text-sm text-slate-600 dark:text-slate-300">No activity recorded yet.</div>
      </div>
    </div>

    <div class="grid gap-4 lg:grid-cols-3">
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div class="text-xs font-semibold text-slate-500 dark:text-slate-400">Members</div>
        <div class="mt-4 flex flex-col gap-3">
          <div v-for="m in projectMembers" :key="m.id" class="flex items-center gap-3">
            <BaseAvatar :name="m.name" :color="m.avatarColor" />
            <div>
              <div class="text-sm font-semibold">{{ m.name }}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ m.role }}</div>
            </div>
          </div>

          <div v-if="!projectMembers.length" class="text-sm text-slate-600 dark:text-slate-300">No members assigned yet.</div>
        </div>
      </div>

      <div class="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-semibold">Task delivery</div>
            <div class="mt-1 text-sm text-slate-600 dark:text-slate-300">A quick snapshot of this project’s workload.</div>
          </div>
          <RouterLink
            :to="`/app/projects/${project.id}/board`"
            class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            View kanban
          </RouterLink>
        </div>

        <div class="mt-5 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <div class="text-xs text-slate-500 dark:text-slate-400">To do</div>
            <div class="mt-2 text-2xl font-semibold">{{ stats.todo }}</div>
          </div>
          <div class="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <div class="text-xs text-slate-500 dark:text-slate-400">In progress</div>
            <div class="mt-2 text-2xl font-semibold">{{ stats.inProgress }}</div>
          </div>
          <div class="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <div class="text-xs text-slate-500 dark:text-slate-400">Done</div>
            <div class="mt-2 text-2xl font-semibold">{{ stats.done }}</div>
          </div>
        </div>
      </div>
    </div>

    <ProjectFormModal
      :open="formOpen"
      mode="edit"
      :project="project"
      :members="members"
      @close="formOpen = false"
      @saved="onSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BaseAvatar from '@/components/BaseAvatar.vue'
import BaseButton from '@/components/BaseButton.vue'

import ProjectFormModal from '@/modules/projects/components/ProjectFormModal.vue'

import { useProjectsStore } from '@/modules/projects/store'
import { useTasksStore } from '@/modules/tasks/store'
import { useUsersStore } from '@/modules/users/store'
import { usePermissions } from '@/modules/auth/permissions'
import { useProjectActivityStore } from '@/modules/projects/activityStore'

import type { ActivityEvent } from '@/types/activity'

const router = useRouter()
const route = useRoute()

const projects = useProjectsStore()
const tasks = useTasksStore()
const users = useUsersStore()
const perms = usePermissions()
const activity = useProjectActivityStore()

const formOpen = ref(false)
const loading = ref(true)

const projectId = computed(() => String(route.params.id))
const project = computed(() => projects.byId[projectId.value])

const members = computed(() => users.membersForProjects)

const activityItems = computed<ActivityEvent[]>(() => activity.byProjectId[projectId.value] ?? [])

const projectMembers = computed(() => {
  const p = project.value
  if (!p) return []
  return members.value.filter((m) => p.memberIds.includes(m.id))
})

const stats = computed(() => {
  const list = tasks.byProjectId[projectId.value] ?? []
  return {
    todo: list.filter((t) => t.status === 'todo').length,
    inProgress: list.filter((t) => t.status === 'in_progress').length,
    done: list.filter((t) => t.status === 'done').length,
  }
})

const statusLabel = computed(() => {
  if (!project.value) return ''
  if (project.value.status === 'paused') return 'Paused'
  if (project.value.status === 'completed') return 'Completed'
  return 'Active'
})

const updatedLabel = computed(() => {
  if (!project.value) return ''
  const d = new Date(project.value.updatedAt)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
})

onMounted(async () => {
  try {
    await users.fetchMembersIfNeeded()
    await projects.fetchById(projectId.value)
    await tasks.fetchForProject(projectId.value)
    await activity.fetchForProject(projectId.value)
  } finally {
    loading.value = false
  }
})

watch(projectId, async () => {
  loading.value = true
  try {
    await projects.fetchById(projectId.value)
    await tasks.fetchForProject(projectId.value)
    await activity.fetchForProject(projectId.value)
  } finally {
    loading.value = false
  }
})

function openEdit() {
  formOpen.value = true
}

async function onDelete() {
  if (!project.value) return
  const ok = window.confirm('Delete this project? This will also remove all tasks inside it.')
  if (!ok) return

  const removed = await projects.remove(project.value.id)
  if (removed) router.push({ name: 'projects' })
}

function onSaved() {
  tasks.fetchForProject(projectId.value)
  activity.fetchForProject(projectId.value)
}

function actorLabel(userId: string) {
  return users.byId[userId]?.name ?? 'Unknown'
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>
