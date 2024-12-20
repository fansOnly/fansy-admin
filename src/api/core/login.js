import { httpPost, httpGet } from '@/common/http'

/**
 * 用户登陆
 * @param {Object} params
 * @param {string} username
 * @param {string} password
 */
export const login = (params = {}) => httpPost('/core/login', params)

/**
 * 刷新 accessToken
 */
export const refreshToken = (refreshToken = '') =>
  httpGet('/core/refresh_token', { token: refreshToken })

/**
 * 用户登出
 */
export const logout = () => httpPost('/core/logout')
