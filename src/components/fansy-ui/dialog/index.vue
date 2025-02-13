<template>
  <el-dialog v-model="show" class="fansy-dialog" style="--el-dialog-border-radius: 8px;">
    <template v-if="slots.header" #header>
      <slot name="header"></slot>
    </template>
    <template #default>
      <slot></slot>
    </template>
    <template v-if="slots.footer" #footer>
      <slot name="footer">
        <div style="flex: auto">
          <el-button :disabled="disabled" @click="emit('cancel')">{{ cancelText }}</el-button>
          <el-button :disabled="disabled" type="primary" @click="emit('confirm')">{{ confirmText }}</el-button>
        </div>
      </slot>
    </template>
  </el-dialog>
</template>

<script setup>
const show = defineModel('show', false)
const props = defineProps({
  cancelText: {
    type: String,
    default: '取消'
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['confirm', 'cancel'])
const slots = useSlots()
</script>