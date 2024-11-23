import compressPlugin from 'vite-plugin-compression'

/**
 * 压缩插件配置
 * @param {string} compress 'gzip' | 'brotli' | 'none'
 * @param {boolean} deleteOriginFile
 */
export const useCompressPlugin = (compress = 'none', deleteOriginFile = false) => {
  let plugin = {}

  if (compress === 'gzip') {
    plugin = compressPlugin({
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
      deleteOriginFile
    })
  } else if (compress === 'brotli') {
    plugin = compressPlugin({
      threshold: 10240,
      algorithm: 'brotliCompress',
      ext: '.br',
      deleteOriginFile
    })
  }

  return plugin
}