<template>
  <el-breadcrumb>
    <el-breadcrumb-item v-if="current.name !== 'Index'" :to="{ path: '/' }">首页</el-breadcrumb-item>
    <template v-for="item in matchedList" :key="item.name">
      <el-breadcrumb-item v-if="!item.redirect" :to="{ path: item.path }">{{ item.meta.title }}</el-breadcrumb-item>
      <el-breadcrumb-item v-else>{{ item.meta.title }}</el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>

<script setup>
const router = useRouter()
const current = router.currentRoute
const matchedList = computed(() => current.value.matched.filter(v => v.meta?.title))
</script>