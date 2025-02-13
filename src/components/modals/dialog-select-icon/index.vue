<template>
  <el-dialog v-model="show" title="选择图标" width="810">
    <div class="grid icon-list">
      <div v-for="item in iconList" :key="item"
        class="flex-[center,,column] px-4px py-8px rounded-4px cursor-pointer icon-item"
        :class="{ 'is-active': icon === item }" @click="onSelect(item)">
        <el-icon :size="20">
          <IconMenu v-if="item === 'Menu'" />
          <component v-else :is="item" />
        </el-icon>
        <div class="mt-2px font-size-12px whitespace-nowrap">{{ item }}</div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onCancel()">取消</el-button>
        <el-button type="primary" @click="onConfirm()">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const show = defineModel('show')
const emit = defineEmits(['cancel', 'confirm'])

const iconList = reactive(Object.keys(ElementPlusIconsVue))
const icon = ref('')

const onSelect = (item) => {
  icon.value = icon.value === item ? '' : item
}

const onCancel = () => {
  show.value = false
  emit('cancel')
}
const onConfirm = () => {
  emit('confirm', icon.value)
}
</script>

<style lang="scss" scoped>
.icon-list {
  grid-template-columns: repeat(7, 1fr);
  height: 410px;
  overflow-y: auto;
}

.icon-item {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);

  &:hover,
  &.is-active {
    border-color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
  }
}
</style>