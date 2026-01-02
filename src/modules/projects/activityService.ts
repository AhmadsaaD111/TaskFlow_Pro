import { request } from '@/api/http'
import type { ActivityEvent } from '@/types/activity'

export async function listProjectActivity(projectId: string) {
  return request<ActivityEvent[]>({
    url: `/projects/${projectId}/activity`,
    method: 'GET',
  })
}
