import { defineStore } from 'pinia'
import Storage from '@/common/storage'
import avatarDefaultImage from '@/assets/images/avatar.gif'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      defaultAvatar: avatarDefaultImage,
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
    isLogin: () => !!Storage.getLocalItem('token')
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
      Storage.removeLocalItem('token')
      Storage.removeLocalItem('refresh-token')
    }
  }
})
