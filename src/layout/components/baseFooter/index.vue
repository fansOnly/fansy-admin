<template>
  <el-footer :height="globalStore.layout.footerHeight + 'px'" class="flex-[center,center]">
    @copyright 2024 All rights reserved.
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