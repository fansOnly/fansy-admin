import { createRouter, createWebHashHistory } from 'vue-router'
import { createRouterGuards } from './permission'

export const LAYOUT = () => import('@/layout/index.vue')
export const IFRAME = () => import('@/layout/baseIframe/index.vue')
export const BLANK = () => import('@/layout/blank/index.vue')
export const PAGE_404 = () => import('@/views/exception/404/index.vue')

// 主路由
export const BaseRoute = {
  path: '/',
  name: 'Layout',
  component: LAYOUT,
  meta: {
    title: '',
    requireAuth: true
  },
  children: []
}

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/test',
    name: '实验室',
    component: () => import('@/views/index/test.vue'),
    meta: {
      title: 'test'
    }
  },
  BaseRoute,
  {
    path: '/:pathMatch(.*)',
    name: 'NotFound',
    component: PAGE_404,
    meta: {
      title: '页面未找到~'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由权限控制
createRouterGuards(router)

// 监听路由错误
// router.onError((data) => {
//   console.log('[debug] router error::', data)
// })

export default router
