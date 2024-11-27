<template>
  <div class="mt-20px">
    <div class="mb-10px font-size-18px font-500">布局</div>
    <div class="grid grid-cols-3 gap-8px text-center">
      <div v-for="item in menuLayouts" :key="item.value" @click="onClickItem(item)">
        <div class="flex-[center,center] p-4px b-2px b-solid rounded-6px cursor-pointer"
          :class="[layout.menu === item.value ? 'borderColor-custom-var(--el-color-primary)' : 'borderColor-custom-var(--el-border-color)']">
          <component :is="componentMap[item.icon]" />
        </div>
        <div class="mt-4px font-size-12px color-custom-var(--el-text-color-secondary)">{{ item.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import MenuHorizontal from './svg-menu-horizontal.vue';
import MenuVertical from './svg-menu-vertical.vue';
import MenuVerticalDouble from './svg-menu-vertical-double.vue';
import { useGlobalStore } from '@/store/app'
const globalStore = useGlobalStore()
const layout = globalStore.preference.layout

const menuLayouts = [
  { label: '侧边菜单', value: 'vertical', icon: 'menu-vertical' },
  { label: '侧边双列菜单', value: 'vertical-double', icon: 'menu-vertical-double' },
  { label: '顶部菜单', value: 'horizontal', icon: 'menu-horizontal' },
]
const componentMap = {
  'menu-horizontal': MenuHorizontal,
  'menu-vertical': MenuVertical,
  'menu-vertical-double': MenuVerticalDouble,
}

const onClickItem = (item) => {
  layout.menu = item.value
}
</script>

<style lang="scss" scoped></style>