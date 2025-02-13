<template>
  <div v-loading="loading" class="fansy-iframe-container">
    <iframe :src="src" class="fansy-iframe" @load="hideLoading"></iframe>
  </div>
</template>

<script setup>
const props = defineProps({
  src: String
})

const loading = ref(true)
const hideLoading = () => {
  loading.value = false
}

defineOptions({
  name: 'IframePage'
})
</script>

<style lang="scss" scoped>
.fansy-iframe-container {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
}

.fansy-iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
