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

  const manualChunks = (id) => {
    if (id.includes('node_modules')) {
      if (id.includes('lodash-es')) {
        return 'lodash-vendor'
      }
      if (id.includes('element-plus')) {
        return 'el-vendor'
      }
      if (id.includes('@vue') || id.includes('vue')) {
        return 'vue-vendor'
      }
      return 'vendor'
    }
  }

  return {
    base: './',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
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
    build: {
      outDir: 'dist',
      rollupOptions: {
        // 路由分块
        // https://rollupjs.org/guide/en/#outputmanualchunks
        output: {
          manualChunks: {
            // 'group-user': ['./src/pages/user/index']
          }
        }
      }
      // chunkSizeWarningLimit: 1500, //超出 chunk 大小警告阈值，默认500kb
      // //Rollup 打包配置
      // rollupOptions: {
      //   output: {
      //     entryFileNames: 'assets/js/[name]-[hash:8].js', //入口文件名称
      //     chunkFileNames: 'assets/js/[name]-[hash:8].js', //引入文件名名称
      //     assetFileNames: 'assets/[ext]/[name]-[hash:8][extname]', //静态资源名称
      //     manualChunks
      //   }
      // }
    },
    optimizeDeps: {
      include: [
        'element-plus',
        'element-plus/dist/locale/zh-cn.mjs',
        '@vueuse/core',
        'lodash-es',
        'nprogress',
        'dayjs',
        'echarts'
      ]
    }
  }
})
