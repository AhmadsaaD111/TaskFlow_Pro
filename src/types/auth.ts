export type UserRole = 'admin' | 'member'

export type User = {
  id: string
  email: string
  name: string
  role: UserRole
  avatarColor?: string
}

export type AuthToken = {
  accessToken: string
}

export type AuthSession = {
  token: AuthToken
  user: User
}
