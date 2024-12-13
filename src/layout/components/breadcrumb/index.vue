<template>
  <el-breadcrumb v-if="breadcrumb.show" :separator-icon="ArrowRight">
    <el-breadcrumb-item v-if="breadcrumb.home && current.name !== 'Index'" :to="{ path: '/' }">
      <div class="flex-[center]">
        <el-icon v-if="breadcrumb.icon" class="mr-2px">
          <House />
        </el-icon>首页
      </div>
    </el-breadcrumb-item>
    <template v-for="item in matchedList" :key="item.name">
      <el-breadcrumb-item v-if="!item.redirect" :to="{ path: item.path }">
        <div class="flex-[center]">
          <el-icon v-if="breadcrumb.icon && item.meta.icon" class="mr-2px">
            <component :is="item.meta.icon" />
          </el-icon>
          {{ item.meta.title }}
        </div>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-else>
        <div class="flex-[center]">
          <el-icon v-if="breadcrumb.icon && item.meta.icon" class="mr-2px">
            <component :is="item.meta.icon" />
          </el-icon>
          {{ item.meta.title }}
        </div>
      </el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { useGlobalStore } from '@/store/app'
const globalStore = useGlobalStore()
const router = useRouter()

const current = router.currentRoute
const matchedList = computed(() => current.value.matched.filter(v => v.meta?.title))
const breadcrumb = computed(() => globalStore.preference.breadcrumb)
</script>