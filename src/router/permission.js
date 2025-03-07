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
      // showLoading({
      //   svg: `
      //   <path class="path" d="
      //     M 30 15
      //     L 28 17
      //     M 25.61 25.61
      //     A 15 15, 0, 0, 1, 15 30
      //     A 15 15, 0, 1, 1, 27.99 7.5
      //     L 15 15
      //   " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      // `,
      //   svgViewBox: '-10, -10, 50, 50'
      // })
      showLoading({
        svg: `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="route-loading-svg">
          <g clipPath="url(#clip0_324_2488)">
            <path class="route-loading-path1" opacity="0.8"
              d="M15 0H10C9.44772 0 9 0.447715 9 1V6C9 6.55228 9.44772 7 10 7H15C15.5523 7 16 6.55228 16 6V1C16 0.447715 15.5523 0 15 0Z"
              fill="currentColor" />
            <path class="route-loading-path2" opacity="0.5"
              d="M15 9H10C9.44772 9 9 9.44772 9 10V15C9 15.5523 9.44772 16 10 16H15C15.5523 16 16 15.5523 16 15V10C16 9.44772 15.5523 9 15 9Z"
              fill="currentColor" />
            <path class="route-loading-path3" opacity="0.1"
              d="M6 9H1C0.447715 9 0 9.44772 0 10V15C0 15.5523 0.447715 16 1 16H6C6.55228 16 7 15.5523 7 15V10C7 9.44772 6.55228 9 6 9Z"
              fill="currentColor" />
            <path class="route-loading-path4" opacity="0.2"
              d="M6 0H1C0.447715 0 0 0.447715 0 1V6C0 6.55228 0.447715 7 1 7H6C6.55228 7 7 6.55228 7 6V1C7 0.447715 6.55228 0 6 0Z"
              fill="currentColor" />
          </g>
          <defs>
            <clipPath id="clip0_324_2488">
              <rect width="16" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>`,
        svgViewBox: '0 0 16 16',
        customClass: 'route-loading'
      })
    }

    if (!from.path.includes(REDIRECT_PATH) && globalStore.preference.transition.progress) {
      startNprogress()
    }

    const menuStore = useMenuStore()
    const userRoutes = menuStore.userRoutes
    const whiteRoutes = menuStore.whiteRoutes.map((v) => v.path).concat(WHITE_LIST)

    const enterPath = to.path
    const token = Storage.getLocalItem('token')
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
