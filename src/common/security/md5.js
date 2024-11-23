import md5 from 'md5'

export const md5Encrypt = (data = '') => {
  if (!data) return ''
  return md5(data)
}
