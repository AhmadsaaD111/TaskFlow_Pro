import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { ApiError } from '@/types/api'
import type { Task, TaskComment, TaskStatus } from '@/types/tasks'

import { assertPermission } from '@/modules/auth/permissions'

import * as tasksService from './service'

type ProjectId = string

export const useTasksStore = defineStore('tasks', () => {
  const byProjectId = ref<Record<ProjectId, Task[]>>({})
  const commentsByTaskId = ref<Record<string, TaskComment[]>>({})

  const loading = ref(false)
  const error = ref<ApiError | null>(null)

  const all = computed(() => Object.values(byProjectId.value).flat())

  async function fetchForProject(projectId: string) {
    loading.value = true
    error.value = null

    try {
      const list = await tasksService.listTasks(projectId)
      if (!Array.isArray(list)) {
        throw {
          code: 'INTERNAL_ERROR',
          message: 'Unexpected server response while loading tasks.',
        } satisfies ApiError
      }
      byProjectId.value = { ...byProjectId.value, [projectId]: list }
    } catch (err) {
      error.value = err as ApiError
    } finally {
      loading.value = false
    }
  }

  async function create(projectId: string, payload: tasksService.CreateTaskPayload) {
    loading.value = true
    error.value = null

    try {
      assertPermission('tasks:create')
      const task = await tasksService.createTask(projectId, payload)
      const list = byProjectId.value[projectId] ?? []
      byProjectId.value = { ...byProjectId.value, [projectId]: [task, ...list] }
      return task
    } catch (err) {
      error.value = err as ApiError
      return null
    } finally {
      loading.value = false
    }
  }

  async function move(projectId: string, taskId: string, status: TaskStatus) {
    try {
      assertPermission('tasks:update')
    } catch (err) {
      error.value = err as ApiError
      return
    }

    const list = byProjectId.value[projectId] ?? []
    const idx = list.findIndex((t) => t.id === taskId)
    if (idx < 0) return

    const prev = list[idx]
    const optimistic = { ...prev, status }
    const nextList = [...list]
    nextList[idx] = optimistic
    byProjectId.value = { ...byProjectId.value, [projectId]: nextList }

    try {
      const saved = await tasksService.moveTask(taskId, status)
      const merged = nextList.map((t) => (t.id === taskId ? saved : t))
      byProjectId.value = { ...byProjectId.value, [projectId]: merged }
    } catch {
      const rollback = nextList.map((t) => (t.id === taskId ? prev : t))
      byProjectId.value = { ...byProjectId.value, [projectId]: rollback }
    }
  }

  async function update(projectId: string, taskId: string, patch: Partial<Task>) {
    loading.value = true
    error.value = null

    try {
      assertPermission('tasks:update')
      const saved = await tasksService.updateTask(taskId, patch)
      const list = byProjectId.value[projectId] ?? []
      byProjectId.value = {
        ...byProjectId.value,
        [projectId]: list.map((t) => (t.id === taskId ? saved : t)),
      }
      return saved
    } catch (err) {
      error.value = err as ApiError
      return null
    } finally {
      loading.value = false
    }
  }

  async function remove(projectId: string, taskId: string) {
    loading.value = true
    error.value = null

    try {
      await tasksService.deleteTask(taskId)
      const list = byProjectId.value[projectId] ?? []
      byProjectId.value = { ...byProjectId.value, [projectId]: list.filter((t) => t.id !== taskId) }
      return true
    } catch (err) {
      error.value = err as ApiError
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchComments(taskId: string) {
    try {
      const list = await tasksService.listComments(taskId)
      commentsByTaskId.value = { ...commentsByTaskId.value, [taskId]: list }
    } catch {
      commentsByTaskId.value = { ...commentsByTaskId.value, [taskId]: [] }
    }
  }

  async function addComment(taskId: string, message: string) {
    try {
      assertPermission('tasks:update')
      const comment = await tasksService.addComment(taskId, message)
      const list = commentsByTaskId.value[taskId] ?? []
      commentsByTaskId.value = { ...commentsByTaskId.value, [taskId]: [...list, comment] }
      return comment
    } catch {
      return null
    }
  }

  return {
    byProjectId,
    commentsByTaskId,
    all,
    loading,
    error,
    fetchForProject,
    create,
    move,
    update,
    remove,
    fetchComments,
    addComment,
  }
})
