import { httpPost, httpGet } from '@/common/http'
import { dictionaryApiPath } from '@/api/api-path'

/**
 * 获取参数列表
 * @param {DictionaryQueryDto} params
 * @param {number} params.page
 * @param {number} params.pageSize
 * @param {string} params.title
 * @param {number} params.status
 */
export const getDictionaryList = (params = {}) => httpGet(dictionaryApiPath.list, params)

/**
 * 获取参数详情
 * @param {string} id
 */
export const getDictionaryDetail = (id = '') => httpGet(dictionaryApiPath.detail, { id })

/**
 * 更新参数
 * @param {DictionaryDto} params
 * @param {string} params.id
 * @param {number} params.sortnum
 * @param {string} params.title
 * @param {Array<DictionaryOptionDto>} params.options
 * @param {string} params.options.title
 * @param {string} params.options.value
 * @param {number} params.options.status
 * @param {string} params.operator
 * @param {date} params.createTime
 * @param {date} params.updateTime
 * @param {number} params.status
 */
export const updateDictionary = (params = {}) => httpPost(dictionaryApiPath.update, params)

/**
 * 新增参数
 * @param {DictionaryDto} params
 */
export const addDictionary = (params = {}) => httpPost(dictionaryApiPath.add, params)

/**
 * 删除参数
 * @param {string | Array<string>} id
 */
export const removeDictionary = (id = '') => httpPost(dictionaryApiPath.remove, { id })
