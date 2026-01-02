<template>
  <BaseModal :open="open" :title="title" :subtitle="subtitle" @close="$emit('close')">
    <form id="projectForm" class="flex flex-col gap-4" @submit.prevent="onSubmit">
      <BaseInput v-model="name" label="Project name" placeholder="e.g. Q1 Release" :error="errors.name" />
      <BaseTextarea v-model="description" label="Description" placeholder="Explain goals, scope, and success criteria." />

      <BaseSelect
        v-if="mode === 'edit'"
        v-model="status"
        label="Status"
        :options="statusOptions"
      />

      <div v-if="mode === 'edit'" class="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
        <div class="text-xs font-semibold text-slate-700 dark:text-slate-200">Members</div>
        <div class="mt-3 grid gap-2 sm:grid-cols-2">
          <label
            v-for="m in memberOptions"
            :key="m.id"
            class="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            <input type="checkbox" class="h-4 w-4" :checked="selected.has(m.id)" @change="toggleMember(m.id)" />
            <span class="truncate">{{ m.name }}</span>
          </label>
        </div>
        <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">Members can be assigned tasks and view this project.</p>
      </div>

    </form>

    <template #footer>
      <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <BaseButton variant="secondary" type="button" @click="$emit('close')">Cancel</BaseButton>
        <BaseButton type="submit" form="projectForm" :loading="projects.loading">{{ actionLabel }}</BaseButton>
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

import type { Project } from '@/types/projects'
import type { User } from '@/types/auth'
import { useProjectsStore } from '@/modules/projects/store'
import { useToastsStore } from '@/store/toasts'

type Mode = 'create' | 'edit'

const props = defineProps<{
  open: boolean
  mode: Mode
  project?: Project | null
  members: User[]
}>()

const emit = defineEmits<{ (e: 'close'): void; (e: 'saved', id: string): void }>()

const projects = useProjectsStore()
const toasts = useToastsStore()

const name = ref('')
const description = ref('')
const status = ref<Project['status']>('active')
const selected = ref(new Set<string>())

const errors = reactive<{ name?: string }>({})

watch(
  () => props.open,
  (open) => {
    if (!open) return

    if (props.mode === 'edit' && props.project) {
      name.value = props.project.name
      description.value = props.project.description
      status.value = props.project.status
      selected.value = new Set(props.project.memberIds)
    } else {
      name.value = ''
      description.value = ''
      status.value = 'active'
      selected.value = new Set()
    }

    errors.name = undefined
  },
)

const title = computed(() => (props.mode === 'edit' ? 'Edit project' : 'Create project'))
const subtitle = computed(() =>
  props.mode === 'edit' ? 'Update project details and membership.' : 'Create a new project in your workspace.',
)

const actionLabel = computed(() => (props.mode === 'edit' ? 'Save changes' : 'Create project'))

const statusOptions = computed(() => [
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
])

const memberOptions = computed(() => props.members)

function toggleMember(userId: string) {
  const next = new Set(selected.value)
  if (next.has(userId)) next.delete(userId)
  else next.add(userId)
  selected.value = next
}

function validate() {
  errors.name = undefined
  if (!name.value.trim()) errors.name = 'Project name is required.'
  return !errors.name
}

async function onSubmit() {
  if (!validate()) return

  if (props.mode === 'create') {
    const created = await projects.create(name.value, description.value)
    if (created) {
      toasts.success('Project created.')
      emit('saved', created.id)
      emit('close')
    }
    return
  }

  if (!props.project) return

  const updated = await projects.update(props.project.id, {
    name: name.value,
    description: description.value,
    status: status.value,
    memberIds: Array.from(selected.value),
  })

  if (updated) {
    toasts.success('Project updated.')
    emit('saved', updated.id)
    emit('close')
  }
}
</script>
