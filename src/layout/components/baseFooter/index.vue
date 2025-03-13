<template>
  <el-footer :height="globalStore.layout.footerHeight + 'px'" class="flex-[center,center] overflow-hidden">
    <div v-html="globalStore.copyright"></div>
  </el-footer>
</template>

<script setup>
import { useGlobalStore } from '@/store/app';

const globalStore = useGlobalStore()

defineOptions({
  name: 'BaseFooter'
})
</script>

<style lang="scss" scoped></style>