<template>
  <div class="px-20px pt-20px overflow-x-hidden" :style="{ height: `calc(100vh - ${globalStore.topHeight}px)` }">
    <el-main class="relative background-custom-var(--fansy-main-bg-color) rounded-8px"
      :style="{ 'overflow': 'hidden', 'min-height': `calc(100% - ${globalStore.layout.footerHeight}px)` }">
      <router-view v-if="loaded" v-slot="{ Component, route }">
        <transition :name="globalStore.preference.transition.name" mode="out-in" appear>
          <keep-alive v-if="route.meta.cache">
            <base-iframe v-if="route.meta.type === 'iframe'" :src="route.meta.src" />
            <component :is="Component" v-else />
          </keep-alive>
          <template v-else>
            <base-iframe v-if="route.meta.type === 'iframe'" :src="route.meta.src" />
            <component :is="Component" v-else />
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