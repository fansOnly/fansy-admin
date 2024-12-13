<template>
  <div
    class="flex-[center,space-between] background-custom-var(--el-fill-color-blank) b-b-1px b-b-solid borderColor-custom-var(--el-border-color-lighter)"
    :style="{ 'line-height': globalStore.navBarHeight + 'px' }">
    <div v-show="scrollable" class="flex-shrink-0 flex-[center,center] w-24px "
      :class="[scrollLeftAble ? 'cursor-pointer hover:color-custom-var(--el-color-primary)' : 'cursor-not-allowed']"
      @click="scrollDistance('left')">
      <el-icon>
        <ArrowLeft />
      </el-icon>
    </div>
    <el-scrollbar ref="navScrollRef" class="flex-1 scrollbar-hide" @scroll="onScroll">
      <div ref="navDragRef" class="flex-[center]">
        <div v-for="(item, index) in navBarSortedList" :key="index"
          class="nav-item flex-[center] relative mr-1px pl-12px pr-8px b-b-2px b-b-solid cursor-pointer whitespace-nowrap select-none "
          :class="[currentNavBar.name === item.name ? 'background-custom-var(--el-color-primary-light-9) border-color-custom-var(--el-color-primary) color-custom-var(--el-color-primary) is-active' : 'border-color-transparent hover:background-custom-var(--el-color-info-light-9)', item.meta?.affix ? 'is-affix' : null, currentNavIndex === index + 1 ? 'is-prev' : null]"
          @click="clickItem(item.name)">
          <el-icon v-if="navbarSetting.icon && item.meta?.icon" class="mr-4px">
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
    <el-dropdown v-if="navbarSetting.more" class="flex-shrink-0 w-24px cursor-pointer" trigger="click" size="large"
      @command="handleCommand">
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
          <el-dropdown-item @click="removeItem(currentNavBar.name)"><el-icon>
              <Close />
            </el-icon>关闭</el-dropdown-item>
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
    <div v-if="navbarSetting.maximize"
      class="flex-shrink-0 flex-[center,center] w-30px cursor-pointer hover:color-custom-var(--el-color-primary)">
      <svg-icon v-if="globalStore.layout.maximize" name="minimize" @click="handleCommand('minimize')" />
      <svg-icon v-else name="maximize" @click="handleCommand('maximize')" />
    </div>
  </div>
</template>

<script setup>
import { useSortable, moveArrayElement } from '@vueuse/integrations/useSortable'
import { useGlobalStore } from '@/store/app'
import { useNavBar } from './use-nav-bar'
import { useNavBarScroll } from './use-nav-bar-scroll';
import { watch } from 'vue';

const emit = defineEmits(['reload'])
const globalStore = useGlobalStore()
const { navBarSortedList, currentNavBar, currentNavIndex, isFirstNav, isLastNav, clickItem, removeItem, handleCommand } = useNavBar()
const { navScrollRef, scrollable, scrollLeftAble, scrollRightAble, checkScrollable, scrollToActive, onScroll, scrollDistance } = useNavBarScroll()

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

watch(() => navBarSortedList.value.length, () => {
  checkScrollable()
})

watch(() => currentNavBar.value, () => {
  scrollToActive()
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
.nav-item {

  &.is-prev,
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
