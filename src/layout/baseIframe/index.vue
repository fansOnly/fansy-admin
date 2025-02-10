<template>
  <div v-loading="loading" class="fs-iframe__wrapper" :style="{ height: iframeHeight + 'px' }">
    <iframe ref="frameRef" :src="src" class="fs-iframe" @load="hideLoading"></iframe>
  </div>
</template>

<script setup>
import { useWindowSize } from '@vueuse/core'
import { useGlobalStore } from '@/store/app'

const props = defineProps({
  src: String
})

const globalStore = useGlobalStore()
const { height } = useWindowSize()
const frameRef = ref(null)

// 动态 iframe 高度
const iframeHeight = computed(() => height.value - (globalStore.layout.headerHeight +
  globalStore.layout.footerHeight +
  globalStore.layout.navBarHeight +
  40 /** paddingTop&paddingBottom */ +
  20 /** marginTop */))

const loading = ref(true)
const hideLoading = () => {
  loading.value = false
}

onDeactivated(() => {
  loading.value = true
})

defineOptions({
  name: 'IframePage'
})
</script>

<style lang="scss" scoped>
.fs-iframe__wrapper {
  // transition: height 0.3s linear;
}

.fs-iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
