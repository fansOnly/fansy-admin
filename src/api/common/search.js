import { httpGet } from '@/common/http'

/**
 * 搜搜内容
 * @param {Object} params
 * @param {string} params.title
 */
export const getSearchList = (params = {}) => httpGet('/common/search/list', params)
