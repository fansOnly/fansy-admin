import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import { createVitePlugins } from './build/vite/plugins'
import { createProxy } from './build/vite/proxy'
import { wrapperEnv } from './build/util'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  const viteEnv = wrapperEnv(env)
  const { VITE_DROP_CONSOLE, VITE_API_CONTEXT, VITE_API_URL } = viteEnv
  const isBuild = command === 'build'

  return {
    base: './',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    // css: {
    //   preprocessorOptions: {
    //     scss: {
    //       additionalData: `@use "@/assets/styles/element/index.scss" as *;`,
    //       api: 'modern-compiler'
    //     }
    //   }
    // },
    define: {
      __APP_VERSION__: JSON.stringify('v1.0.0'),
      'process.env': {}
    },
    plugins: createVitePlugins(viteEnv, isBuild),
    server: {
      // open: true,
      port: 5172,
      host: true,
      proxy: createProxy([
        {
          '/api-mock': 'http://localhost:3011',
          '/api-proxy': VITE_API_URL + VITE_API_CONTEXT
        }
      ])
    },
    esbuild: {
      pure: VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : []
    },
    // build: {
    //   outDir: 'dist',
    //   rollupOptions: {
    //     // 路由分块
    //     // https://rollupjs.org/guide/en/#outputmanualchunks
    //     output: {
    //       manualChunks: {
    //         // 'group-user': ['./src/pages/user/index']
    //       }
    //     }
    //   }
    // },
    optimizeDeps: {
      include: ['element-plus/dist/locale/zh-cn.mjs']
    }
  }
})
