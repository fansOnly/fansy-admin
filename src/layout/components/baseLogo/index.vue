<template>
  <div
    class="box-border flex-[center,center] px-12px color-custom-var(--el-text-color-primary) b-b-1px b-b-solid borderColor-custom-var(--el-border-color-lighter)"
    :style="{ height: height + 'px' }">
    <el-icon>
      <Sunrise />
    </el-icon>
    <el-icon>
      <Sunny />
    </el-icon>
    <el-icon>
      <Lightning />
    </el-icon>
    <el-icon>
      <MoonNight />
    </el-icon>
    <div v-if="!collapse" class="ml-3">{{ title }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  height: Number,
  collapse: Boolean,
  title: String
})
</script>
