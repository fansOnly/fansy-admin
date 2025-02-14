<template>
  <fansy-dialog v-model="show" title="图片裁剪" width="1000" :disabled="loading" @cancel="handleConfirm"
    @confirm="handleConfirm">
    <cropper v-loading="loading" class="cropper" :src="src" :stencil-props="{
      aspectRatio: 10 / 12
    }" @ready="handleReady" @error="handleError" @change="change"></cropper>
    <template #footer></template>
  </fansy-dialog>
</template>

<script setup>
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css';

const show = defineModel('show')
const props = defineProps({
  src: String,
  name: {
    type: String,
    default: 'image'
  }
})
const emit = defineEmits(['confirm'])

const loading = ref(true)
let _canvas = null

function handleConfirm() {
  if (!_canvas) return
  if (loading.value) return
  loading.value = true

  _canvas.toBlob(blob => {
    const file = new File([blob], `${props.name}.png`, { type: 'image/png' });
    const formData = new FormData();
    formData.append('file', blob, `${props.name}.png`);
    loading.value = false
    show.value = false
    emit('confirm', file, formData)
  }, 'image/png');
}

function change({ coordinates, canvas }) {
  console.log(coordinates, canvas)
  _canvas = canvas
}

function handleReady() {
  console.log('ready')
  loading.value = false
}

function handleError(error) {
  console.log('error', error)
  loading.value = false
}

</script>

<style lang="scss" scoped>
.cropper {
  height: 500px;
}
</style>