import { httpPost, httpGet } from '@/common/http'

/**
 * 测试接口
 */
export const testApi = (params = {}) => httpGet('/test', params)
