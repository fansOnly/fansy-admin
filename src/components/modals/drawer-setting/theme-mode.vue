<template>
  <div class="mt-20px">
    <div class="mb-10px font-size-18px font-500">主题</div>
    <div class="grid grid-cols-3 gap-8px text-center">
      <div v-for="(item) in THEME_PRESETS" :key="item.value" @click="onThemeChange(item)">
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
import { THEME_PRESETS } from '@/constants/settings'
import { useToggle } from '@vueuse/core'
import { useTheme } from '@/hooks/use-theme';
import { useGlobalStore } from '@/store/app'

const globalStore = useGlobalStore()
const { isDark, toggleDark } = useTheme()
const theme = globalStore.preference.theme

const onThemeChange = (item) => {
  if (theme.mode === item.value) return
  theme.mode = item.value
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (item.value === 'auto') {
    if (dark !== isDark.value) {
      toggleDark()
    }
  } else {
    if (dark !== isDark.value) {
      useToggle(isDark)
    }
    if (item.value === 'dark' && !isDark.value || item.value === 'light' && isDark.value) {
      toggleDark()
    }
  }
}
</script>

<style lang="scss" scoped></style>