<template>
  <div v-if="sidebarSetting.show"
    class="h-full background-custom-var(--el-fill-color-blank) b-r-1px b-r-solid borderColor-custom-var(--el-border-color-lighter) overflow-hidden">
    <base-logo :height="topHeight" :title="globalStore.name" :collapse="sidebarSetting.collapse" />
    <el-scrollbar noresize class="fansy-menu" :style="{ height: `calc(100% - ${topHeight}px)` }">
      <base-menu />
    </el-scrollbar>
  </div>
</template>

<script setup>
import { useGlobalStore } from '@/store/app'

const globalStore = useGlobalStore()

const sidebarSetting = computed(() => globalStore.preference.sidebar)
const topHeight = globalStore.layout.headerHeight

defineOptions({
  name: 'BaseSidebar'
})
</script>

<style lang="scss" scoped></style>
