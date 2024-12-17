<template>
  <div
    class="flex-[center,space-between] background-custom-var(--el-fill-color-blank) b-b-1px b-b-solid borderColor-custom-var(--el-border-color-lighter)">
    <div v-show="scrollable" class="flex-shrink-0 flex-[center,center] w-24px "
      :class="[scrollLeftAble ? 'cursor-pointer hover:color-custom-var(--el-color-primary)' : 'cursor-not-allowed']"
      @click="scrollDistance('left')">
      <el-icon>
        <ArrowLeft />
      </el-icon>
    </div>
    <el-scrollbar ref="navScrollRef" class="flex-1 h-full scrollbar-hide" @scroll="onScroll">
      <div ref="navDragRef" class="flex-[center] px-8px">
        <div v-for="(item, index) in navBarSortedList" :key="index" class="nav-item relative mr-2px"
          :class="{ 'is-active': currentNav.name === item.name }" @click="clickItem(item.name)">
          <div class="pt-3px " :style="{ 'height': globalStore.navBarHeight + 'px' }">
            <svg-icon name="corner-left" width="7px"
              class="absolute bottom-0 left--7px color-custom-var(--el-menu-hover-bg-color) transition-all"
              :class="[currentNav.name === item.name ? 'opacity-100' : 'opacity-0']" />
            <div
              class="nav-item-text flex-[center] relative pl-12px pr-8px rounded-t-8px cursor-pointer whitespace-nowrap select-none"
              :class="[currentNav.name === item.name ? 'is-active background-custom-var(--el-menu-hover-bg-color) color-custom-var(--el-menu-active-color) is-active' : 'hover:background-custom-var(--el-menu-hover-bg-color) hover:color-custom-var(--el-menu-active-color) hover:rounded-8px', item.meta?.affix ? 'is-affix' : null, currentNavIndex === index + 1 ? 'is-prev' : null]">
              <el-icon v-if="navbarSetting.icon && item.meta?.icon" class="mr-4px">
                <component :is="item.meta.icon" />
              </el-icon>
              <span class="line-height-none">{{ item.meta.title }}</span>
              <svg-icon v-if="item.meta?.affix" name="affix" width="14" class="ml-8px" />
              <el-icon v-else class="nav-close ml-8px transition" @click.stop="removeItem(item.name)">
                <Close />
              </el-icon>
            </div>
            <svg-icon name="corner-right" width="7px"
              class="absolute bottom-0 right--7px color-custom-var(--el-menu-hover-bg-color) transition-all"
              :class="[currentNav.name === item.name ? 'opacity-100' : 'opacity-0']" />
          </div>
        </div>
      </div>
    </el-scrollbar>
    <div v-show="scrollable" class="flex-shrink-0 flex-[center,center] w-24px "
      :class="[scrollRightAble ? 'cursor-pointer hover:color-custom-var(--el-color-primary)' : 'cursor-not-allowed']"
      @click="scrollDistance('right')">
      <el-icon>
        <ArrowRight />
      </el-icon>
    </div>
    <div v-if="navbarSetting.more" ref="navMoreRef"
      class="flex-[center,center] w-24px cursor-pointer hover:color-custom-var(--el-color-primary)">
      <el-icon>
        <MoreFilled />
      </el-icon>
    </div>
    <el-popover ref="navPopoverRef" :virtual-ref="navMoreRef" trigger="click" virtual-triggering :show-arrow="false"
      popper-class="fansy-popover">
      <div
        class="flex-[center] h-35px px-8px rounded-4px cursor-pointer hover:background-custom-var(--el-menu-hover-bg-color)"
        @click="onCommand('reload')"><el-icon class="mr-5px">
          <Refresh />
        </el-icon>刷新</div>
      <div class="flex-[center] h-35px px-8px rounded-4px "
        :class="[closeable ? 'cursor-pointer hover:background-custom-var(--el-menu-hover-bg-color)' : 'cursor-not-allowed opacity-50']"
        @click="onCommand('close-self')"><el-icon class="mr-5px">
          <Close />
        </el-icon>关闭</div>
      <div
        class="flex-[center] h-35px px-8px rounded-4px cursor-pointer hover:background-custom-var(--el-menu-hover-bg-color)"
        v-if="currentNav.meta?.affix" @click="onCommand('affix-off')"><svg-icon name="affix-off" class="mr-5px" />取消固定
      </div>
      <div
        class="flex-[center] h-35px px-8px rounded-4px cursor-pointer hover:background-custom-var(--el-menu-hover-bg-color)"
        v-else @click="onCommand('affix')"><svg-icon name="affix" class="mr-5px" />固定</div>
      <div
        class="flex-[center] h-35px px-8px rounded-4px cursor-pointer hover:background-custom-var(--el-menu-hover-bg-color)"
        v-if="globalStore.layout.maximize" @click="onCommand('minimize')"><svg-icon name="minimize" class="mr-5px" />还原
      </div>
      <div
        class="flex-[center] h-35px px-8px rounded-4px cursor-pointer hover:background-custom-var(--el-menu-hover-bg-color)"
        v-else @click="onCommand('maximize')"><svg-icon name="maximize" class="mr-5px" />最大化</div>
      <div
        class="flex-[center] h-35px px-8px rounded-4px cursor-pointer hover:background-custom-var(--el-menu-hover-bg-color)"
        @click="onCommand('open-blank')"><svg-icon name="blank" class="mr-5px" />新窗口打开
      </div>
      <div class="w-full h-1px background-custom-var(--el-border-color-lighter) my-2px"></div>
      <div class="flex-[center] h-35px px-8px rounded-4px "
        :class="[canCloseLeft ? 'cursor-pointer hover:background-custom-var(--el-menu-hover-bg-color)' : 'cursor-not-allowed opacity-50']"
        @click="onCommand('close-left')"><svg-icon name="arrow-to-left" class="mr-5px" />关闭左侧页面</div>
      <div class="flex-[center] h-35px px-8px rounded-4px cursor-pointer"
        :class="[isLastNav ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:background-custom-var(--el-menu-hover-bg-color)']"
        @click="onCommand('close-right')"><svg-icon name="arrow-to-right" class="mr-5px" />关闭右侧页面</div>
      <div class="w-full h-1px background-custom-var(--el-border-color-lighter) my-2px"></div>
      <div class="flex-[center] h-35px px-8px rounded-4px "
        :class="[canCloseOther ? 'cursor-pointer hover:background-custom-var(--el-menu-hover-bg-color)' : 'cursor-not-allowed opacity-50']"
        @click="onCommand('close-other')"><svg-icon name="arrow-to-center" class="mr-5px" />关闭其他页面</div>
      <div class="flex-[center] h-35px px-8px rounded-4px "
        :class="[canCloseAll ? 'cursor-pointer hover:background-custom-var(--el-menu-hover-bg-color)' : 'cursor-not-allowed opacity-50']"
        @click="onCommand('close-all')"><svg-icon name="arrow-two-way" class="mr-5px" />关闭所有页面</div>
    </el-popover>
    <div v-if="navbarSetting.maximize"
      class="flex-shrink-0 flex-[center,center] w-30px cursor-pointer hover:color-custom-var(--el-color-primary)">
      <svg-icon v-if="globalStore.layout.maximize" name="minimize" @click="handleCommand('minimize')" />
      <svg-icon v-else name="maximize" @click="handleCommand('maximize')" />
    </div>
  </div>
