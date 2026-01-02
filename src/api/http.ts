import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'

import type { ApiError } from '@/types/api'

type TokenProvider = () => string | null
type UnauthorizedHandler = () => void

export const http = axios.create({
  baseURL: '/api',
  timeout: 8000,
})

let tokenProvider: TokenProvider | null = null
let unauthorizedHandler: UnauthorizedHandler | null = null

export function setAuthTokenProvider(provider: TokenProvider) {
  tokenProvider = provider
}

export function setUnauthorizedHandler(handler: UnauthorizedHandler) {
  unauthorizedHandler = handler
}

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenProvider?.()
  if (token) {
    config.headers = config.headers ?? {}
    ;(config.headers as Record<string, string>).Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (res: AxiosResponse) => res,
  (err: unknown) => {
    if (isAxiosError(err) && err.response?.status === 401) {
      unauthorizedHandler?.()
    }
    return Promise.reject(err)
  },
)

type RequestOptions = {
  retries?: number
  retryDelayMs?: number
}

export async function request<T>(config: AxiosRequestConfig, options: RequestOptions = {}): Promise<T> {
  const retries = options.retries ?? 2
  const retryDelayMs = options.retryDelayMs ?? 350

  let attempt = 0
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const res = await http.request<T>(config)
      return res.data
    } catch (err) {
      attempt += 1

      if (!shouldRetry(err) || attempt > retries) {
        throw normalizeError(err)
      }

      await sleep(retryDelayMs * attempt)
    }
  }
}

function shouldRetry(err: unknown) {
  if (!isAxiosError(err)) return false

  const status = err.response?.status
  if (!status) return true

  return status >= 500 && status <= 599
}

function normalizeError(err: unknown): ApiError {
  if (isAxiosError(err)) {
    const data = err.response?.data as ApiError | undefined
    if (data?.code && data?.message) return data

    if (err.response?.status === 401) {
      return { code: 'UNAUTHORIZED', message: 'Your session is no longer valid. Please sign in again.' }
    }

    return { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again.' }
  }

  return { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again.' }
}

function isAxiosError(err: unknown): err is AxiosError {
  return typeof err === 'object' && err !== null && 'isAxiosError' in err
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
