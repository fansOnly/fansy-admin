import { httpPost, httpGet } from '@/common/http'

/**
 * 获取菜单列表
 * @param {string} roleId
 */
export const getMenuList = (roleId = '') => httpGet('/common/menu/list', { roleId })

/**
 * 获取菜单详情
 * @param {string} id
 */
export const getMenuDetail = (id = '') => httpGet('/common/menu/detail', { id })

/**
 * 更新菜单
 * @param {MenuDto} params
 */
export const updateMenu = (params = {}) => httpPost('/common/menu/update', params)

/**
 * 新增菜单
 * @param {MenuDto} params
 */
export const addMenu = (params = {}) => httpPost('/common/menu/add', params)

/**
 * 删除菜单
 * @param {string | Array<string>} id
 */
export const removeMenu = (id = '') => httpPost('/common/menu/remove', { id })
