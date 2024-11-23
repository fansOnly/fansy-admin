export const createProxy = (data=[]) => {
  let proxy = {}
  for (const item of data) {
    for (const key in item) {
      proxy[key] = {
        target: item[key],
        changeOrigin: true,
        ws: true,
        rewrite: (path='') => path.replace(new RegExp(`^${key}`), '')
      }
    }
  }
  return proxy
}