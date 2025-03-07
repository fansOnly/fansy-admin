import Axios from 'axios'
import router from '@/router'
import Storage from '../storage'
import { handleNetworkError, handleAuthError, handleGeneralError } from './util'

const isDev = import.meta.env.DEV
const apiUrl = import.meta.env.VITE_API_URL || ''
const context = import.meta.env.VITE_API_CONTEXT || ''
const useMock = import.meta.env.VITE_USE_MOCK || 'false'

const contentTypes = {
  JSON: 'application/json;charset=UTF-8',
  FORM_URLENCODED: 'application/x-www-form-urlencoded;charset=UTF-8',
  FORM_DATA: 'multipart/form-data;charset=UTF-8'
}

const baseURL = useMock === 'true' ? '/api-mock' : isDev ? '/api-proxy' : apiUrl + context
console.log('[debug] 远程请求地址 >>>', apiUrl + context)

const service = Axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    'Content-type': contentTypes.JSON
  }
})

// 刷新 token 标识
let refresh = false
// 登录过期待重新请求接口列表
let requestReloadList = []
// 接口耗时统计指针
let i = 0
let j = 0

service.interceptors.request.use(
  (config) => {
    console.time(`├─[请求耗时@${++i}]`)
    const token = Storage.getLocalItem('token')
    if (token) {
      config.headers.Authorization = `Bear ${token}`
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

service.interceptors.response.use(
  async (response) => {
    const { data, config, status } = response
    if (status === 200) {
      const params = config.method === 'get' ? config.params : JSON.parse(config.data || {})

      for (const key in params) {
        const value = params[key]
        if (value === '' || (Array.isArray(value) && !value.length)) delete params[key]
      }

      console.group(new Date())
      console.log('├─[请求地址]', baseURL + config.url)
      console.log('├─[请求类型]', config.method)
      console.log('├─[请求参数]', params)
      console.log('├─[响应结果]', data)
      console.timeEnd(`├─[请求耗时@${++j < i ? j : i}]`)
      console.log('└─')
      console.groupEnd()

      // mock 模拟未登录状态
      // if (isDev && useMock === 'true') {
      //   if (config.url === coreApiPath.login) {
      //     const token = data.data.cookie
      //     document.cookie = token
      //   } else {
      //     const cookies = document.cookie.split(';')
      //     const token = cookies.some(
      //       (v) => v.split('=')[0] == ` ${import.meta.env.VITE_NAMESPACE}MockToken`
      //     )
      //     if (!token) {
      //       data.code = 10031
      //     }
      //   }
      // }

      if (data.code === 10000) {
        return data.data
      } else {
        handleAuthError(data.code, data.message)
        handleGeneralError(data.code, data.message)
        if (data.code === 10031) {
          // 登录过期
          if (refresh) {
            return new Promise((resolve) => {
              requestReloadList.push(() => {
                resolve(service(config))
              })
            })
          } else if (!config.url.includes('/refresh_token')) {
            try {
              refresh = true
              // update token here
              await refreshToken()
              requestReloadList.forEach((cb) => cb())
              refresh = false
              requestReloadList = []
              return service(config)
            } catch (error) {
              router.push('/login')
            }
          }
        }
        return null
      }
    }
    return Promise.reject(data)
  },
  (error) => {
    handleNetworkError(error.response.status)
    return Promise.reject(error)
  }
)

async function refreshToken() {
  const res = await httpPost('/core/refresh_token', {
    token: Storage.getLocalItem('refresh-token')
  })
  Storage.setLocalItem('token', res.accessToken)
  Storage.setLocalItem('refresh-token', res.refreshToken)
  return res
}

export const httpPost = (url = '', data = {}, customHeaders = {}) => {
  return service.request({
    url,
    method: 'post',
    data,
    headers: customHeaders
  })
}

export const httpGet = (url = '', params = {}, customHeaders = {}) => {
  return service.request({
    url,
    method: 'get',
    params,
    headers: customHeaders
  })
}

export const httpUpload = (url = '', data = {}, customHeaders = {}) => {
  return service.request({
    url,
    method: 'post',
    data,
    headers: {
      'Content-Type': contentTypes.FORM_DATA,
      ...customHeaders
    }
  })
}
