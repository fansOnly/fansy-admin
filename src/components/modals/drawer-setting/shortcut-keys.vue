<template>
  <div class="mt-20px">
    <div class="mb-10px font-size-18px font-500">全局快捷键</div>
    <div
      class="flex-[center,space-between] mb-10px px-8px py-4px rounded-4px hover:background-custom-var(--el-fill-color-light)">
      <div class="">启用快捷键</div>
      <el-switch v-model="shortcutKeys.enable" />
    </div>
    <div
      class="flex-[center,space-between] mb-10px px-8px py-4px rounded-4px hover:background-custom-var(--el-fill-color-light)">
      <div class="">全局搜索</div>
      <div class="flex-[center]">
        <span class="mr-6px color-custom-var(--el-text-color-secondary) font-size-12px">{{ shortKeyCtrl }} K</span>
        <el-switch v-model="shortcutKeys.search" />
      </div>
    </div>
    <div
      class="flex-[center,space-between] mb-10px px-8px py-4px rounded-4px hover:background-custom-var(--el-fill-color-light)">
      <div class="">锁定屏幕</div>
      <div class="flex-[center]">
        <span class="mr-6px color-custom-var(--el-text-color-secondary) font-size-12px">{{ shortKeyCtrl }} L</span>
        <el-switch v-model="shortcutKeys.lock" />
      </div>
    </div>
    <div
      class="flex-[center,space-between] mb-10px px-8px py-4px rounded-4px hover:background-custom-var(--el-fill-color-light)">
      <div class="">退出登录</div>
      <div class="flex-[center]">
        <span class="mr-6px color-custom-var(--el-text-color-secondary) font-size-12px">{{ shortKeyAlt }} Q</span>
        <el-switch v-model="shortcutKeys.logout" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { isMacOS } from '@/utils/index'
import { useGlobalStore } from '@/store/app';

const globalStore = useGlobalStore();
const shortcutKeys = computed(() => globalStore.preference.shortcutKeys)
const shortKeyAlt = computed(() => isMacOS ? '⌥' : 'Alt')
const shortKeyCtrl = computed(() => isMacOS ? '⌘' : 'Ctrl')

</script>

<style lang="scss" scoped></style>