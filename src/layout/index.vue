<template>
  <el-container class="w-100vw">
    <el-aside v-if="globalStore.preference.menu.mode === 'vertical'" :width="globalStore.sideWidth"
      class="transition-width">
      <base-sidebar />
    </el-aside>
    <el-container direction="vertical">
      <base-header />
      <nav-bar v-if="globalStore.preference.navbar.show" @reload="handleReload" />
      <base-main v-loading="!loaded" :loaded="loaded" />
    </el-container>
  </el-container>
</template>

<script setup>
import { watchThrottled, useWindowSize } from '@vueuse/core'
import { startNprogress, stopNprogress } from '@/utils/nprogress';
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

const handleReload = async () => {
  loaded.value = false
  startNprogress()
  await new Promise((resolve) => setTimeout(resolve, 200));
  loaded.value = true
  stopNprogress()
}

defineOptions({
  name: 'BaseLayout'
})
</script>

<style lang="scss" scoped></style>