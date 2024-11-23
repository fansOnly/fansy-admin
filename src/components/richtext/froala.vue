<template>
  <div class="fs-froala">
    <froala id="edit" :tag="'textarea'" :config="config" v-model:value="html"></froala>
  </div>
</template>

<script setup>
import VueFroala from 'vue-froala-wysiwyg'
//Import Froala Editor
import 'froala-editor/js/plugins.pkgd.min.js'
//Import third party plugins
// import 'froala-editor/js/third_party/embedly.min'
// import 'froala-editor/js/third_party/font_awesome.min'
// import 'froala-editor/js/third_party/spell_checker.min'
import 'froala-editor/js/third_party/image_tui.min'
import 'froala-editor/js/plugins/files_manager.min'
import 'froala-editor/css/froala_editor.pkgd.min.css'
import 'froala-editor/js/languages/zh_cn'

import { getCurrentInstance } from 'vue'
const vueInstance = getCurrentInstance()
vueInstance?.appContext.app.use(VueFroala)

const html = defineModel('html')
const props = defineProps({
  height: { type: Number, default: 300 },
  placeholder: { type: String, default: 'Edit Your Content Here!' },
  zIndex: { type: Number, default: 1 }
})

const config = {
  height: props.height,
  heightMax: 300,
  zIndex: props.zIndex,
  placeholderText: props.placeholder,
  language: 'zh_cn',
  // pastePlain: true, // 黏贴格式化
  imageUploadURL: 'http://i.froala.com/upload',
  imageCORSProxy: 'https://cors-anywhere.froala.com',
  // imageUploadParams: {},
  imageAddNewLine: true,
  /**
   * 图片管理 E.g.
   * @param {Object} images
   * @param {string} image.url [required] http://exmaple.com/images/photo1.jpg
   * @param {string} image.thumb [recommended] http://exmaple.com/thumbs/photo1.jpg
   * @param {string} image.tag [optional] flower
   * @param {string} image.id  data-id
   * @param {string} image.name  data-name
   */
  imageManagerLoadURL: 'https://i.froala.com/load-files',
  fileUploadURL: 'http://i.froala.com/upload',
  filesManagerUploadURL: 'http://i.froala.com/upload',
  toolbarButtons: {
    moreText: {
      buttons: [
        'bold',
        'italic',
        'fontFamily',
        'fontSize',
        'textColor',
        'backgroundColor',
        'underline',
        'strikeThrough',
        // 'subscript',
        // 'superscript',
        // 'inlineClass',
        // 'inlineStyle',
        'clearFormatting'
      ],
      buttonsVisible: 6
    },
    moreParagraph: {
      buttons: [
        'align',
        // 'formatOLSimple',
        'formatOL',
        'formatUL',
        'lineHeight',
        'outdent',
        'indent',
        'paragraphFormat',
        'paragraphStyle',
        'quote'
      ],
      buttonsVisible: 6
    },
    moreRich: {
      buttons: [
        'insertLink',
        'insertImage',
        'insertVideo',
        'insertTable',
        'insertFile',
        'emoticons',
        // 'insertFiles',
        // 'fontAwesome',
        'specialCharacters',
        // 'embedly',
        'insertHR'
      ],
      buttonsVisible: 6
    },
    moreMisc: {
      buttons: [
        'undo',
        'redo',
        'fullscreen',
        'help',
        // 'print',
        // 'getPDF',
        // 'spellChecker',
        'selectAll',
        'html'
      ],
      align: 'right',
      buttonsVisible: 4
    }
  },
  events: {
    initialized: function () {
      // console.log('initialized')
    }
  }
}
</script>

<style lang="scss" scoped>
.fs-froala :deep(#fr-logo) {
  display: none !important;
}
</style>