import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'
import Inspect from 'vite-plugin-inspect'
import VueDevTools from 'vite-plugin-vue-devtools'
import UnoCSS from 'unocss/vite'
import { useCompressPlugin } from './compress'
import { useVisualizerPlugin } from './visualizer'
import { useUnpluginVite } from './unplugin'
import { useMockPlugin } from './mock'
import { useSvgPlugin } from './svg'

export const createVitePlugins = (viteEnv = {}, isBuild = false) => {
  const {
    VITE_USE_VISUALIZER,
    VITE_USE_INSPECT,
    VITE_BUILD_COMPRESS,
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
    VITE_USE_MOCK
  } = viteEnv

  const vitePlugins = [
    // 提供 Vue 3 单文件组件支持
    vue(),
    // 提供 Vue 3 JSX 支持
    vueJsx(),
    UnoCSS(),
    VueDevTools(),
    ...useUnpluginVite(),
    useSvgPlugin()
  ]

  vitePlugins.push(useMockPlugin(isBuild, VITE_USE_MOCK))

  // inspect 模块检查
  VITE_USE_INSPECT && vitePlugins.push(Inspect())

  // visualizer 依赖分析
  VITE_USE_VISUALIZER && vitePlugins.push(useVisualizerPlugin())

  if (isBuild) {
    // 低版本兼容
    vitePlugins.push(
      legacy({
        targets: ['defaults', 'not IE 11']
      })
    )
    // 压缩代码
    vitePlugins.push(useCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE))
  }

  return vitePlugins
}
