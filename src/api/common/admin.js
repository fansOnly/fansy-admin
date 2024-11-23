import { httpPost, httpGet } from '@/common/http'

/**
 * 获取管理员列表
 * @param {Object} params
 * @param {number} params.page
 * @param {number} params.pageSize
 * @param {string} params.username
 * @param {string} params.nickname
 * @param {string} params.phone
 * @param {number} params.status
 */
export const getAdminList = (params = {}) => httpGet('/common/admin/list', params)

/**
 * 获取管理员详情
 * @param {string} id
 */
export const getAdminDetail = (id = '') => httpGet('/common/admin/detail', { id })

/**
 * 更新管理员
 * @param {AdminDto} params
 */
export const updateAdmin = (params = {}) => httpPost('/common/admin/update', params)

/**
 * 新增管理员
 * @param {AdminDto} params
 */
export const addAdmin = (params = {}) => httpPost('/common/admin/add', params)

/**
 * 删除管理员
 * @param {string | Array<string>} id
 */
export const removeAdmin = (id = '') => httpPost('/common/admin/remove', { id })
