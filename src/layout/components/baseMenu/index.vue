<template>
  <el-menu :mode="menuMode" :unique-opened="menuSetting.accordion"
    :default-active="route.meta.relationId || route.meta.id" :collapse="sidebarSetting.collapse"
    :collapse-transition="false" popper-class="fansy-menu-popper"
    style="--el-menu-item-height: 56px;--el-menu-horizontal-height: 45px;" class="fansy-menu"
    :class="[`is-${menuSetting.style}`]">
    <template v-for="first in menuStore.userRoutes" :key="first.id">
      <template v-if="first.visible === 1">
        <el-sub-menu v-if="first.children?.filter(v => v.visible === 1)?.length" :index="first.id"
          class="fansy-sub-menu first-level"
          :class="[`is-${menuSetting.style}`, first.id === firstMenuId && secondMenuId && menuMode === 'horizontal' ? 'follow-active' : null]">
          <template #title>
            <el-icon v-if="first.icon">
              <component :is="first.icon" />
            </el-icon>
            <span class="fansy-menu-title"
              :class="[first.icon ? null : 'ml-16px', sidebarSetting.collapse && sidebarSetting.collapsedTitle ? 'is-collapsed' : null]">{{
                first.title }}</span>
          </template>
          <template v-for="second in first.children" :key="second.id">
            <template v-if="second.visible === 1">
              <el-sub-menu v-if="second.children?.filter(v => v.visible === 1)?.length" :index="second.id"
                class="fansy-sub-menu second-level"
                :class="[`is-${menuSetting.style}`, second.id === secondMenuId && (sidebarSetting.collapse || menuMode === 'horizontal') ? 'follow-active' : null]">
                <template #title>
                  <el-icon v-if="second.icon">
                    <component :is="second.icon" />
                  </el-icon>
                  <span :class="{ 'ml-16px': !second.icon }">{{ second.title }}</span>
                </template>
                <template v-for="third in second.children" :key="third.id">
                  <!-- 仅限3级菜单 -->
                  <el-menu-item v-if="third.visible === 1" :index="third.id" class="fansy-menu-item third-level"
                    :class="[`is-${menuSetting.style}`]" @click="onClickMenu(third)">
                    <el-icon v-if="third.icon">
                      <component :is="third.icon" />
                    </el-icon>
                    <span :class="{ 'ml-16px': !third.icon }">{{ third.title }}</span>
                  </el-menu-item>
                </template>
              </el-sub-menu>
              <el-menu-item v-else :index="second.id" class="fansy-menu-item second-level"
                :class="[`is-${menuSetting.style}`]" @click="onClickMenu(second)">
                <el-icon v-if="second.icon">
                  <component :is="second.icon" />
                </el-icon>
                <span :class="{ 'ml-16px': !second.icon }">{{ second.title }}</span>
              </el-menu-item>
            </template>
          </template>
        </el-sub-menu>
        <el-menu-item v-else :index="first.id" class="fansy-menu-item first-level" :class="[`is-${menuSetting.style}`]"
          @click="onClickMenu(first)">
          <el-icon v-if="first.icon">
            <component :is="first.icon" />
          </el-icon>
          <span class="fansy-menu-title"
            :class="[first.icon ? null : 'ml-16px', sidebarSetting.collapse && sidebarSetting.collapsedTitle ? 'is-collapsed' : null]">{{
              first.title }}</span>
        </el-menu-item>
      </template>
    </template>
  </el-menu>
</template>

<script setup>
import { useMenuStore } from '@/store/menu'
import { useGlobalStore } from '@/store/app'

const route = useRoute()
const router = useRouter()
const menuStore = useMenuStore()
const globalStore = useGlobalStore()

const sidebarSetting = computed(() => globalStore.preference.sidebar)
const menuSetting = computed(() => globalStore.preference.menu)
const menuMode = globalStore.preference.menu.mode === 'horizontal' ? 'horizontal' : 'vertical'

