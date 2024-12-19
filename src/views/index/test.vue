<template>
  <div class="test-page">
    <div>this is test page</div>
    <div class=""></div>
  </div>
</template>

<script setup>
import { testApi } from "@/api/index";

async function test(a) {
  try {
    const data = await testApi({ a: 1, b: 2 });
  } catch (error) {

  }
}

async function testList() {
  try {
    await Promise.all([test(1), test(2), test(3)])
  } catch (error) {

  }
}


testList()
</script>

<style lang="scss" scoped>
.test-page {
  height: 100vh;
  overflow-y: auto;
}
</style>
