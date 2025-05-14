<template>
  <div ref="editorRef" class="w-full h-full"></div>
</template>

<script setup>
import * as monaco from "monaco-editor"
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';
import 'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution';
import 'monaco-editor/esm/vs/basic-languages/html/html.contribution';
import 'monaco-editor/esm/vs/basic-languages/css/css.contribution';
import 'monaco-editor/esm/vs/basic-languages/markdown/markdown.contribution';
import 'monaco-editor/esm/vs/basic-languages/mysql/mysql.contribution';
import 'monaco-editor/esm/vs/basic-languages/php/php.contribution';
import 'monaco-editor/esm/vs/basic-languages/python/python.contribution';
import 'monaco-editor/esm/vs/basic-languages/shell/shell.contribution';
import 'monaco-editor/esm/vs/language/typescript/tsMode';
import 'monaco-editor/esm/vs/language/css/cssMode';
import 'monaco-editor/esm/vs/language/html/htmlMode';
import 'monaco-editor/esm/vs/language/json/jsonMode';
import './monaco-worker.js'

const code = defineModel('code')
const props = defineProps({
  language: {
    type: String,
    default: 'javascript',
  },
  theme: {
    type: String,
    default: 'vs-light',
  }
})

const editorRef = ref(null)
let editorInstance = null

watch([() => props.language, () => props.theme], ([language, theme]) => {
  editorInstance.updateOptions({
    theme,
    language,
  });
})

onMounted(() => {
  editorInstance = monaco.editor.create(editorRef.value, {
    value: code.value,
    theme: props.theme,
    language: props.language,
    automaticLayout: true, // 自适应布局
  });

  editorInstance.onDidChangeModelContent(() => {
    code.value = editorInstance.getValue();
    // console.log('code: ', code.value);
  });
})

onBeforeUnmount(() => {
  editorInstance?.dispose();
});

</script>

<style lang="scss" scoped></style>