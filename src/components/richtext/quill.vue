<template>
  <div class="position-relative">
    <div id="editor" :style="{ height }"></div>
  </div>
</template>

<script setup>
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

const html = defineModel('html')
const props = defineProps({
  height: { type: String, default: '300px' }
})

let quill = null

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  // ['blockquote', 'code-block'],

  [{ font: [] }],
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
      toolbar: toolbarOptions
    },
    placeholder: 'Compose an epic...',
    theme: 'snow'
  })

  watchEffect(() => {
    if (html.value) {
      quill.root.innerHTML = html.value
    }
  })

  quill.on('text-change', function (delta, oldDelta, source) {
    html.value = quill.root.innerHTML
  })
})

onUnmounted(() => {
  quill?.destroy?.()
})
</script>

<style lang="scss" scoped></style>