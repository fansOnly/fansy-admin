<template>
  <div class="fansy-wang" :style="{ 'z-index': zIndex }">
    <Toolbar class="fansy-wang-toolbar" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
    <Editor class="fansy-wang-editor" :style="{ 'height': height + 'px' }" v-model="html" :defaultConfig="editorConfig"
      :mode="mode" @onCreated="handleCreated" />
  </div>
</template>

<script setup>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { DomEditor } from '@wangeditor/editor'

const html = defineModel('html')
const props = defineProps({
  height: { type: Number, default: 500 },
  placeholder: { type: String, default: '请输入内容...' },
  zIndex: { type: Number, default: 1 }
})
const emit = defineEmits(['click'])

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
const toolbarConfig = {
  excludeKeys: [
    'group-more-style',
    'emotion',
    'insertLink',
    'group-image',
    'group-video',
    'codeBlock',
    'todo'
  ]
}
const editorConfig = { placeholder: props.placeholder }
const mode = 'default'

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
  // const toolbar = DomEditor.getToolbar(editor)
  // const curToolbarConfig = toolbar.getConfig()
  // console.log(curToolbarConfig.toolbarKeys) // 当前菜单排序和分组
}

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>

<style lang="scss" scoped>
.fansy-wang {
  position: relative;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
}

.fansy-wang-toolbar {
  border-bottom: 1px solid #efefef;
}

.fansy-wang-editor {
  overflow-y: hidden;
}
</style>