<template>
  <el-result title="403" sub-title="抱歉, 您没有权限访问此页面。">
    <template #icon>
      <el-image src="https://gw.alipayobjects.com/zos/rmsportal/wZcnGqRDyhPOEYFcZDnb.svg" />
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