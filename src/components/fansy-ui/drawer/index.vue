<template>
  <el-drawer v-model="show" :size="width" class="fansy-drawer">
    <template v-if="slots.header" #header>
      <slot name="header"></slot>
    </template>
    <template #default>
      <slot></slot>
    </template>
    <template v-if="slots.footer" #footer>
      <slot name="footer">
        <div style="flex: auto">
          <el-button @click="emit('cancel')">{{ cancelText }}</el-button>
          <el-button type="primary" @click="emit('confirm')">{{ confirmText }}</el-button>
        </div>
      </slot>
    </template>
  </el-drawer>
</template>

<script setup>
const show = defineModel('show', false)
const props = defineProps({
  width: {
    type: [String, Number],
    default: '30%'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  confirmText: {
    type: String,
    default: '确定'
  }
})
const emit = defineEmits(['confirm', 'cancel'])
const slots = useSlots()
</script>

<style lang="scss">
.fansy-drawer {
  --el-drawer-padding-primary: 16px;
}

.el-drawer__header {
  margin-bottom: 0;
  padding: var(--el-drawer-padding-primary);
  border-bottom: 1px solid var(--el-border-color-lighter);
}
</style>
