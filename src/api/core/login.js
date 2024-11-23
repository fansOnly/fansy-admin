import { httpPost } from '@/common/http'

/**
 * 用户登陆
 * @param {Object} params
 * @param {string} username
 * @param {string} password
 */
export const login = (params = {}) => httpPost('/core/login', params)

/**
 * 用户登出
 */
export const logout = () => httpPost('/core/logout')
