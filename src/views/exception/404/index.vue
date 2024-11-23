<template>
  <el-result title="404" sub-title="抱歉, 你访问的页面不存在。">
    <template #icon>
      <el-image src="https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg" />
    </template>
    <template #extra>
      <el-button type="default" @click="onBack">返回上一页</el-button>
      <el-button type="primary" @click="onBackHome">回到首页</el-button>
    </template>
  </el-result>
</template>

<script setup>
  const router = useRouter()
  const onBack = () => {
    router.go(-1)
  }
  const onBackHome = () => {
    router.push('/')
  }
</script>