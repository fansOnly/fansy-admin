<template>
  <div class="puzzle-home">
    <puzzle-verify :width="400" :height="300" :imgs="imgList" @success="onSuccess" @fail="onFail" />
  </div>
</template>

<script setup>
import puzzleVerify from '@/components/puzzle-verify/index.vue'
import { useMessage } from '@/hooks';
const { showSuccessMessage } = useMessage();

const imgList = []
for (let i = 1; i <= 20; i++) {
  imgList.push(`https://picsum.photos/id/${i}/400/300`)
}

const onSuccess = (time) => {
  console.log('success', time + 'ms')
  showSuccessMessage(`用时 ${time / 1000}s`)
}

const onFail = () => {
  console.log('fail')
}

</script>

<style lang="scss" scoped></style>