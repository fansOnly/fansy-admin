<template>
  <div class="mt-20px">
    <div class="mb-10px font-size-18px font-500">内置主题</div>
    <div class="grid grid-cols-3 gap-8px text-center">
      <div v-for="item in THEME_COLORS_PRESETS" :key="item.value" @click="onClickBuiltin(item)">
        <div class="flex-[center,center,column] h-50px b-2px b-solid rounded-6px cursor-pointer"
          :class="[theme.builtin === item.value ? 'borderColor-custom-var(--el-color-primary)' : 'borderColor-custom-var(--el-border-color)']">
          <template v-if="item.value === 'custom'">
            <el-icon size="20px">
              <MagicStick />
            </el-icon>
            <div class="w-0 h-0 overflow-hidden">
              <el-color-picker ref="colorPickerRef" v-model="color" show-alpha @change="onColorChange" />
            </div>
          </template>
          <div v-else class="w-20px h-20px rounded-4px"
            :style="`background-color: ${item.value === 'default' ? theme.primary : item.value};`"></div>
        </div>
        <div class="mt-4px font-size-12px color-custom-var(--el-text-color-secondary)">{{ item.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { THEME_COLORS_PRESETS } from '@/constants/settings'
import { useGlobalStore } from '@/store/app'
const globalStore = useGlobalStore()

const dom = document.documentElement
const theme = globalStore.preference.theme

const colorPickerRef = ref(null)
const color = ref(theme.builtin)

const onClickBuiltin = (item) => {
  if (item.value === 'custom') {
    color.value = theme.color
    colorPickerRef.value[0].show()
  } else if (theme.builtin !== item.value) {
    theme.builtin = item.value
    dom.style.setProperty('--el-color-primary', item.value === 'default' ? theme.primary : item.value)
  }
}

const onColorChange = (color) => {
  theme.builtin = 'custom'
  theme.color = color
  dom.style.setProperty('--el-color-primary', color)
}
</script>

<style lang="scss" scoped></style>