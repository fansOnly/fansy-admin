<template>
  <div
    class="h-full background-custom-var(--el-fill-color-blank) border-right-[1px,solid,var(--el-border-color-lighter)] overflow-hidden">
    <div
      class="box-border flex-[center,center] color-custom-var(--el-text-color-primary) border-bottom-[1px,solid,var(--el-border-color-lighter)]"
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
      <div v-if="!globalStore.menu.collapse" class="ml-3">{{ globalStore.name }}</div>
    </div>
    <el-scrollbar noresize class="fs-layout-menu" :style="{ height: `calc(100% - ${topHeight}px)` }">
      <el-menu unique-opened :default-active="route.meta.relationId || route.meta.id"
        :collapse="globalStore.menu.collapse" :collapse-transition="false">
        <template v-for="first in menuStore.userRoutes" :key="first.id">
          <template v-if="first.visible === 1">
            <el-sub-menu v-if="first.children?.filter(v => v.visible === 1)?.length" :index="first.id">
              <template #title>
                <el-icon v-if="first.icon">
                  <component :is="first.icon" />
                </el-icon>
                <span :class="{ 'ml-16px': !first.icon }">{{ first.title }}</span>
              </template>
              <template v-for="second in first.children" :key="second.id">
                <template v-if="second.visible === 1">
                  <el-sub-menu v-if="second.children?.filter(v => v.visible === 1)?.length" :index="second.id">
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
            <el-menu-item v-else :index="first.id" class="fansy-menu-item" @click="onClickMenu(first)">
              <el-icon v-if="first.icon">
                <component :is="first.icon" />
              </el-icon>
              <span :class="{ 'ml-16px': !first.icon }">{{ first.title }}</span>
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

const topHeight = globalStore.layout.headerHeight

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
  border-right: 0;
}
</style>
