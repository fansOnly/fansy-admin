import { defineStore } from 'pinia'
import Storage from '@/common/storage'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      userInfo: {
        nickname: '',
        id: '',
        roleId: '',
        phone: '',
        email: '',
        avatar: ''
      }
    }
  },
  getters: {
    isLogin: () => !!Storage.getItem('token')
  },
  actions: {
    setUserInfo(payload) {
      this.userInfo = payload
    },
    logout() {
      this.userInfo = {
        nickname: '',
        id: '',
        roleId: '',
        phone: '',
        email: '',
        avatar: ''
      }
      Storage.removeItem('token')
    }
  }
})
