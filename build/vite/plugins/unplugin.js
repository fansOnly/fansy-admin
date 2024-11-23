import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

const srcPath = path.join(process.cwd(), '/src/')

export const useUnpluginVite = () => {
  const plugins = []

  plugins.push(
    AutoImport({
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/],
      imports: ['vue', 'vue-router'],
      // dirs: ['src/hooks/**'],
      eslintrc: {
        enabled: false
      },
      dts: false,
      resolvers: [
        ElementPlusResolver(),
        // Auto import icon components
        IconsResolver({
          prefix: 'Icon'
        })
      ]
    })
  )

  plugins.push(
    Components({
      dirs: ['src/components', 'src/layout'],
      extensions: ['vue'],
      include: [/\.vue$/, /\.vue\?vue/],
      deep: true,
      dts: false,
      resolvers: [
        (name) => {
          if (name.toLowerCase().startsWith('fansy')) {
            return path.resolve(
              srcPath,
              `components/fansy-ui/${name.slice(5).toLowerCase()}/index.vue`
            )
          }
        },
        ElementPlusResolver({
          importStyle: 'sass'
        }),
        IconsResolver({
          enabledCollections: ['ep']
        })
      ]
    })
  )

  // auto install element-plus icons
  plugins.push(
    Icons({
      autoInstall: true
    })
  )

  return plugins
}
