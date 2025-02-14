<template>
  <el-upload ref="uploadRef" v-bind="attrs" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
    :show-file-list="false" :on-success="onUploadSuccess" :before-upload="onBeforeUpload" :on-change="onFileChange">
    <slot></slot>
    <template #tip>
      <slot name="tip"></slot>
    </template>
  </el-upload>
</template>

<script setup>

const props = defineProps({
  name: String,
  accept: {
    type: String,
    default: 'image/jpeg,image/png,image/gif'
  },
  maxSize: {
    type: Number,
    default: 5
  }
})
const emit = defineEmits(['success', 'change'])
const attrs = useAttrs();

const uploadRef = ref(null)

const onUploadSuccess = (
  response,
  uploadFile
) => {
  emit('success', response, uploadFile)
}

function onFileChange(file) {
  emit('change', file)
}

const onBeforeUpload = (rawFile) => {
  if (!props.accept.includes(rawFile.type)) {
    // ElMessage.error('File must be JPG, PNG or GIF format!')
    ElMessage.error('文件必须是 JPG, PNG or GIF 格式！')
    return false
  } else if (rawFile.size / 1024 / 1024 > props.maxSize) {
    // ElMessage.error(`File size can not exceed ${props.maxSize}MB!`)
    ElMessage.error(`文件大小不能超过 ${props.maxSize}MB！`)
    return false
  }
  return true
}
</script>

<style lang="scss" scoped></style>