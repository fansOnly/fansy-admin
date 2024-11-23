import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', {
  state: () => {
    return {
      allRoutes: []
    }
  },
  getters: {
    whiteRoutes: (state) => {
      return state.allRoutes.filter((v) => v.auth !== 1)
    },
    userRoutes: (state) => {
      return state.allRoutes
    }
  },
  actions: {
    setAllRoutes(payload = []) {
      this.allRoutes = payload
    }
  }
})
