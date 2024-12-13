<template>
  <div class="mt-20px">
    <div class="mb-10px font-size-18px font-500">侧边栏</div>
    <div
      class="flex-[center,space-between] mb-10px px-8px py-4px rounded-4px hover:background-custom-var(--el-fill-color-light)">
      <div class="">显示侧边栏</div>
      <el-switch v-model="sidebar.show" :disabled="menu.mode === 'horizontal'" />
    </div>
    <div
      class="flex-[center,space-between] mb-10px px-8px py-4px rounded-4px hover:background-custom-var(--el-fill-color-light)">
      <div class="">折叠侧边栏</div>
      <el-switch v-model="sidebar.collapse" :disabled="!sidebar.show || menu.mode === 'horizontal'" />
    </div>
    <div
      class="flex-[center,space-between] mb-10px px-8px py-4px rounded-4px hover:background-custom-var(--el-fill-color-light)">
      <div class="">折叠显示菜单名</div>
      <el-switch v-model="sidebar.collapsedTitle"
        :disabled="!sidebar.show || !sidebar.collapse || menu.mode === 'horizontal'" />
    </div>
  </div>
  <div class="mt-20px">
    <div class="mb-10px font-size-18px font-500">导航菜单</div>
    <div
      class="flex-[center,space-between] mb-10px px-8px py-4px rounded-4px hover:background-custom-var(--el-fill-color-light)">
      <div class="">菜单风格</div>
      <el-radio-group v-model="menu.style">
        <el-radio-button label="圆润" value="round" />
        <el-radio-button label="朴素" value="default" />
      </el-radio-group>
    </div>
    <div
      class="flex-[center,space-between] mb-10px px-8px py-4px rounded-4px hover:background-custom-var(--el-fill-color-light)">
      <div class="">手风琴模式</div>
      <el-switch v-model="menu.accordion" />
    </div>
  </div>
  <div class="mt-20px">
    <div class="mb-10px font-size-18px font-500">面包屑</div>
    <div
      class="flex-[center,space-between] mb-10px px-8px py-4px rounded-4px hover:background-custom-var(--el-fill-color-light)">
      <div class="">开启面包屑</div>
      <el-switch v-model="breadcrumb.show" :disabled="menu.mode === 'horizontal'" />
    </div>
    <div
      class="flex-[center,space-between] mb-10px px-8px py-4px rounded-4px hover:background-custom-var(--el-fill-color-light)">
      <div class="">显示首页</div>
      <el-switch v-model="breadcrumb.home" :disabled="menu.mode === 'horizontal'" />
    </div>
    <div
      class="flex-[center,space-between] mb-10px px-8px py-4px rounded-4px hover:background-custom-var(--el-fill-color-light)">
      <div class="">显示图标</div>
      <el-switch v-model="breadcrumb.icon" :disabled="menu.mode === 'horizontal'" />
    </div>
  </div>
  <div class="mt-20px">
    <div class="mb-10px font-size-18px font-500">标签栏</div>
    <div
      class="flex-[center,space-between] mb-10px px-8px py-4px rounded-4px hover:background-custom-var(--el-fill-color-light)">
      <div class="">开启标签栏</div>
      <el-switch v-model="navbar.show" />
    </div>
    <div
      class="flex-[center,space-between] mb-10px px-8px py-4px rounded-4px hover:background-custom-var(--el-fill-color-light)">
      <div class="">开启拖拽</div>
      <el-switch v-model="navbar.draggable" />
    </div>
    <div
      class="flex-[center,space-between] mb-10px px-8px py-4px rounded-4px hover:background-custom-var(--el-fill-color-light)">
      <div class="">显示图标</div>
      <el-switch v-model="navbar.icon" />
    </div>
    <div
      class="flex-[center,space-between] mb-10px px-8px py-4px rounded-4px hover:background-custom-var(--el-fill-color-light)">
      <div class="">显示更多</div>
      <el-switch v-model="navbar.more" />
    </div>
    <div
      class="flex-[center,space-between] mb-10px px-8px py-4px rounded-4px hover:background-custom-var(--el-fill-color-light)">
      <div class="">显示最大化</div>
      <el-switch v-model="navbar.maximize" />
    </div>
    <div
      class="flex-[center,space-between] mb-10px px-8px py-4px rounded-4px hover:background-custom-var(--el-fill-color-light)">
      <div class="">标签栏风格</div>
      <el-radio-group v-model="navbar.style">
        <el-radio-button label="谷歌" value="google" />
        <el-radio-button label="朴素" value="default" />
      </el-radio-group>
    </div>
    <div class="mt-20px">
      <div class="mb-10px font-size-18px font-500">小组件</div>
      <div
        class="flex-[center,space-between] mb-10px px-8px py-4px rounded-4px hover:background-custom-var(--el-fill-color-light)">
        <div class="">开启搜索</div>
        <el-switch v-model="widget.search" />
      </div>
      <div
        class="flex-[center,space-between] mb-10px px-8px py-4px rounded-4px hover:background-custom-var(--el-fill-color-light)">
        <div class="">开启设置</div>
        <el-switch v-model="widget.settings" />
      </div>
      <div
        class="flex-[center,space-between] mb-10px px-8px py-4px rounded-4px hover:background-custom-var(--el-fill-color-light)">
        <div class="">开启全屏</div>
        <el-switch v-model="widget.fullscreen" />
      </div>
      <div
        class="flex-[center,space-between] mb-10px px-8px py-4px rounded-4px hover:background-custom-var(--el-fill-color-light)">
        <div class="">开启主题</div>
        <el-switch v-model="widget.theme" />
      </div>
      <div
        class="flex-[center,space-between] mb-10px px-8px py-4px rounded-4px hover:background-custom-var(--el-fill-color-light)">
        <div class="">开启语言</div>
        <el-switch v-model="widget.language" />
      </div>
      <div
        class="flex-[center,space-between] mb-10px px-8px py-4px rounded-4px hover:background-custom-var(--el-fill-color-light)">
        <div class="">开启通知</div>
        <el-switch v-model="widget.notice" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGlobalStore } from '@/store/app';
import { computed } from 'vue';

const globalStore = useGlobalStore();
const sidebar = computed(() => globalStore.preference.sidebar)
const menu = computed(() => globalStore.preference.menu)
const breadcrumb = computed(() => globalStore.preference.breadcrumb)
const navbar = computed(() => globalStore.preference.navbar)
const widget = computed(() => globalStore.preference.widget)

</script>

<style lang="scss" scoped></style>