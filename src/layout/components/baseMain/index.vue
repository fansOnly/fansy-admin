<template>
  <div class="px-20px pt-20px overflow-x-hidden" :style="{ height: `calc(100vh - ${globalStore.topHeight}px)` }">
    <el-main v-loading="!loaded" class="background-custom-var(--el-fill-color-extra-light) rounded-8px"
      :style="{ 'overflow': 'hidden', 'min-height': `calc(100% - ${globalStore.layout.footerHeight + 20}px)` }">
      <router-view v-slot="{ Component, route }">
        <transition :name="globalStore.preference.transition.name" mode="out-in" appear>
          <keep-alive v-if="route.meta.cache && loaded">
            <base-iframe v-if="route.meta.type === 'iframe'" :src="route.meta.src" />
            <component :is="Component" :key="route.meta.id" v-else />
          </keep-alive>
          <template v-else-if="loaded">
            <base-iframe v-if="route.meta.type === 'iframe'" :src="route.meta.src" />
            <component :is="Component" :key="route.meta.id" v-else />
          </template>
        </transition>
      </router-view>
    </el-main>
    <base-footer />
  </div>
</template>

<script setup>
import { useGlobalStore } from '@/store/app'

defineProps({
  loaded: Boolean
})

const globalStore = useGlobalStore()

defineOptions({
  name: 'BaseMain'
})
</script>

<style lang="scss" scoped></style>