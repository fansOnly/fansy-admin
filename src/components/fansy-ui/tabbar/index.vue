<template>
  <div ref="tabbarRef"
    class="fansy-tabbar flex-[center] relative py-4px px-8px background-custom-var(--el-fill-color) rounded-6px">
    <div
      class="active-bar absolute top-4px left-custom-var(--fansy-tab-bar-left) bottom-4px background-custom-var(--el-fill-color-lighter) rounded-4px z-0 transition-left duration-300">
    </div>
    <div ref="tabbarItemRef" v-for="(item, index) in options" :key="index"
      class="flex-1 rounded-4px text-center line-height-28px transition cursor-pointer z-1"
      @click="onTabbarChange(item, index)">
      {{ item.label }}</div>
  </div>
</template>

<script setup>
import { useElementBounding } from '@vueuse/core'
const props = defineProps({
  options: {
    type: Array,
    default: () => []
  },
  current: Number
})
const emit = defineEmits(['change'])

const tabbarRef = ref(null)
const tabbarItemRef = ref(null)

const onTabbarChange = (item, index) => {
  updateTabbar(index)
  emit('change', item, index)
}

const updateTabbar = (index) => {
  const wrapRect = useElementBounding(tabbarRef.value)
  const el = tabbarItemRef.value[index]
  const rect = useElementBounding(el)
  tabbarRef.value.style.setProperty('--fansy-tab-bar-left', `${rect.left.value - wrapRect.left.value + 2}px`)
}

onMounted(() => {
  if (props.current) {
    nextTick(() => {
      updateTabbar(props.current)
    })
  }
})
</script>

<style lang="scss" scoped>
.fansy-tabbar {
  --fansy-tab-bar-left: 4px;
}

.active-bar {
  width: calc(((100% - 16px) / 4) - 4px);
}
</style>