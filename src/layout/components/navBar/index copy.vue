<template>
  <div
    class="flex-[center,space-between] px-20px background-custom-var(--el-fill-color-blank) border-bottom-[1px,solid,var(--el-border-color-lighter)]"
    :style="{ height: globalStore.layout.navBarHeight + 'px' }">
    <el-tabs :model-value="currentNav.name" type="card" class="fansy-nav-bar-tabs flex-1 overflow-auto"
      @tab-click="(panel) => clickItem(panel.paneName)" @tab-remove="removeItem">
      <el-tab-pane v-for="(item, index) in navBarSortedList" :key="index" :name="item.name" :closable="closeable(item)">
        <template #label>
          <div class="flex-[center]">
            <el-icon v-if="item.meta?.icon" class="mr-4px">
              <component :is="item.meta.icon" />
            </el-icon>
            <span>{{ item.meta.title }}</span>
            <svg-icon v-if="item.meta?.affix" name="affix" width="14" class="ml-2px" />
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
    <el-dropdown class="ml-4px flex-shrink-0 cursor-pointer" trigger="click" size="large" @command="handleCommand">
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
    <div class="flex-[center,center] w-24px cursor-pointer hover:color-custom-var(--el-color-primary)">
      <svg-icon v-if="globalStore.layout.maximize" name="minimize" @click="handleCommand('minimize')" />
      <svg-icon v-else name="maximize" @click="handleCommand('maximize')" />
    </div>
  </div>
</template>

<script setup>
import { useGlobalStore } from '@/store/app'
import { useNavBarHook } from './use-nav-bar.hook'

const emit = defineEmits(['reload'])

const globalStore = useGlobalStore()
const { navBarSortedList, currentNavIndex, currentNav, currentNavBar, closeable, isFirstNav, isLastNav, clickItem, removeItem, handleCommand } = useNavBarHook()

defineOptions({
  name: 'NavBar'
})
</script>

<style lang="scss" scoped>
:deep(.fansy-nav-bar-tabs) {
  .el-tabs__header {
    margin: 0;
    border-bottom: none;
  }

  .el-tabs__nav-wrap {
    margin-bottom: 0;
  }

  .el-tabs__item {
    padding: 0 12px !important;
    border: none;

    &:hover {
      // background: var(--el-color-primary-light-9);
    }

    &.is-active {
      background: var(--el-color-primary-light-9);
      border-bottom: 2px solid var(--el-color-primary);
    }

    .is-icon-close {
      margin-left: 2px;
    }
  }

  .el-tabs__nav {
    border: none;
  }

  .el-tabs__nav-next,
  .el-tabs__nav-prev {
    font-size: 20px;
  }
}
</style>
