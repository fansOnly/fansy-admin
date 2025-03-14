import { defineStore } from 'pinia'
import { useStorage, StorageSerializers } from '@vueuse/core'
import { cloneDeep } from 'lodash-es'
import { PREFERENCE_PRESET } from '@/constants/preset'
import { useTheme } from '@/hooks/use-theme'
import { useToggle } from '@vueuse/core'
import { setGlobalColor } from '@/utils/color'
const { isDark, toggleDark } = useTheme()

const storageKey = `${import.meta.env.VITE_NAMESPACE}-preferences`
// localStorage.removeItem(storageKey)
// const preferenceStorageJson = localStorage.getItem(storageKey) || ''
// const preferenceStorage = {
//   ...(preferenceStorageJson ? JSON.parse(preferenceStorageJson) : {}),
//   ...cloneDeep(PREFERENCE_PRESET)
// }
const preferenceStorage = localStorage.getItem(storageKey) || cloneDeep(PREFERENCE_PRESET)

const lockStorageKey = `${import.meta.env.VITE_NAMESPACE}-lock`
// localStorage.removeItem(lockStorageKey)
const lockStorage = localStorage.getItem(lockStorageKey) || {
  lock: false,
  password: ''
}

export const useGlobalStore = defineStore('app', {
  state: () => {
    return {
      name: 'Github',
      copyright: '@copyright 2025 All rights reserved.',
      config: {
        size: 'default',
        zIndex: 2000
      },
      layout: {
        menuWidth: 220,
        menuCollapsedWidth: 64,
        menuCollapsedTitleWidth: 80,
        menuHeight: 60,
        headerHeight: 60,
        footerHeight: 60,
        navBarHeight: 40,
        maximize: false
      },
      lockScreen: useStorage(lockStorageKey, lockStorage, localStorage, {
        serializer: StorageSerializers.object
      }),
      preference: useStorage(storageKey, preferenceStorage, localStorage, {
        serializer: StorageSerializers.object
        // mergeDefaults: (storageValue, defaults) => {
        //   return deepMerge(storageValue, defaults)
        // }
      })
    }
  },
  getters: {
    navBarHeight: (state) => {
      return state.preference.navbar.show ? state.layout.navBarHeight : 0
    },
    sideWidth() {
      if (this.layout.maximize || !this.preference.sidebar.show) return '0'
      if (this.preference.menu.mode === 'vertical-double')
        return this.layout.menuCollapsedTitleWidth + this.layout.menuCollapsedWidth + 'px'
      if (!this.preference.sidebar.collapse) return this.layout.menuWidth + 'px'
      if (this.preference.sidebar.collapsedTitle) return this.layout.menuCollapsedTitleWidth + 'px'
      if (this.preference.sidebar.collapse) return this.layout.menuCollapsedWidth + 'px'
      return this.layout.menuWidth + 'px'
    },
    topHeight() {
      return this.layout.headerHeight + this.navBarHeight
    }
  },
  actions: {
    toggleMenuCollapse() {
      this.preference.sidebar.collapse = !this.preference.sidebar.collapse
    },
    setMenuCollapse(value) {
      this.preference.sidebar.collapse = value
    },
    setLayoutMaximize(value) {
      this.layout.maximize = value
      this.layout.headerHeight = value ? 0 : 60
    },
    // setLockScreen(value) {
    //   this.lockScreen = value
    // },
    resetPreference() {
      this.preference = cloneDeep(PREFERENCE_PRESET)

      this.setPrimaryColor(this.preference.theme.primary)
      this.setThemeMode(this.preference.theme.mode)
    },
    setPrimaryColor(color) {
      setGlobalColor(color)
    },
    getPrimaryColor() {
      const dom = document.documentElement
      return getComputedStyle(dom).getPropertyValue(`--el-color-primary`)
    },
    setThemeMode(mode) {
      const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (mode === 'auto') {
        if (dark !== isDark.value) {
          toggleDark()
        }
      } else {
        if (dark !== isDark.value) {
          useToggle(isDark)
        }
        if ((mode === 'dark' && !isDark.value) || (mode === 'light' && isDark.value)) {
          toggleDark()
        }
      }
    }
  }
})
