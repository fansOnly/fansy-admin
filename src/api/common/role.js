import { httpPost, httpGet } from '@/common/http'
import { roleApiPath } from '@/api/api-path'

/**
 * 获取角色列表
 * @param {Object} params
 * @param {number} params.page
 * @param {number} params.pageSize
 * @param {string} params.title
 * @param {number} params.status
 */
export const getRoleList = (params = {}) => httpGet(roleApiPath.list, params)

/**
 * 获取角色详情
 * @param {string} id
 */
export const getRoleDetail = (id = '') => httpGet(roleApiPath.detail, { id })

/**
 * 更新角色
 * @param {RoleDto} params
 */
export const updateRole = (params = {}) => httpPost(roleApiPath.update, params)

/**
 * 新增角色
 * @param {RoleDto} params
 */
export const addRole = (params = {}) => httpPost(roleApiPath.add, params)

/**
 * 删除角色
 * @param {string | Array<string>} id
 */
export const removeRole = (id = '') => httpPost(roleApiPath.remove, { id })
