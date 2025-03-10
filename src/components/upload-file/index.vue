<template>
  <el-upload ref="uploadRef" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
    :show-file-list="false" drag with-credentials v-bind="attrs" :on-success="emit('on-success')"
    :before-upload="onBeforeUpload" :on-change="emit('on-change')" :on-remove="emit('on-remove')"
    class="fansy-upload-file">
    <slot>
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        拖拽文件到这里或者 <em>点击上传</em>
      </div>
    </slot>
    <template #tip>
      <slot name="tip">
        <div class="el-upload__tip">{{ tip }}</div>
      </slot>
    </template>
  </el-upload>
</template>

<script setup>
const props = defineProps({
  accept: {
    type: String,
    default: '.txt,.doc,.docx'
  },
  tip: {
    type: String,
    default: '支持格式：.txt,.doc,.docx，大小不超过50MB'
  }
})
const emit = defineEmits(['on-success', 'on-change', 'before-upload'])
const attrs = useAttrs();

const uploadRef = ref(null)

const onBeforeUpload = (rawFile) => {
  const maxSize = attrs?.maxSize || 50
  if (!props.accept.includes(rawFile.type)) {
    ElMessage.error('文件必须是 TXT, DOC, DOCX 格式！')
    emit('before-upload', rawFile, false)
    return false
  } else if (rawFile.size / 1024 / 1024 > maxSize) {
    ElMessage.error(`文件大小不能超过 ${maxSize}MB！`)
    emit('before-upload', rawFile, false)
    return false
  }
  emit('before-upload', rawFile, true)
  return true
}

function submit() {
  uploadRef.value?.submit()
}

defineExpose({
  submit
})
</script>

<style lang="scss" scoped>
.fansy-upload-file {
  width: 100%;
}
</style>