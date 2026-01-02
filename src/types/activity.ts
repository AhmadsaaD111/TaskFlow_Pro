export type ActivityAction = 'project_created' | 'task_created' | 'task_moved' | 'task_assigned'

export type ActivityEvent = {
  id: string
  projectId: string
  action: ActivityAction
  description: string
  actorId: string
  actorRole: 'admin' | 'member'
  createdAt: string
}
