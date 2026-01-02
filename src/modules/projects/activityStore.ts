import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { ApiError } from '@/types/api'
import type { ActivityEvent } from '@/types/activity'

import * as activityService from './activityService'

type ProjectId = string

export const useProjectActivityStore = defineStore('projectActivity', () => {
  const byProjectId = ref<Record<ProjectId, ActivityEvent[]>>({})

  const loading = ref(false)
  const error = ref<ApiError | null>(null)

  function forProject(projectId: string) {
    return computed(() => byProjectId.value[projectId] ?? [])
  }

  async function fetchForProject(projectId: string) {
    loading.value = true
    error.value = null

    try {
      const list = await activityService.listProjectActivity(projectId)
      if (!Array.isArray(list)) {
        throw {
          code: 'INTERNAL_ERROR',
          message: 'Unexpected server response while loading activity.',
        } satisfies ApiError
      }
      byProjectId.value = { ...byProjectId.value, [projectId]: list }
    } catch (err) {
      error.value = err as ApiError
    } finally {
      loading.value = false
    }
  }

  return { byProjectId, loading, error, forProject, fetchForProject }
})
