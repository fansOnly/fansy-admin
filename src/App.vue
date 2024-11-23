<template>
  <el-config-provider :locale="zhCn" :size="size" :zIndex="zIndex">
    <router-view />
  </el-config-provider>
</template>

<script setup>
  import zhCn from 'element-plus/es/locale/lang/zh-cn'
  import { useGlobalStore } from './store/app'
  import { useTitle } from '@/hooks'

  const globalStore = useGlobalStore()

  const size = globalStore.config.size
  const zIndex = globalStore.config.zIndex

  useTitle()
</script>
