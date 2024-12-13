<template>
  <div v-if="sidebarSetting.show"
    class="h-full background-custom-var(--el-fill-color-blank) b-r-1px b-r-solid borderColor-custom-var(--el-border-color-lighter) overflow-hidden">
    <div
      class="box-border flex-[center,center] color-custom-var(--el-text-color-primary) b-b-1px b-b-solid borderColor-custom-var(--el-border-color-lighter)"
      :style="{ height: topHeight + 'px' }">
      <el-icon>
        <Sunrise />
      </el-icon>
      <el-icon>
        <Sunny />
      </el-icon>
      <el-icon>
        <Lightning />
      </el-icon>
      <el-icon>
        <MoonNight />
      </el-icon>
      <div v-if="!sidebarSetting.collapse" class="ml-3">{{ globalStore.name }}</div>
    </div>
    <el-scrollbar noresize class="fansy-menu" :style="{ height: `calc(100% - ${topHeight}px)` }">
      <el-menu :mode="menuMode" :unique-opened="menuSetting.accordion"
        :default-active="route.meta.relationId || route.meta.id" :collapse="sidebarSetting.collapse"
        :collapse-transition="false" :hide-timeout="999999" popper-class="fansy-menu-popper">
        <template v-for="first in menuStore.userRoutes" :key="first.id">
          <template v-if="first.visible === 1">
            <el-sub-menu v-if="first.children?.filter(v => v.visible === 1)?.length" :index="first.id"
              :class="{ 'fansy-submenu-collapse-title': sidebarSetting.collapse && sidebarSetting.collapsedTitle }">
              <template #title>
                <el-icon v-if="first.icon">
                  <component :is="first.icon" />
                </el-icon>
                <span class="fansy-menu-title" :class="{ 'ml-16px': !first.icon }">{{ first.title }}</span>
              </template>
              <template v-for="second in first.children" :key="second.id">
                <template v-if="second.visible === 1">
                  <el-sub-menu v-if="second.children?.filter(v => v.visible === 1)?.length" :index="second.id"
                    :class="{ 'fansy-submenu-collapse-title': sidebarSetting.collapse && sidebarSetting.collapsedTitle }">
                    <template #title>
                      <el-icon v-if="second.icon">
                        <component :is="second.icon" />
                      </el-icon>
                      <span :class="{ 'ml-16px': !second.icon }">{{ second.title }}</span>
                    </template>
                    <template v-for="third in second.children" :key="third.id">
                      <!-- 仅限3级菜单 -->
                      <el-menu-item v-if="third.visible === 1" :index="third.id" class="fansy-menu-item"
                        @click="onClickMenu(third)">
                        <el-icon v-if="third.icon">
                          <component :is="third.icon" />
                        </el-icon>
                        <span :class="{ 'ml-16px': !third.icon }">{{ third.title }}</span>
                      </el-menu-item>
                    </template>
                  </el-sub-menu>
                  <el-menu-item v-else :index="second.id" class="fansy-menu-item" @click="onClickMenu(second)">
                    <el-icon v-if="second.icon">
                      <component :is="second.icon" />
                    </el-icon>
                    <span :class="{ 'ml-16px': !second.icon }">{{ second.title }}</span>
                  </el-menu-item>
                </template>
              </template>
            </el-sub-menu>
            <el-menu-item v-else :index="first.id" class="fansy-menu-item"
              :class="{ 'fansy-submenu-collapse-title': sidebarSetting.collapse && sidebarSetting.collapsedTitle }"
              @click="onClickMenu(first)">
              <el-icon v-if="first.icon">
                <component :is="first.icon" />
              </el-icon>
              <span class="fansy-menu-title" :class="{ 'ml-16px': !first.icon }">{{ first.title }}</span>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
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
const topHeight = globalStore.layout.headerHeight
const menuMode = globalStore.preference.menu.mode === 'horizontal' ? 'horizontal' : 'vertical'

const onClickMenu = (current) => {
  const { type, link, path } = current
  if (type === 'external-link') {
    window.open(link, '_blank')
  } else {
    router.push(path)
  }
}

defineOptions({
  name: 'BaseSidebar'
})
</script>

<style lang="scss" scoped>
.el-menu {
  width: 100%;
  border-right: 0;
}

:deep(.fansy-submenu-collapse-title) {

  .el-sub-menu__title,
  &.el-menu-item {
    flex-direction: column;
    justify-content: center;
  }

  .fansy-menu-title {
    width: auto !important;
    height: auto !important;
    visibility: visible !important;
    margin-top: 8px;
    font-size: 12px;
    line-height: 1;
  }
}

.fansy-menu-popper .el-menu-item {
  height: 40px;
  line-height: 40px;
}
</style>

<style lang="scss">
.fansy-menu-popper .el-sub-menu__title {
  height: 40px !important;
  line-height: 40px !important;
}
</style>
