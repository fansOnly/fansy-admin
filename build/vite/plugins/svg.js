import { fileURLToPath, URL } from 'node:url'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export const useSvgPlugin = () => {
  return createSvgIconsPlugin({
    iconDirs: [
      fileURLToPath(new URL('../../../src/assets/icons', import.meta.url)),
    ],
    // 指定symbolId格式
    symbolId: '[name]',
    customDomId: 'turing-planet-svgs', // 避免多项目互相影响
  })
}
