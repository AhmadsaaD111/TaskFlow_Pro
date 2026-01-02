import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'taskflow_pro_theme'

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>('light')

  const isDark = computed(() => mode.value === 'dark')

  function apply() {
    document.documentElement.classList.toggle('dark', mode.value === 'dark')
  }

  function init() {
    const saved = (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) ?? 'light'
    mode.value = saved
    apply()
  }

  function toggle() {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
    localStorage.setItem(STORAGE_KEY, mode.value)
    apply()
  }

  return {
    mode,
    isDark,
    init,
    toggle,
  }
})
