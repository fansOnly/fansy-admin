<template>
  <div
    class="flex-[center,space-between] background-custom-var(--el-fill-color-blank) border-bottom-[1px,solid,var(--el-border-color-lighter)]"
    :style="{ 'line-height': globalStore.layout.navBarHeight + 'px' }">
    <!-- <el-tabs :model-value="currentNav.name" type="card" class="fansy-nav-bar-tabs flex-1 overflow-auto"
      @tab-click="(panel) => clickItem(panel.paneName)" @tab-remove="removeItem">
      <el-tab-pane v-for="(item, index) in navBarSortedList" :key="index" :name="item.name" :closable="closeable(item)">
        <template #label>
          <span class="flex-[center]">
            <el-icon v-if="item.meta?.icon" class="mr-4px">
              <component :is="item.meta.icon" />
            </el-icon>
            <span>{{ item.meta.title }}</span>
            <svg-icon v-if="item.meta?.affix" name="affix" width="14" class="ml-2px" />
          </span>
        </template>
</el-tab-pane>
</el-tabs> -->
    <div v-show="showArrow"
      class="flex-shrink-0 flex-[center,center] w-24px cursor-pointer hover:color-custom-var(--el-color-primary)">
      <el-icon>
        <ArrowLeft />
      </el-icon>
    </div>
    <el-scrollbar ref="navScrollRef" class="flex-1 scrollbar-hide" @scroll="onScroll">
      <div class="flex-[center]">
        <div v-for="(item, index) in navBarSortedList" :key="index"
          class="nav-item flex-[center] relative mr-1px pl-12px pr-8px b-b-2px b-b-solid cursor-pointer whitespace-nowrap hover:background-custom-var(--el-color-primary-light-9) hover:color-custom-var(--el-color-primary)"
          :class="[currentNavBar.name === item.name ? 'background-custom-var(--el-color-primary-light-9) border-color-custom-var(--el-color-primary) color-custom-var(--el-color-primary)' : 'border-color-transparent']"
          @click="clickItem(item.name)">
          <el-icon v-if="item.meta?.icon" class="mr-4px">
            <component :is="item.meta.icon" />
          </el-icon>
          <span>{{ item.meta.title }}</span>
          <svg-icon v-if="item.meta?.affix" name="affix" width="14" class="ml-8px" />
          <el-icon v-else class="nav-close ml-8px transition" @click.stop="removeItem(item.name)">
            <Close />
          </el-icon>
          <div v-if="index < navBarSortedList.length - 1"
            class="nav-line absolute right-0 h-14px w-1px bg-#e4e4e7 transition"></div>
        </div>
      </div>
    </el-scrollbar>
    <div v-show="showArrow"
      class="flex-shrink-0 flex-[center,center] w-24px cursor-pointer hover:color-custom-var(--el-color-primary)">
      <el-icon>
        <ArrowRight />
      </el-icon>
    </div>
    <el-dropdown class="flex-shrink-0 w-24px cursor-pointer" trigger="click" size="large" @command="handleCommand">
      <div class="flex-[center,center] w-24px cursor-pointer hover:color-custom-var(--el-color-primary)">
        <el-icon>
          <MoreFilled />
        </el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="emit('reload')"><el-icon>
              <Refresh />
            </el-icon>刷新</el-dropdown-item>
          <el-dropdown-item v-if="currentNav.meta?.affix" command="affix-off"><svg-icon name="affix-off"
              class="mr-5px" />取消固定</el-dropdown-item>
          <el-dropdown-item v-else command="affix"><svg-icon name="affix" class="mr-5px" />固定</el-dropdown-item>
          <el-dropdown-item v-if="globalStore.layout.maximize" command="minimize"><svg-icon name="minimize"
              class="mr-5px" />还原</el-dropdown-item>
          <el-dropdown-item v-else command="maximize"><svg-icon name="maximize" class="mr-5px" />最大化</el-dropdown-item>
          <el-dropdown-item command="open-blank"><svg-icon name="blank" class="mr-5px" />新窗口打开</el-dropdown-item>
          <el-dropdown-item divided :disabled="isFirstNav" command="close-left"><svg-icon name="arrow-to-left"
              class="mr-5px" />关闭左侧页面</el-dropdown-item>
          <el-dropdown-item :disabled="isLastNav" command="close-right"><svg-icon name="arrow-to-right"
              class="mr-5px" />关闭右侧页面</el-dropdown-item>
          <el-dropdown-item divided command="close-other"><svg-icon name="arrow-to-center"
              class="mr-5px" />关闭其他页面</el-dropdown-item>
          <el-dropdown-item command="close-all"><svg-icon name="arrow-two-way"
              class="mr-5px" />关闭所有页面</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <div class="flex-shrink-0 flex-[center,center] w-30px cursor-pointer hover:color-custom-var(--el-color-primary)">
      <svg-icon v-if="globalStore.layout.maximize" name="minimize" @click="handleCommand('minimize')" />
      <svg-icon v-else name="maximize" @click="handleCommand('maximize')" />
    </div>
  </div>
</template>

<script setup>
import { useGlobalStore } from '@/store/app'
import { useNavBarHook } from './use-nav-bar.hook'
import { useElementVisibility } from '@vueuse/core'

const emit = defineEmits(['reload'])

const globalStore = useGlobalStore()
const { navBarSortedList, currentNavIndex, currentNav, currentNavBar, closeable, isFirstNav, isLastNav, clickItem, removeItem, handleCommand } = useNavBarHook()

const navScrollRef = ref(null)
// const showArrow = ref(false)
const showArrow = computed(() => )

watchEffect(() => {
  console.log('== navScrollRef ==', navScrollRef.value)
  const wrapRef = navScrollRef.value?.wrapRef
  console.log('wrapRef: ', wrapRef);
  if (wrapRef) {
    console.log('offsetWidth: ', wrapRef.offsetWidth);
    console.log('scrollWidth: ', wrapRef.scrollWidth);
    showArrow.value = wrapRef.offsetWidth < wrapRef.scrollWidth
  }
})

const onScroll = ({ scrollLeft }) => {
  console.log('scrollLeft: ', scrollLeft);
}

defineOptions({
  name: 'NavBar'
})
</script>

<style lang="scss" scoped>
.nav-item {

  &.is-active,
  &:hover {
    .nav-line {
      background: transparent;
    }
  }
}

.nav-close:hover {
  animation: icon-rotate .3s;
}

@keyframes icon-rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(90deg);
  }
}
</style>
