<template>
  <div class="">
    <h1>Artalk 评论系统</h1>
    <div id="Comments" ref="comment"></div>
  </div>
</template>

<script setup>
import 'artalk/Artalk.css'
import Artalk from 'artalk'

let artalk = null
const comment = ref(null)

onMounted(() => {
  artalk = Artalk.init({
    // el: document.querySelector('#Comments'), // 挂载的 DOM 元素
    el: comment.value, // 挂载的 DOM 元素
    pageKey: '/post/1',                           // 固定链接
    pageTitle: '关于引入 Artalk 的这档子事',           // 页面标题
    server: '/api-artalk',    // 后端地址
    site: 'Artalk 的博客',                      // 站点名
  })
})

onBeforeUnmount(() => {
  artalk?.destroy()
  artalk = null
})
</script>

<style lang="scss" scoped></style>