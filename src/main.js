import 'virtual:svg-icons-register'
import 'virtual:uno.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import { setupErrorHandler } from './common/error-handler'

import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/theme-chalk/src/message-box.scss'
import 'element-plus/theme-chalk/src/message.scss'
import 'element-plus/theme-chalk/src/notification.scss'
import 'element-plus/theme-chalk/src/overlay.scss'
import 'element-plus/theme-chalk/src/loading.scss'

import App from './App.vue'
import './assets/styles/index.scss'

const app = createApp(App)
app.use(router)
app.use(createPinia())

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key === 'Menu' ? 'IconMenu' : key, component)
}

// 全局错误捕获
// setupErrorHandler(app)

router.isReady().then(() => {
  app.mount('#app')
})
