<template>
  <el-menu :mode="menuMode" :unique-opened="menuSetting.accordion"
    :default-active="route.meta.relationId || route.meta.id" :collapse="sidebarSetting.collapse"
    :collapse-transition="false" popper-class="fansy-menu-popper"
    style="--el-menu-item-height: 56px;--el-menu-horizontal-height: 45px;" class="fansy-menu"
    :class="[`is-${menuSetting.style}`]" :hide-timeout="999999">
    <template v-for="first in menuStore.userRoutes" :key="first.id">
      <template v-if="first.visible === 1">
        <el-sub-menu v-if="first.children?.filter(v => v.visible === 1)?.length" :index="first.id"
          class="fansy-sub-menu" :class="[`is-${menuSetting.style}`]">
          <template #title>
            <div class="fansy-menu-title has-children is-first-level"
              :class="[sidebarSetting.collapse ? 'is-collapse' : null]">
              <el-icon v-if="first.icon">
                <component :is="first.icon" />
              </el-icon>
              <span v-show="!sidebarSetting.collapse || sidebarSetting.collapse && sidebarSetting.collapsedTitle"
                class="fansy-menu-title__text"
                :class="[first.icon ? null : 'ml-16px', sidebarSetting.collapse && sidebarSetting.collapsedTitle ? 'is-collapsed-title' : null]">{{
                  first.title }}</span>
            </div>
          </template>
          <template v-for="second in first.children" :key="second.id">
            <template v-if="second.visible === 1">
              <el-sub-menu v-if="second.children?.filter(v => v.visible === 1)?.length" :index="second.id"
                class="fansy-sub-menu" :class="[`is-${menuSetting.style}`]">
                <template #title>
                  <div class="fansy-menu-title has-children is-second-level"
                    :class="[sidebarSetting.collapse ? 'is-collapse' : null, sidebarSetting.collapse && second.id === secondMenuId ? 'is-activex' : null]">
                    <el-icon v-if="second.icon">
                      <component :is="second.icon" />
                    </el-icon>
                    <span v-show="!sidebarSetting.collapse || sidebarSetting.collapse && sidebarSetting.collapsedTitle"
                      :class="{ 'ml-16px': !second.icon }">{{ second.title }}</span>
                  </div>
                </template>
                <template v-for="third in second.children" :key="third.id">
                  <!-- 仅限3级菜单 -->
                  <el-menu-item v-if="third.visible === 1" :index="third.id" class="fansy-menu-item"
                    :class="[`is-${menuSetting.style}`]" @click="onClickMenu(third)">
                    <div class="fansy-menu-title is-third-level"
                      :class="[sidebarSetting.collapse ? 'is-collapse' : null, third.id === thirdMenuId ? 'is-activex' : null]">
                      <el-icon v-if="third.icon">
                        <component :is="third.icon" />
                      </el-icon>
                      <span :class="{ 'ml-16px': !third.icon }">{{ third.title }}</span>
                    </div>
                  </el-menu-item>
                </template>
              </el-sub-menu>
              <el-menu-item v-else :index="second.id" class="fansy-menu-item " :class="[`is-${menuSetting.style}`]"
                @click="onClickMenu(second)">
                <div class="fansy-menu-title is-second-level"
                  :class="[sidebarSetting.collapse ? 'is-collapse' : null, second.id === secondMenuId ? 'is-activex' : null]">
                  <el-icon v-if="second.icon">
                    <component :is="second.icon" />
                  </el-icon>
                  <span :class="{ 'ml-16px': !second.icon }">{{ second.title }}</span>
                </div>
              </el-menu-item>
            </template>
          </template>
        </el-sub-menu>
        <el-menu-item v-else :index="first.id" class="fansy-menu-item" :class="[`is-${menuSetting.style}`]"
          @click="onClickMenu(first)">
          <div class="fansy-menu-title is-first-level"
            :class="[sidebarSetting.collapse ? 'is-collapse' : null, first.id === firstMenuId ? 'is-activex' : null]">
            <el-icon v-if="first.icon">
              <component :is="first.icon" />
            </el-icon>
            <span v-show="!sidebarSetting.collapse || sidebarSetting.collapse && sidebarSetting.collapsedTitle"
              class="fansy-menu-title__text"
              :class="[first.icon ? null : 'ml-16px', sidebarSetting.collapse && sidebarSetting.collapsedTitle ? 'is-collapsed-title' : null]">{{
                first.title }}</span>
          </div>
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

  .el-sub-menu {

    // &.is-active>.el-sub-menu__title,
    // &:hover>.el-sub-menu__title {
    //   background-color: var(--el-menu-hover-bg-color);
    // }
  }
}

.el-menu--horizontal.el-menu {
  border-bottom: none;
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

  .fansy-menu-title__text.is-collapsed-title {
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

  .fansy-menu-title__text {
    margin-left: 8px;
    font-size: 14px;
  }
}

// .el-menu--horizontal .fansy-menu-title__text,
.fansy-menu-title__text {
  width: auto !important;
  height: auto !important;
  visibility: visible !important;
  line-height: 1;

  &.is-collapsed-title {
    font-size: 12px;
  }
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

.fansy-menu-title {
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  width: 100%;
  height: 100%;

  &.is-activex {
    background: var(--el-menu-item-bg-color);
    background: #ccc;
  }

  &.is-collapse {
    // padding-left: var(--el-menu-base-level-padding);

    &.is-first-level {
      flex-direction: column;
      justify-content: center;
      padding-left: 0;
    }
  }
}

.fansy-menu.el-menu--vertical {
  .fansy-menu-title {
    padding-left: calc(var(--el-menu-base-level-padding) + var(--el-menu-level)* var(--el-menu-level-padding));
  }
}

.fansy-menu.is-round .fansy-menu-title {
  border-radius: 4px;
}

.fansy-menu.el-menu--horizontal {
  .fansy-menu-title {
    position: static;
    padding-left: 0;
    background: transparent;
  }

  .fansy-menu-title__text {
    margin-left: 8px;
    font-size: 14px;
  }
}
</style>