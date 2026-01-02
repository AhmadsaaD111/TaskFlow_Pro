export function createId(prefix?: string) {
  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : fallbackId()
  return prefix ? `${prefix}_${id}` : id
}

function fallbackId() {
  return `${Date.now().toString(16)}_${Math.random().toString(16).slice(2)}`
}
