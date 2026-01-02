import type { User } from '@/types/auth'
import { request } from '@/api/http'

export async function listUsers() {
  return request<User[]>({
    url: '/users',
    method: 'GET',
  })
}
