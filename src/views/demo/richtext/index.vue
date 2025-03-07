<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="froala" name="froala">
        <div>{{ content }}</div>
        <froala-editor v-model:html="content" />
      </el-tab-pane>
      <el-tab-pane label="wang" name="wang">
        <div>{{ content }}</div>
        <wang-editor v-model:html="content" />
      </el-tab-pane>
      <el-tab-pane label="quill" name="quill">
        <div>{{ content }}</div>
        <quill-editor v-model:html="content" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import QuillEditor from '@/components/richtext/quill.vue'
import FroalaEditor from '@/components/richtext/froala.vue'
import wangEditor from '@/components/richtext/wang-editor.vue'

const activeName = ref('froala')
const content = ref('')
</script>

<style lang="scss" scoped></style>