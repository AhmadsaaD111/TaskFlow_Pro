<template>
  <div class="flex flex-col gap-6">
    <div class="grid gap-4 md:grid-cols-3">
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div class="text-xs font-semibold text-slate-500 dark:text-slate-400">Active projects</div>
        <div class="mt-3 text-3xl font-semibold">{{ activeProjects }}</div>
        <div class="mt-2 text-sm text-slate-600 dark:text-slate-300">Projects currently in motion.</div>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div class="text-xs font-semibold text-slate-500 dark:text-slate-400">Tasks in progress</div>
        <div class="mt-3 text-3xl font-semibold">{{ inProgressTasks }}</div>
        <div class="mt-2 text-sm text-slate-600 dark:text-slate-300">Work items being actively delivered.</div>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div class="text-xs font-semibold text-slate-500 dark:text-slate-400">Tasks due soon</div>
        <div class="mt-3 text-3xl font-semibold">{{ dueSoonTasks }}</div>
        <div class="mt-2 text-sm text-slate-600 dark:text-slate-300">Due within the next 7 days.</div>
      </div>
    </div>

    <div class="grid gap-4 lg:grid-cols-3">
      <div class="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-semibold">Recent projects</div>
            <div class="mt-1 text-sm text-slate-600 dark:text-slate-300">Jump back into your latest work.</div>
          </div>
          <RouterLink
            to="/app/projects"
            class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            View all
          </RouterLink>
        </div>

        <div class="mt-5 grid gap-3 sm:grid-cols-2">
          <RouterLink
            v-for="p in recentProjects"
            :key="p.id"
            :to="`/app/projects/${p.id}`"
            class="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
          >
            <div class="text-sm font-semibold">{{ p.name }}</div>
            <div class="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
              {{ p.description || 'No description yet.' }}
            </div>
            <div class="mt-3 text-xs text-slate-500 dark:text-slate-400">
              {{ p.status }} • Updated {{ formatDate(p.updatedAt) }}
            </div>
          </RouterLink>

          <div
            v-if="!recentProjects.length"
            class="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            No projects yet. Create one to start tracking tasks.
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div class="text-sm font-semibold">Task status</div>
        <div class="mt-1 text-sm text-slate-600 dark:text-slate-300">Overall workload distribution.</div>

        <div class="mt-5 flex flex-col gap-3">
          <div class="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
            <div class="text-sm font-semibold">To do</div>
            <div class="text-sm">{{ todoTasks }}</div>
          </div>
          <div class="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
            <div class="text-sm font-semibold">In progress</div>
            <div class="text-sm">{{ inProgressTasks }}</div>
          </div>
          <div class="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
            <div class="text-sm font-semibold">Done</div>
            <div class="text-sm">{{ doneTasks }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

import { useProjectsStore } from '@/modules/projects/store'
import { useTasksStore } from '@/modules/tasks/store'

const projects = useProjectsStore()
const tasks = useTasksStore()

onMounted(async () => {
  await projects.fetchAll()
  await Promise.all(projects.items.map((p) => tasks.fetchForProject(p.id)))
})

const activeProjects = computed(() => projects.items.filter((p) => p.status === 'active').length)

const todoTasks = computed(() => tasks.all.filter((t) => t.status === 'todo').length)
const inProgressTasks = computed(() => tasks.all.filter((t) => t.status === 'in_progress').length)
const doneTasks = computed(() => tasks.all.filter((t) => t.status === 'done').length)

const dueSoonTasks = computed(() => {
  const now = Date.now()
  const week = 7 * 24 * 60 * 60 * 1000
  return tasks.all.filter((t) => {
    if (!t.dueDate) return false
    const due = new Date(t.dueDate).getTime()
    return due >= now && due <= now + week && t.status !== 'done'
  }).length
})

const recentProjects = computed(() => projects.items.slice(0, 4))

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
</script>
