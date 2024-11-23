import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('app', {
  state: () => {
    return {
      name: 'Github',
      config: {
        size: 'default',
        zIndex: 2000
      },
      menu: {
        mode: 'vertical', // horizontal / vertical
        width: '220px', // 侧边栏宽度
        collapse: false
      },
      layout: {
        headerHeight: 60,
        footerHeight: 60,
        navBarHeight: 40,
        maximize: false
      }
    }
  },
  getters: {
    sideWidth: (state) => {
      return state.layout.maximize ? '0' : state.menu.collapse ? '64px' : state.menu.width
    },
    topHeight: (state) => {
      return state.layout.headerHeight + state.layout.navBarHeight
    }
  },
  actions: {
    toggleMenuCollapse() {
      this.menu.collapse = !this.menu.collapse
    },
    setMenuCollapse(value) {
      this.menu.collapse = value
    },
    setLayoutMaximize(value) {
      this.layout.maximize = value
      this.layout.headerHeight = value ? 0 : 60
    }
  }
})
