import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { ApiError } from '@/types/api'
import type { User } from '@/types/auth'

import { assertPermission } from '@/modules/auth/permissions'

import * as usersService from './service'

export const useUsersStore = defineStore('users', () => {
  const items = ref<User[]>([])
  const loading = ref(false)
  const error = ref<ApiError | null>(null)

  const byId = computed<Record<string, User>>(() => {
    const map: Record<string, User> = {}
    for (const u of items.value) map[u.id] = u
    return map
  })

  const membersForProjects = computed(() => items.value)

  async function fetchAll() {
    loading.value = true
    error.value = null

    try {
      items.value = await usersService.listUsers()
    } catch (err) {
      error.value = err as ApiError
    } finally {
      loading.value = false
    }
  }

  async function fetchDirectory() {
    loading.value = true
    error.value = null

    try {
      assertPermission('users:manage')
      items.value = await usersService.listUsers()
    } catch (err) {
      error.value = err as ApiError
    } finally {
      loading.value = false
    }
  }

  async function fetchMembersIfNeeded() {
    if (items.value.length) return
    await fetchAll()
  }

  return {
    items,
    byId,
    membersForProjects,
    loading,
    error,
    fetchAll,
    fetchDirectory,
    fetchMembersIfNeeded,
  }
})
