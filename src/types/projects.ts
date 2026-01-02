export type ProjectStatus = 'active' | 'paused' | 'completed'

export type Project = {
  id: string
  name: string
  description: string
  status: ProjectStatus
  ownerId: string
  memberIds: string[]
  createdAt: string
  updatedAt: string
}
