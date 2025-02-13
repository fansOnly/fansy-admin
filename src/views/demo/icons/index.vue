<template>
  <div class="demo-icons-wrapper overflow-auto">
    <div v-for="item in iconList" :key="item"
      class="flex-[center,,column] p-8px b b-solid borderColor-custom-var(--el-border-color) rounded-4px color-#555 cursor-pointer hover:borderColor-custom-var(--el-color-primary) hover:background-custom-var(--el-color-primary-light-9)"
      @click="handleCopy(item)">
      <el-icon :size="24">
        <IconMenu v-if="item === 'Menu'" />
        <component v-else :is="item" />
      </el-icon>
      <div class="mt-2 font-size-12px">{{ item }}</div>
    </div>
  </div>
</template>

<script setup>
import { useClipboard } from '@vueuse/core'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { useMessage } from '@/hooks/use-message'

const { showSuccessMessage } = useMessage()

const iconList = reactive(Object.keys(ElementPlusIconsVue))

const { copy, isSupported } = useClipboard()

const handleCopy = (value) => {
  if (isSupported) {
    copy(value)
    showSuccessMessage('Copied!', { grouping: true })
  }
}
</script>

<style lang="scss" scoped>
.demo-icons-wrapper {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 16px;
}
</style>