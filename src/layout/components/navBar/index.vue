<template>
  <div
    class="flex-[center,space-between] background-custom-var(--el-fill-color-blank) border-bottom-[1px,solid,var(--el-border-color-lighter)]"
    :style="{ 'line-height': globalStore.layout.navBarHeight + 'px' }">
    <div v-show="scrollable" class="flex-shrink-0 flex-[center,center] w-24px "
      :class="[scrollLeftAble ? 'cursor-pointer hover:color-custom-var(--el-color-primary)' : 'cursor-not-allowed']"
      @click="scrollDistance('left')">
      <el-icon>
        <ArrowLeft />
      </el-icon>
    </div>
    <el-scrollbar ref="navScrollRef" class="flex-1 scrollbar-hide" @scroll="onScroll">
      <div class="flex-[center]">
        <div v-for="(item, index) in navBarSortedList" :key="index"
          class="nav-item flex-[center] relative mr-1px pl-12px pr-8px b-b-2px b-b-solid cursor-pointer whitespace-nowrap select-none "
          :class="[currentNavBar.name === item.name ? 'background-custom-var(--el-color-primary-light-9) border-color-custom-var(--el-color-primary) color-custom-var(--el-color-primary) is-active' : 'border-color-transparent hover:background-custom-var(--el-color-info-light-9)']"
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
    <div v-show="scrollable" class="flex-shrink-0 flex-[center,center] w-24px "
      :class="[scrollRightAble ? 'cursor-pointer hover:color-custom-var(--el-color-primary)' : 'cursor-not-allowed']"
      @click="scrollDistance('right')">
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
          <el-dropdown-item v-if="currentNavBar.meta?.affix" command="affix-off"><svg-icon name="affix-off"
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
import { useDebounceFn } from '@vueuse/core'
import { useGlobalStore } from '@/store/app'
import { useNavBarHook } from './use-nav-bar'

const emit = defineEmits(['reload'])

const globalStore = useGlobalStore()
const { navBarSortedList, currentNavBar, isFirstNav, isLastNav, clickItem, removeItem, handleCommand } = useNavBarHook()

const navScrollRef = ref(null)
const scrollable = ref(false)
const scrollLeft = ref(0)
const scrollLeftAble = ref(false)
const scrollRightAble = ref(false)

watch(() => navBarSortedList.value.length, () => {
  checkScrollable()
})

watch(() => currentNavBar.value, () => {
  scrollToActive()
})

// const autoDistance = computed(() => {
//   const { scrollContentWidth } = getScrollElWidth()
//   return 2 * scrollContentWidth / navBarSortedList.value.length
// })

async function scrollDistance(direction = '', distance = 200) {
  if (direction === 'left' && !scrollLeftAble.value) return
  if (direction === 'right' && !scrollRightAble.value) return
  await nextTick();
  const wrapRef = navScrollRef.value?.wrapRef
  if (wrapRef && scrollable.value) {
    navScrollRef.value.scrollTo({
      behavior: "smooth",
      left: wrapRef.scrollLeft + (direction === 'left' ? -distance : distance)
    })
  }
}

async function scrollToActive() {
  await nextTick();
  const wrapRef = navScrollRef.value?.wrapRef
  if (wrapRef && scrollable.value) {
    requestAnimationFrame(() => {
      const activeRef = wrapRef.querySelector('.is-active')
      if (activeRef) {
        activeRef.scrollIntoView({ behavior: 'smooth', inline: 'start' })
      }
    })
  }
}

async function checkScrollable() {
  await nextTick();
  const wrapRef = navScrollRef.value?.wrapRef
  if (wrapRef) {
    const { scrollContentWidth, scrollWrapWidth } = getScrollElWidth()
    scrollable.value = scrollWrapWidth < scrollContentWidth
  }
}

function getScrollElWidth() {
  const wrapRef = navScrollRef.value?.wrapRef
  if (!wrapRef) return {}
  return {
    scrollContentWidth: wrapRef.scrollWidth,
    scrollWrapWidth: wrapRef.offsetWidth
  }
}

function getScrollDirection() {
  const { scrollContentWidth, scrollWrapWidth } = getScrollElWidth()
  scrollLeftAble.value = scrollLeft.value > 0
  scrollRightAble.value = scrollLeft.value < (scrollContentWidth - scrollWrapWidth)
}

const onScroll = useDebounceFn(({ scrollLeft: value }) => {
  scrollLeft.value = value
  getScrollDirection()
})

onMounted(() => {
  checkScrollable()
  scrollToActive()
  getScrollDirection()
})

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
