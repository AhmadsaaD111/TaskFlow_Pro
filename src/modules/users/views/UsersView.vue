<template>
  <div class="flex flex-col gap-6">
    <div>
      <div class="text-sm font-semibold">Users</div>
      <div class="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Admin-only directory of users available for assignment.
      </div>
    </div>

    <div v-if="users.loading" class="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <div class="text-sm font-semibold">Loading users…</div>
      <div class="mt-1 text-sm text-slate-600 dark:text-slate-300">Fetching workspace directory.</div>
    </div>

    <div v-else-if="users.error" class="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
      <div class="text-sm font-semibold">Couldn’t load users</div>
      <div class="mt-1 text-sm">Please try again.</div>
      <div class="mt-4">
        <BaseButton variant="secondary" @click="users.fetchDirectory">Try again</BaseButton>
      </div>
    </div>

    <div v-else class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
      <table class="w-full">
        <thead class="bg-slate-50 text-left text-xs font-semibold text-slate-600 dark:bg-slate-950 dark:text-slate-300">
          <tr>
            <th class="px-6 py-3">User</th>
            <th class="px-6 py-3">Email</th>
            <th class="px-6 py-3">Role</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="u in users.items"
            :key="u.id"
            class="border-t border-slate-200 text-sm text-slate-800 dark:border-slate-800 dark:text-slate-100"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <BaseAvatar :name="u.name" :color="u.avatarColor" />
                <div>
                  <div class="font-semibold">{{ u.name }}</div>
                  <div class="text-xs text-slate-500 dark:text-slate-400">{{ u.id }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-slate-600 dark:text-slate-300">{{ u.email }}</td>
            <td class="px-6 py-4">
              <span
                class="rounded-full px-2 py-1 text-xs font-semibold"
                :class="u.role === 'admin' ? 'bg-violet-100 text-violet-900 dark:bg-violet-500/15 dark:text-violet-200' : 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'"
              >
                {{ u.role }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import BaseAvatar from '@/components/BaseAvatar.vue'
import BaseButton from '@/components/BaseButton.vue'

import { useUsersStore } from '@/modules/users/store'

const users = useUsersStore()

onMounted(() => {
  users.fetchDirectory()
})
</script>
