<template>
  <div class="position-relative w-full">
    <div id="editor" :style="{ height }"></div>
  </div>
</template>

<script setup>
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

const fonts = [
  'SimSun',
  'SimHei',
  'Microsoft YaHei',
  'KaiTi',
  'FangSong',
]
const FontAttributor = Quill.import('formats/font');
FontAttributor.whitelist = fonts;
Quill.register(FontAttributor, true);

const html = defineModel('html')
const props = defineProps({
  height: { type: String, default: '300px' },
  placeholder: {
    type: String,
    default: '请输入内容'
  }
})

let quill = null

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  // ['blockquote', 'code-block'],

  [{ font: fonts }],
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ align: [] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  // [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
  ['link', 'image', 'video'],
  // [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  // [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  // [{ direction: 'rtl' }], // text direction

  // [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown

  ['clean'] // remove formatting button
]

onMounted(() => {
  quill = new Quill('#editor', {
    // debug: 'info',
    modules: {
      toolbar: toolbarOptions,
    },
    placeholder: props.placeholder,
    theme: 'snow'
  })

  quill.root.innerHTML = html.value

  quill.on('text-change', function (delta, oldDelta, source) {
    html.value = quill.root.innerHTML
  })
})

onUnmounted(() => {
  quill?.destroy?.()
})
</script>

<style lang="scss">
.ql-snow .ql-tooltip[data-mode='link']::before {
  content: '请输入链接地址:' !important;
}

.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: '保存';
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode='video']::before {
  content: '请输入视频地址:' !important;
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: '14px' !important;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='small']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='small']::before {
  content: '10px' !important;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='large']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='large']::before {
  content: '18px' !important;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='huge']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='huge']::before {
  content: '32px' !important;
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: '文本' !important;
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='1']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='1']::before {
  content: '标题1' !important;
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='2']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='2']::before {
  content: '标题2' !important;
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='3']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
  content: '标题3' !important;
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='4']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='4']::before {
  content: '标题4' !important;
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='5']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='5']::before {
  content: '标题5' !important;
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='6']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='6']::before {
  content: '标题6' !important;
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: '正常' !important;
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='SimSun']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='SimSun']::before {
  content: '宋体' !important;
}

.ql-font-SimSun {
  font-family: 'SimSun';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='SimHei']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='SimHei']::before {
  content: '黑体' !important;
}

.ql-font-SimHei {
  font-family: 'SimHei' !important;
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='Microsoft-YaHei']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='Microsoft-YaHei']::before {
  content: '微软雅黑' !important;
}

.ql-font-Microsoft-YaHei {
  font-family: 'Microsoft YaHei';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='KaiTi']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='KaiTi']::before {
  content: '楷体' !important;
}

.ql-font-KaiTi {
  font-family: 'KaiTi';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='FangSong']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='FangSong']::before {
  content: '仿宋' !important;
}

.ql-font-FangSong {
  font-family: 'FangSong';
}
</style>