import { jwtDecode } from 'jwt-decode'
import { useMenuStore } from '@/store/menu'
import { useUserStore } from '@/store/user'
import Storage from '@/common/storage'
import { getAdminDetail } from '@/api/common/admin'
import { addRoutes } from './util'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
  speed: 200,
  minimum: 0.02,
  trickleSpeed: 200,
  showSpinner: false
})

const WHITE_LIST = ['/login', '/test']
const REDIRECT_PATH = ['/redirect']

export const createRouterGuards = (router) => {
  router.beforeEach(async (to, from) => {
    console.log('[debug] from => to ', from, to)

    if (!from.path.includes(REDIRECT_PATH)) {
      NProgress.start()
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
      NProgress.done()
      return to.fullPath === '/' ? '/login' : { path: '/login', query: { redirect: to.fullPath } }
    }
  })

  router.afterEach((to, from) => {
    if (!to.path.includes(REDIRECT_PATH) && NProgress.isStarted()) {
      setTimeout(() => {
        NProgress.done(true)
      }, 200)
    }
  })
}
