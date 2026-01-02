import type { AuthSession, User } from '@/types/auth'
import { request } from '@/api/http'

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  email: string
  name: string
  password: string
}

export async function login(payload: LoginPayload) {
  return request<AuthSession>({
    url: '/auth/login',
    method: 'POST',
    data: payload,
  })
}

export async function register(payload: RegisterPayload) {
  return request<AuthSession>({
    url: '/auth/register',
    method: 'POST',
    data: payload,
  })
}

export async function me() {
  return request<User>({
    url: '/auth/me',
    method: 'GET',
  })
}
