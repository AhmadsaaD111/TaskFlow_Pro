export function debounce<TArgs extends unknown[]>(fn: (...args: TArgs) => void, delayMs: number) {
  let timeoutId: number | undefined

  return (...args: TArgs) => {
    if (timeoutId) window.clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => fn(...args), delayMs)
  }
}
