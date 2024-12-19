import { jwtDecode } from 'jwt-decode'
import { useGlobalStore } from '@/store/app'
import { useMenuStore } from '@/store/menu'
import { useUserStore } from '@/store/user'
import Storage from '@/common/storage'
import { getAdminDetail } from '@/api/common/admin'
import { addRoutes } from './util'
import { useLoading } from '@/hooks/use-loading'
import { checkNprogress, startNprogress, stopNprogress } from '@/utils/nprogress'

const { showLoading, hideLoading } = useLoading()
const WHITE_LIST = ['/login', '/test']
const REDIRECT_PATH = ['/redirect']

export const createRouterGuards = (router) => {
  router.beforeEach(async (to, from) => {
    console.log('[debug] from => to ', from, to)

    const globalStore = useGlobalStore()

    if (globalStore.preference.transition.loading) {
      showLoading()
    }

    if (!from.path.includes(REDIRECT_PATH) && globalStore.preference.transition.progress) {
      startNprogress()
    }

    const menuStore = useMenuStore()
    const userRoutes = menuStore.userRoutes
    const whiteRoutes = menuStore.whiteRoutes.map((v) => v.path).concat(WHITE_LIST)

    const enterPath = to.path
    const token = Storage.getItem('token')
    if (token) {
      if (enterPath === '/login') {
        return '/'
      }

      const userStore = useUserStore()
      if (!userStore.userInfo.id) {
        // get id from token
        const payload = jwtDecode(token)
        const userData = await getAdminDetail(payload.sub)
        userStore.setUserInfo(userData)
      }

      if (!userRoutes.length) {
        try {
          await addRoutes(router)
          if (enterPath === '/test') {
            return true
          }
          const routes = router.getRoutes()
          const matched = routes.find((v) => v.path === to.path)
          if (matched) {
            return { name: matched.name, replace: true }
          }
        } catch (error) {
          return false
        }
      }
    } else if (!whiteRoutes.includes(enterPath)) {
      stopNprogress()
      return to.fullPath === '/' ? '/login' : { path: '/login', query: { redirect: to.fullPath } }
    }
  })

  router.afterEach((to, from) => {
    hideLoading()
    if (!to.path.includes(REDIRECT_PATH) && checkNprogress()) {
      stopNprogress()
    }
  })
}
