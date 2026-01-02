export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export type TaskComment = {
  id: string
  taskId: string
  authorId: string
  message: string
  createdAt: string
}

export type Task = {
  id: string
  projectId: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
  assigneeId?: string
  createdAt: string
  updatedAt: string
}
