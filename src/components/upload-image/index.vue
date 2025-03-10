<template>
  <div>
    <el-upload ref="uploadRef" v-model:file-list="fileList" list-type="picture-card" :multiple="false" :limit="limit"
      :auto-upload="false" with-credentials v-bind="attrs" :on-change="onChange" :on-success="emit('on-success')"
      :before-upload="file => beforeUpload(file, data)" :on-remove="onRemove" :on-preview="onPreview"
      class="fansy-upload-image" :class="{ 'is-limit': isLimit }">
      <slot>
        <el-icon>
          <Plus />
        </el-icon>
      </slot>
      <template #tip>
        <slot name="tip">
          <div class="el-upload__tip">{{ tip }}</div>
        </slot>
      </template>
    </el-upload>

    <el-dialog v-model="previewVisible">
      <img :src="previewUrl" alt="" class="w-full" />
    </el-dialog>
  </div>
</template>

<script setup>

const props = defineProps({
  accept: {
    type: String,
    default: 'image/jpg,image/jpeg,image/png,image/gif'
  },
  limit: {
    type: Number,
    default: 1
  },
  tip: {
    type: String,
    default: '支持格式：.jpg,.jpeg,.png,.gif，大小不超过10MB'
  }
})
const emit = defineEmits(['before-upload', 'on-change', 'on-success', 'on-remove'])
const attrs = useAttrs()
const fileList = defineModel('fileList')

const isLimit = computed(() => fileList.value && fileList.value.length >= props.limit)

const uploadRef = ref(null)
const previewVisible = ref(false)
const previewUrl = ref('')

function onChange(file, fileList) {
  emit('on-change', file, fileList)
}

function onRemove(file, fileList) {
  emit('on-remove', file, fileList)
}

function onPreview(file) {
  previewUrl.value = file.url
  previewVisible.value = true
}

const beforeUpload = (rawFile) => {
  const maxSize = attrs?.maxSize || 10
  if (!props.accept.includes(rawFile.type)) {
    // ElMessage.error('File must be JPG, PNG or GIF format!')
    ElMessage.error('文件必须是 JPG, PNG, GIF 格式！')
    emit('before-upload', rawFile, false)
    return false
  } else if (rawFile.size / 1024 / 1024 > maxSize) {
    ElMessage.error(`上传的文件大小不能超过 ${maxSize}M!`)
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

<style lang="scss">
.fansy-upload-image {
  width: 100%;
}

.fansy-upload-image.is-limit .el-upload {
  display: none;
}
</style>