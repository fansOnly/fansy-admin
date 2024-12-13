import { useMenuStore } from '@/store/menu'
import { useUserStore } from '@/store/user'
import { getMenuList } from '@/api/common/menu'
import { BaseRoute, IFRAME, BLANK } from './'
import { demoMenus } from '@/mocks/modules/common/menu.mock'

const extraRoutes = [
  {
    path: '/user/info',
    name: 'UserInfo',
    component: () => import('@/views/user/info.vue'),
    meta: {
      title: '用户中心',
      requireAuth: true
    }
  },
  {
    path: '/user/changePassword',
    name: 'UserChangePassword',
    component: () => import('@/views/user/changePassword.vue'),
    meta: {
      title: '修改密码',
      requireAuth: true
    }
  }
]

/**
 * 解析组件
 */
const pages = import.meta.glob('../views/**/*.vue')
export const resolveComponent = (name) => {
  if (!name) return BLANK
  const resolvePage = pages[`../views/${name}/index.vue`] || pages[`../views/${name}.vue`]
  if (!resolvePage) {
    throw new Error(`Unknown page ${name}. Is it located under views with a .vue extension?`)
  }
  return resolvePage
}

/**
 * 添加路由
 */
export const addRoutes = async (router) => {
  const userStore = useUserStore()
  const data = await getMenuList(userStore.userInfo.roleId)
  // TODO: add demo route，to be removed in production
  const routes = generateRouteTree([...demoMenus, ...data])

  if (!routes.length) return false
  const menuStore = useMenuStore()
  menuStore.setAllRoutes(routes)

  router.addRoute({
    ...BaseRoute,
    redirect: routes[0].path,
    children: [...transformRouteRecord(routes), ...extraRoutes]
  })
}

/**
 * 解析路由对象
 * @returns
 */
export const transformRouteRecord = (routes = []) => {
  return routes.map((item) => {
    const hasChildren = item.children?.length > 0
    const isIframe = item.type === 'iframe'
    const component = isIframe ? IFRAME : resolveComponent(item.component)
    return {
      name: item.name,
      path: item.path,
      component,
      redirect: hasChildren ? item.children[0].path : '',
      meta: {
        id: item.id,
        sortnum: item.sortnum,
        parentId: item.parentId || '',
        relationId: item.relationId || '',
        icon: item.icon,
        title: item.title,
        requireAuth: item.auth === 1,
        cache: item.cache === 1,
        transition: 'fade',
        type: item.type,
        src: item.link,
        affix: item.affix === 1,
        visible: item.visible === 1
      },
      children: hasChildren ? transformRouteRecord(item.children) : []
    }
  })
}

/**
 * 生成路由树
 */
export const generateRouteTree = (routes = [], rootId = '', depth = 3) => {
  const parentRoutes = sortRoutes(routes.filter((v) => !v.parentId || v.parentId === rootId))
  const childRoutes = routes.filter((v) => v.parentId != rootId)

  let map = new Map()
  childRoutes.forEach((item) => {
    if (!map.has(item.parentId)) {
      map.set(item.parentId, [item])
    } else {
      const subs = map.get(item.parentId)
      map.set(item.parentId, subs.concat(item))
    }
  })

  return parentRoutes.map((item) => {
    let children = map.get(item.id)
    if (depth > 0) {
      children = generateRouteTree(childRoutes, item.id, depth--)
    }
    item.children = sortRoutes(children)
    return item
  })
}

/**
 * 路由排序
 */
export const sortRoutes = (routes = []) => {
  return routes.sort((a, b) => a.sortnum - b.sortnum)
}
