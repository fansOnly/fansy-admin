<template>
  <el-config-provider :locale="zhCn" :size="globalStore.config.size" :zIndex="globalStore.config.zIndex">
    <router-view />
  </el-config-provider>
</template>

<script setup>
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useGlobalStore } from './store/app'
import { useTitle } from '@/hooks/use-title'

const globalStore = useGlobalStore()
const dom = document.documentElement
const primaryColor = getComputedStyle(dom).getPropertyValue(`--el-color-primary`)

const setPreference = () => {
  const theme = globalStore.preference.theme
  if (theme.builtin === 'default') {
    theme.primary = primaryColor
  } else if (theme.builtin === 'custom') {
    dom.style.setProperty('--el-color-primary', theme.color)
  } else {
    dom.style.setProperty('--el-color-primary', theme.builtin)
  }
}
setPreference()
useTitle()
</script>