</template>

<script setup>
import { useWindowSize } from '@vueuse/core'
import { useSortable, moveArrayElement } from '@vueuse/integrations/useSortable'
import { useGlobalStore } from '@/store/app'
import { useNavBar } from './use-nav-bar'
import { useNavBarScroll } from './use-nav-bar-scroll';
import { watch } from 'vue';

const emit = defineEmits(['reload'])
const { width } = useWindowSize()
const globalStore = useGlobalStore()
const { navBarSortedList, currentNav, currentNavIndex, closeable, canCloseLeft, isLastNav, canCloseAll, canCloseOther, clickItem, removeItem, handleCommand } = useNavBar()
const { navScrollRef, scrollable, scrollLeftAble, scrollRightAble, getScrollDirection, checkScrollable, scrollToActive, onScroll, scrollDistance } = useNavBarScroll()

const navMoreRef = ref(null)
const navPopoverRef = ref(null)
const navDragRef = ref(null)
const navbarSetting = computed(() => globalStore.preference.navbar)

const sortable = useSortable(navDragRef, navBarSortedList, {
  handle: '.nav-item',
  animation: 150,
  filter: (_, el) => el?.classList?.contains('is-affix'),
  onUpdate: async (e) => {
    moveArrayElement(navBarSortedList.value, e.oldIndex, e.newIndex, e)
  },
  onMove: (e) => {
    const target = e.related.classList.contains('is-affix')
    return !target
  },
})

function onCommand(command) {
  navPopoverRef.value?.hide()
  if (command === 'reload') {
    return emit('reload')
  } else if (command === 'close-self') {
    return removeItem(currentNav.value.name)
  }
  handleCommand(command)
}

watch(() => navBarSortedList.value.length, () => checkScrollable())

watch(width, () => {
  checkScrollable()
  getScrollDirection()
})

watch(() => currentNav.value, () => {
  scrollToActive()
}, {
  immediate: true
})

watch(() => navbarSetting.value.draggable, (newVal) => {
  if (newVal) {
    sortable.start()
  } else {
    sortable.stop()
  }
}, { immediate: true })

defineOptions({
  name: 'NavBar'
})
</script>

<style lang="scss" scoped>
.nav-item-text {
  height: calc(100% - 3px);

  &.is-active {
    height: 100%;
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
