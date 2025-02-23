<template>
  <div class="mt-20px">
    <div class="mb-10px font-size-18px font-500">内置主题</div>
    <div class="grid grid-cols-3 gap-8px text-center">
      <div v-for="item in THEME_COLORS_PRESET" :key="item.value" @click="onClickBuiltin(item)">
        <div class="flex-[center,center,column] h-50px b-2px b-solid rounded-6px cursor-pointer"
          :class="[theme.builtin === item.value ? 'borderColor-custom-var(--el-color-primary)' : 'borderColor-custom-var(--el-border-color)']">
          <template v-if="item.value === 'custom'">
            <el-icon size="20px">
              <MagicStick />
            </el-icon>
            <div class="w-0 h-0 overflow-hidden">
              <el-color-picker ref="colorPickerRef" v-model="color" color-format="hex" :show-alpha="false"
                @change="onColorChange" />
            </div>
          </template>
          <div v-else class="w-20px h-20px rounded-4px"
            :style="`background-color: ${item.value === 'default' ? theme.primary : item.value};`">
          </div>
        </div>
        <div class="mt-4px font-size-12px color-custom-var(--el-text-color-secondary)">{{ item.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { THEME_COLORS_PRESET } from '@/constants/settings'
import { useGlobalStore } from '@/store/app'
const globalStore = useGlobalStore()

const colorPickerRef = ref(null)
const color = ref(globalStore.preference.theme.builtin)
const theme = computed(() => globalStore.preference.theme)

const onClickBuiltin = (item) => {
  if (item.value === 'custom') {
    color.value = theme.value.color
    colorPickerRef.value[0].show()
  } else if (theme.value.builtin !== item.value) {
    theme.value.builtin = item.value
    globalStore.setPrimaryColor(item.value === 'default' ? theme.value.primary : item.value)
  }
}

const onColorChange = (color) => {
  theme.value.builtin = 'custom'
  theme.value.color = color
  globalStore.setPrimaryColor(color)

}
</script>

<style lang="scss" scoped></style>