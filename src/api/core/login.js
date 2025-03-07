import { httpPost, httpGet } from '@/common/http'
import { coreApiPath } from '@/api/api-path'

/**
 * 用户登陆
 * @param {Object} params
 * @param {string} username
 * @param {string} password
 */
export const login = (params = {}) => httpPost(coreApiPath.login, params)

/**
 * 刷新 accessToken
 */
export const refreshToken = (token = '') => httpGet(coreApiPath.refreshToken, { token })

/**
 * 用户登出
 */
export const logout = () => httpPost(coreApiPath.logout)

/**
 * 修改密码
 * @param {Object} params
 * @param {string} params.id
 * @param {string} params.oldPass
 * @param {string} params.password
 */
export const changePassword = (params = {}) => httpPost(coreApiPath.changePassword, params)
