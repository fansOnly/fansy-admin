<template>
  <el-container class="w-100vw">
    <el-aside :width="globalStore.sideWidth" class="transition-width">
      <base-sidebar />
    </el-aside>
    <el-container direction="vertical">
      <base-header />
      <nav-bar @reload="handleReload" />
      <base-main v-loading="!loaded" :loaded="loaded" />
    </el-container>
  </el-container>
</template>

<script setup>
import { watchThrottled, useWindowSize } from '@vueuse/core'
import { useTheme } from '@/hooks/use-theme';
import { useGlobalStore } from '@/store/app'
const globalStore = useGlobalStore()

const { width } = useWindowSize()
globalStore.setMenuCollapse(width.value < 1000)
const loaded = ref(true)

watchThrottled(
  width,
  (newVal) => {
    globalStore.setMenuCollapse(newVal < 1000)
  },
  { throttle: 300 }
)

const handleReload = () => {
  loaded.value = false
  nextTick(() => {
    loaded.value = true
  })
}

defineOptions({
  name: 'BaseLayout'
})
</script>

<style lang="scss" scoped></style>