import { httpPost, httpGet } from '@/common/http'
import { tableApiPath } from '@/api/api-path'

/**
 * 获取列表数据
 * @param {Object} params
 * @param {number} params.page
 * @param {number} params.pageSize
 * @param {string} params.title
 * @param {number} params.status
 */
export const getTableList = (params = {}) => httpGet(tableApiPath.list, params)

/**
 * 获取列表详情
 * @param {string} id
 */
export const getTableDetail = (id = '') => httpGet(tableApiPath.detail, { id })

/**
 * 新增
 * @param {TableDto} params
 */
export const addTable = (params) => httpPost(tableApiPath.add, params)

/**
 * 更新
 * @param {TableDto} params
 */
export const updateTable = (params = {}) => httpPost(tableApiPath.update, params)

/**
 * 删除
 * @param {string | Array<string>} id
 */
export const deleteTable = (id = []) => httpPost(tableApiPath.delete, { id })
