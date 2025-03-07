import { httpPost, httpGet } from '@/common/http'
import { menuApiPath } from '@/api/api-path'

/**
 * 获取菜单列表
 * @param {string} roleId
 */
export const getMenuList = (roleId = '') => httpGet(menuApiPath.list, { roleId })

/**
 * 获取菜单详情
 * @param {string} id
 */
export const getMenuDetail = (id = '') => httpGet(menuApiPath.detail, { id })

/**
 * 更新菜单
 * @param {MenuDto} params
 */
export const updateMenu = (params = {}) => httpPost(menuApiPath.update, params)

/**
 * 新增菜单
 * @param {MenuDto} params
 */
export const addMenu = (params = {}) => httpPost(menuApiPath.add, params)

/**
 * 删除菜单
 * @param {string | Array<string>} id
 */
export const removeMenu = (id = '') => httpPost(menuApiPath.remove, { id })
