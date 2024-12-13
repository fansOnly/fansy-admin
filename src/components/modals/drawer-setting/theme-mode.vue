<template>
  <div class="mt-20px">
    <div class="mb-10px font-size-18px font-500">主题</div>
    <div class="grid grid-cols-3 gap-8px text-center">
      <div v-for="(item) in THEME_PRESET" :key="item.value" @click="onThemeChange(item)">
        <div class="flex-[center,center,column] h-50px b-2px b-solid rounded-6px cursor-pointer"
          :class="[theme.mode === item.value ? 'borderColor-custom-var(--el-color-primary)' : 'borderColor-custom-var(--el-border-color)']">
          <svg-icon :name="item.value" width="20px" />
        </div>
        <div class="mt-4px font-size-12px color-custom-var(--el-text-color-secondary)">{{ item.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { THEME_PRESET } from '@/constants/settings'
import { useGlobalStore } from '@/store/app'

const globalStore = useGlobalStore()
const theme = computed(() => globalStore.preference.theme)

const onThemeChange = (item) => {
  if (theme.value.mode === item.value) return
  theme.value.mode = item.value
  globalStore.setThemeMode(item.value)
}
</script>

<style lang="scss" scoped></style>