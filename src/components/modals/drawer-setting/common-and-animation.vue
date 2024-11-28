<template>
  <div class="mt-20px">
    <div class="mb-10px font-size-18px font-500">通用</div>
    <div
      class="flex-[center,space-between] mb-10px px-8px py-4px rounded-4px hover:background-custom-var(--el-fill-color-light)">
      <div class="">语言</div>
      <el-select v-model="app.language" style="width: 120px">
        <el-option label="简体中文" value="zh"></el-option>
        <el-option label="English" value="en"></el-option>
      </el-select>
    </div>
    <div
      class="flex-[center,space-between] mb-10px px-8px py-4px rounded-4px hover:background-custom-var(--el-fill-color-light)">
      <div class="">开启水印</div>
      <el-switch v-model="app.watermark" />
    </div>
  </div>
  <div class="mt-20px">
    <div class="mb-10px font-size-18px font-500">动画效果</div>
    <div
      class="flex-[center,space-between] mb-10px px-8px py-4px rounded-4px hover:background-custom-var(--el-fill-color-light)">
      <div class="">页面加载进度条</div>
      <el-switch v-model="transition.progress" />
    </div>
    <div
      class="flex-[center,space-between] mb-10px px-8px py-4px rounded-4px hover:background-custom-var(--el-fill-color-light)">
      <div class="">页面加载动画</div>
      <el-switch v-model="transition.loading" />
    </div>
    <div
      class="flex-[center,space-between] mb-10px px-8px py-4px rounded-4px hover:background-custom-var(--el-fill-color-light)">
      <div class="">页面切换动画</div>
      <el-switch v-model="transition.enable" />
    </div>
    <div v-if="transition.enable" class="flex-[center,space-between] mb-10px px-8px py-4px">
      <div v-for="(item, index) in transitionPreset" :key="index"
        class="w-72px h-72px p-8px b b-solid rounded-4px cursor-pointer"
        :class="[transition.name === item ? 'b-2px borderColor-custom-var(--el-color-primary)' : 'borderColor-custom-var(--el-border-color)']"
        @click="transition.name = item">
        <div class="w-56px h-56px background-custom-var(--el-fill-color-lighter) rounded-4px" :class="`${item}-slow`">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGlobalStore } from '@/store/app';

const globalStore = useGlobalStore();
const transition = globalStore.preference.transition
const app = globalStore.preference.app

const transitionPreset = ['fade', 'fade-slide', 'fade-up', 'fade-down'];

</script>

<style lang="scss" scoped></style>