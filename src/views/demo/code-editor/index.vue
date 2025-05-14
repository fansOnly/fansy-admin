<template>
  <div>
    <div class="p-16px b b-solid b-gray-200 mb-24px">{{ content }}</div>
    <el-row :gutter="24" class="mb-24px">
      <el-col :span="6">
        <el-select v-model="language">
          <el-option v-for="(lan, index) in languageList" :key="index" :label="lan" :value="lan"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-select v-model="theme">
          <el-option v-for="(item, index) in themeList" :key="index" :label="item" :value="item"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="monaco" name="monaco" class="h-580px">
        <monaco-editor v-model:code="content" :language="language" :theme="theme" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import monacoEditor from '@/components/code-editor/monaco-editor.vue';

const languageList = ['javascript', 'typescript', 'html', 'css', 'json', 'python', 'mysql', 'php', 'markdown', 'shell']
const themeList = ['vs-dark', 'vs-light', 'hc-black']

const activeName = ref('monaco')
const theme = ref('vs-light')
const language = ref('javascript')
const content = ref(`function hello() {
	alert('Hello world!');
}`)
</script>

<style lang="scss" scoped></style>