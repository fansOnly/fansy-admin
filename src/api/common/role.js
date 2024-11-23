import { httpPost, httpGet } from '@/common/http'

/**
 * 获取角色列表
 * @param {Object} params
 * @param {number} params.page
 * @param {number} params.pageSize
 * @param {string} params.title
 * @param {number} params.status
 */
export const getRoleList = (params = {}) => httpGet('/common/role/list', params)

/**
 * 获取角色详情
 * @param {string} id
 */
export const getRoleDetail = (id = '') => httpGet('/common/role/detail', { id })

/**
 * 更新角色
 * @param {RoleDto} params
 */
export const updateRole = (params = {}) => httpPost('/common/role/update', params)

/**
 * 新增角色
 * @param {RoleDto} params
 */
export const addRole = (params = {}) => httpPost('/common/role/add', params)

/**
 * 删除角色
 * @param {string | Array<string>} id
 */
export const removeRole = (id = '') => httpPost('/common/role/remove', { id })
