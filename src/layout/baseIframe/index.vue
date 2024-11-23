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

  const { headerHeight, footerHeight, navBarHeight } = globalStore.layout
  const extraHeight =
    headerHeight +
    footerHeight +
    navBarHeight +
    40 /** paddingTop&paddingBottom */ +
    20 /** marginTop */
  const iframeHeight = computed(() => height.value - extraHeight)

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
  .fs-iframe {
    display: block;
    width: 100%;
    height: 100%;
    border: 0;
  }
</style>
