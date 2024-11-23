<template>
  <el-container class="fs-layout-container">
    <el-aside :width="globalStore.sideWidth" class="transition-width">
      <base-sidebar />
    </el-aside>
    <el-container direction="vertical">
      <base-header />
      <nav-bar @reload="handleReload" />
      <base-main v-loading="!pageLoaded" :loaded="pageLoaded" />
    </el-container>
  </el-container>
</template>

<script setup>
import { watchThrottled, useWindowSize } from '@vueuse/core'
import { useGlobalStore } from '@/store/app'
const globalStore = useGlobalStore()

const { width } = useWindowSize()
globalStore.setMenuCollapse(width.value < 1000)
const pageLoaded = ref(true)

watchThrottled(
  width,
  (newVal) => {
    globalStore.setMenuCollapse(newVal < 1000)
  },
  { throttle: 300 }
)

const handleReload = () => {
  pageLoaded.value = false
  nextTick(() => {
    pageLoaded.value = true
  })
}

defineOptions({
  name: 'BaseLayout'
})
</script>

<style lang="scss" scoped>
.fs-layout-container {
  width: 100vw;
}
</style>