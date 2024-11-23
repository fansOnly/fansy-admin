<template>
  <fansy-drawer v-model="show" title="文件预览" width="800" @cancel="emit('cancel')" @confirm="emit('confirm')">
    <div v-loading="loading" class="preview-container">
      <iframe v-if="isOfficeFile || isPdfFile" :src="previewUrl" frameborder="0" width="100%" height="100%"
        @load="loading = false"></iframe>
      <template v-else>
        <div v-html="previewContent" class="preview-content"></div>
      </template>
    </div>
    <template #footer></template>
  </fansy-drawer>
</template>

<script setup>
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const show = defineModel('show')
const props = defineProps({
  url: String
})
const emit = defineEmits(['cancel', 'confirm'])

const officeOnlineUrl = 'https://view.officeapps.live.com/op/embed.aspx?src='
const loading = ref(false)
const previewUrl = ref('')
const previewContent = ref('')
const isOfficeFile = computed(() => {
  return props.url.endsWith('.docx') || props.url.endsWith('.xlsx') || props.url.endsWith('.pptx')
})
const isPdfFile = computed(() => {
  return props.url.endsWith('.pdf')
})
const isTxtFile = computed(() => {
  return props.url.endsWith('.txt')
})
const isMarkdownFile = computed(() => {
  return props.url.endsWith('.md')
})

const getFileContent = async () => {
  try {
    loading.value = true
    const response = await fetch(props.url)
    const content = await response.text()
    // console.log('content: ', content)
    return content
  } catch (error) {
    console.log('解析文件失败: ', error)
  } finally {
    loading.value = false
  }
}

watchEffect(async () => {
  if (isOfficeFile.value) {
    previewUrl.value = officeOnlineUrl + encodeURIComponent(props.url)
  } else if (isPdfFile.value) {
    previewUrl.value = props.url
  } else if (isTxtFile.value) {
    const data = await getFileContent()
    previewContent.value = DOMPurify.sanitize(data.replace(/\n/g, '<br>'))
  } else if (isMarkdownFile.value) {
    const data = await getFileContent()
    previewContent.value = DOMPurify.sanitize(marked.parse(data))
  }
})
</script>

<style lang="scss" scoped>
.preview-container {
  height: 100%;
}

.preview-content {
  padding: 0 20px;
}
</style>
