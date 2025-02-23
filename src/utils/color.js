/**
 * 将十六进制颜色转换为 RGB
 * @param {string} hex - 十六进制颜色值（如 #409eff）
 * @returns {Object} - 包含 r, g, b 的对象
 */
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

/**
 * 将 RGB 颜色转换为十六进制
 * @param {number} r - 红色值（0-255）
 * @param {number} g - 绿色值（0-255）
 * @param {number} b - 蓝色值（0-255）
 * @returns {string} - 十六进制颜色值（如 #409eff）
 */
function rgbToHex(r, g, b) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

/**
 * 混合两种颜色
 * @param {string} color1 - 第一种颜色（十六进制）
 * @param {string} color2 - 第二种颜色（十六进制）
 * @param {number} weight - 第二种颜色的混合比例（0-1）
 * @returns {string} - 混合后的颜色（十六进制）
 */
function mixColors(color1, color2, weight) {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  const r = Math.round(rgb1.r * (1 - weight) + rgb2.r * weight)
  const g = Math.round(rgb1.g * (1 - weight) + rgb2.g * weight)
  const b = Math.round(rgb1.b * (1 - weight) + rgb2.b * weight)

  return rgbToHex(r, g, b)
}

/**
 * 生成不同色度的颜色
 * @param {string} color - 基础颜色（十六进制）
 * @param {number} level - 色度级别（如 3 表示 light-3，-2 表示 dark-2）
 * @returns {string} - 生成的颜色（十六进制）
 */
export function setColorMixLevel(color, level) {
  const mixColor = level > 0 ? '#ffffff' : '#000000' // 混合白色或黑色
  const weight = Math.abs(level) / 10 // 计算混合比例
  return mixColors(color, mixColor, weight)
}

export function setGlobalColor(color) {
  const dom = document.documentElement
  dom.style.setProperty('--el-color-primary', color)
  dom.style.setProperty('--el-color-primary-light-3', setColorMixLevel(color, 3))
  dom.style.setProperty('--el-color-primary-light-5', setColorMixLevel(color, 5))
  dom.style.setProperty('--el-color-primary-light-7', setColorMixLevel(color, 7))
  dom.style.setProperty('--el-color-primary-light-8', setColorMixLevel(color, 8))
  dom.style.setProperty('--el-color-primary-light-9', setColorMixLevel(color, 9))
  dom.style.setProperty('--el-color-primary-dark-2', setColorMixLevel(color, -2))
}
