import type { Task, TaskComment, TaskStatus } from '@/types/tasks'
import { request } from '@/api/http'

export type CreateTaskPayload = {
  title: string
  description: string
  priority: Task['priority']
  dueDate?: string
  assigneeId?: string
}

export async function listTasks(projectId: string) {
  return request<Task[]>({
    url: `/projects/${projectId}/tasks`,
    method: 'GET',
  })
}

export async function createTask(projectId: string, payload: CreateTaskPayload) {
  return request<Task>({
    url: `/projects/${projectId}/tasks`,
    method: 'POST',
    data: payload,
  })
}

export async function updateTask(taskId: string, patch: Partial<Omit<Task, 'id' | 'projectId' | 'createdAt'>>) {
  return request<Task>({
    url: `/tasks/${taskId}`,
    method: 'PATCH',
    data: patch,
  })
}

export async function moveTask(taskId: string, status: TaskStatus) {
  return request<Task>({
    url: `/tasks/${taskId}`,
    method: 'PATCH',
    data: { status },
  })
}

export async function deleteTask(taskId: string) {
  return request<{ success: true }>({
    url: `/tasks/${taskId}`,
    method: 'DELETE',
  })
}

export async function listComments(taskId: string) {
  return request<TaskComment[]>({
    url: `/tasks/${taskId}/comments`,
    method: 'GET',
  })
}

export async function addComment(taskId: string, message: string) {
  return request<TaskComment>({
    url: `/tasks/${taskId}/comments`,
    method: 'POST',
    data: { message },
  })
}
