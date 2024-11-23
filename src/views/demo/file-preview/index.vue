<template>
  <div class="file-preview-page">
    <el-button
      class="button"
      @click="
        loadDocxOnline(
          'https://bsddata.oss-cn-hangzhou.aliyuncs.com/virtual_live/common_202411/202411141739208030.docx'
        )
      "
    >
      预览 DOCX 文件
    </el-button>
    <el-button
      class="button"
      @click="loadDocxOnline('https://fansonly.github.io/blogs/assets/test.xlsx')"
    >
      预览 XLSX 文件
    </el-button>
    <el-button
      class="button"
      @click="loadDocxOnline('https://fansonly.github.io/blogs/assets/test.pdf')"
    >
      预览 PDF 文件
    </el-button>
    <el-button
      class="button"
      @click="loadDocxOnline('https://fansonly.github.io/blogs/assets/test.txt')"
    >
      预览 TXT 文件
    </el-button>
    <el-button
      class="button"
      @click="loadDocxOnline('https://fansonly.github.io/blogs/assets/test.md')"
    >
      预览 MD 文件
    </el-button>
    <drawer-preview-file v-model:show="showPreview" :url="docxPreviewUrl" />
  </div>
</template>

<script setup>
import DrawerPreviewFile from '@/components/modals/drawer-preview-file/index.vue'

const docxPreviewUrl = ref('')
const showPreview = ref(false)

const loadDocxOnline = (url) => {
  docxPreviewUrl.value = url
  showPreview.value = true
}
</script>

<style lang="scss" scoped>
.button {
  margin-left: 10px;
}
</style>
