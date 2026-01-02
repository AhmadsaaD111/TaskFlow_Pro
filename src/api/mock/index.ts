import { http } from '@/api/http'

import { createMockAdapter } from './mockAdapter'
import { createDb } from './mockDb'

export function installMockApi() {
  const db = createDb()
  http.defaults.adapter = createMockAdapter(db)
}
