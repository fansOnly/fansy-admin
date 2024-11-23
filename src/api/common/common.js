import { httpPost, httpUpload } from '@/common/http'

/**
 * 上传图片
 * @param {string} id
 * @param {string} avatar
 */
export const uploadUserAvatar = (params = {}) => httpUpload('/common/upload', params)
