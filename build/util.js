/**
 * 规范化 .env 文件配置输出
 */
export const wrapperEnv = (envConf={}) => {
  let env = {}
  for (const key in envConf) {
    const value = envConf[key]
    if (value === 'true') {
      env[key] = true
    } else if (value === 'false') {
      env[key] = false
    } else {
      env[key] = value
    }

    if (typeof value === 'object') {
      process.env[key] = JSON.stringify(value)
    } else {
      process.env[key] = env[key]
    } 
  }
  return env
}