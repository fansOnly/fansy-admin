<template>
  <div class="page-home">
    <div>this is home page.</div>
    <div>
      <el-button @click="onClick()">实验室</el-button>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()

const onClick = () => {
  router.push('/test')
}
</script>

<style lang="scss" scoped></style>