const firstMenuId = ref('')
const secondMenuId = ref('')
const thirdMenuId = ref('')

watch(() => route.fullPath, () => {
  firstMenuId.value = route.matched[1]?.meta?.id
  secondMenuId.value = route.matched[2]?.meta?.id
  thirdMenuId.value = route.matched[3]?.meta?.id
}, {
  immediate: true
})

const onClickMenu = (current) => {
  const { type, link, path } = current
  if (type === 'external-link') {
    window.open(link, '_blank')
  } else {
    router.push(path)
  }
}

defineOptions({
  name: 'BaseMenu'
})
</script>

<style lang="scss">
.el-menu {
  width: 100%;
  border-right: none;

  .el-sub-menu.follow-active {

    .el-sub-menu__title {
      background-color: var(--el-menu-hover-bg-color);
      color: var(--el-menu-active-color);
    }
  }
}

.el-menu--horizontal.el-menu {
  border-bottom: none;
}

// 文本超出适配
.el-menu--vertical {
  &.el-menu--collapse {

    .el-menu-item.first-level,
    .el-sub-menu.first-level .el-sub-menu__title {
      height: auto;
      min-height: var(--el-menu-item-height);
      padding: 0;
      text-align: center;
    }
  }

  .fansy-menu-title {
    white-space: normal;
    line-height: 1.3;
  }
}

.fansy-menu-item.is-round,
.fansy-sub-menu.is-round .el-sub-menu__title {
  margin: 4px;
  border-radius: 4px;
}

.el-menu--vertical.el-menu--collapse {

  .fansy-menu-item,
  .fansy-sub-menu .el-sub-menu__title {
    justify-content: center;
    flex-direction: column;
  }

  .fansy-menu-title.is-collapsed {
    margin-top: 8px;
  }
}

.el-menu--collapse .el-sub-menu {

  &.is-active .el-sub-menu__title,
  &:hover .el-sub-menu__title {
    background-color: var(--el-menu-hover-bg-color);
  }
}

.el-menu--horizontal {
  align-items: center;

  .el-sub-menu .el-sub-menu__title {
    margin: 0 4px;
  }

  &.is-round {

    .el-sub-menu__hide-arrow.is-active .el-sub-menu__title,
    .el-sub-menu__hide-arrow:hover .el-sub-menu__title {
      border-radius: 4px;
    }
  }

  .el-menu-item {
    border-bottom: none !important;

    &:not(.is-disabled):hover,
    &:not(.is-disabled):focus,
    &:not(.is-disabled).is-active {
      outline: none;
      color: var(--el-menu-active-color);
      background-color: var(--el-menu-hover-bg-color);
    }
  }

  .el-sub-menu {
    height: 100%;

    .el-sub-menu__title {
      border-bottom: none !important;

      &:hover {
        background-color: var(--el-menu-hover-bg-color);
      }
    }

    &.is-round {

      &.is-active .el-sub-menu__title,
      &:hover .el-sub-menu__title {
        border-radius: 4px;
      }
    }
  }
}

.el-menu--horizontal.el-menu--collapse {

  .fansy-menu-item,
  .fansy-sub-menu .el-sub-menu__title {
    justify-content: center;
  }

  .fansy-menu-title {
    margin-left: 8px;
    font-size: 14px;
  }
}

.el-menu--horizontal .fansy-menu-title,
.fansy-menu-title.is-collapsed {
  width: auto !important;
  height: auto !important;
  visibility: visible !important;
  font-size: 12px;
  line-height: 1;
}

.fansy-menu-popper {
  --el-menu-item-bg-color: #333;

  .fansy-menu-item,
  .fansy-sub-menu .el-sub-menu__title {
    justify-content: flex-start;
  }

  .fansy-sub-menu .el-sub-menu__title {
    flex-direction: row;
  }
}
</style>