import type { Project } from '@/types/projects'
import { request } from '@/api/http'

export type CreateProjectPayload = {
  name: string
  description: string
}

export type UpdateProjectPayload = {
  name: string
  description: string
  status: Project['status']
  memberIds: string[]
}

export async function listProjects() {
  return request<Project[]>({
    url: '/projects',
    method: 'GET',
  })
}

export async function getProject(id: string) {
  return request<Project>({
    url: `/projects/${id}`,
    method: 'GET',
  })
}

export async function createProject(payload: CreateProjectPayload) {
  return request<Project>({
    url: '/projects',
    method: 'POST',
    data: payload,
  })
}

export async function updateProject(id: string, payload: UpdateProjectPayload) {
  return request<Project>({
    url: `/projects/${id}`,
    method: 'PUT',
    data: payload,
  })
}

export async function deleteProject(id: string) {
  return request<{ success: true }>({
    url: `/projects/${id}`,
    method: 'DELETE',
  })
}
