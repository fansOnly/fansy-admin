<template>
  <el-config-provider :locale="zhCn" :size="globalStore.config.size" :zIndex="globalStore.config.zIndex">
    <el-watermark :content="globalStore.preference.app.watermark ? 'fansy-admin' : ''" :font="font" :zIndex="99999999">
      <router-view />
    </el-watermark>
  </el-config-provider>
</template>

<script setup>
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useGlobalStore } from './store/app'
import { useTitle } from '@/hooks/use-title'
import { useTheme } from '@/hooks/use-theme'
const { isDark } = useTheme()

const globalStore = useGlobalStore()
const theme = computed(() => globalStore.preference.theme)
const font = reactive({
  color: 'rgba(0, 0, 0, .15)',
})

const setPreference = () => {
  if (!theme.value) return
  if (theme.value.builtin === 'default') {
    theme.value.primary = globalStore.getPrimaryColor()
  } else if (theme.value.builtin === 'custom') {
    globalStore.setPrimaryColor(theme.value.color)
  } else {
    globalStore.setPrimaryColor(theme.value.builtin)
  }
}
setPreference()
useTitle()

watch(
  isDark,
  () => {
    font.color = isDark.value
      ? 'rgba(255, 255, 255, .15)'
      : 'rgba(0, 0, 0, .15)'
  },
  {
    immediate: true,
  }
)
</script>
