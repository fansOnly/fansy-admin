<template>
  <el-header :height="globalStore.layout.headerHeight + 'px'"
    class="flex-[center,space-between] background-custom-var(--el-fill-color-blank) b-b-1px b-b-solid borderColor-custom-var(--el-border-color-lighter) transition-height"
    :class="{ 'overflow-hidden': globalStore.layout.maximize }">
    <div class="flex-1 flex-[center]">
      <template v-if="menu.mode === 'vertical'">
        <el-icon class="cursor-pointer" :size="20" @click="globalStore.toggleMenuCollapse">
          <Expand v-if="sidebar.collapse" />
          <Fold v-else />
        </el-icon>
        <breadcrumb class="ml-4" />
      </template>
      <template v-else>
        <base-logo :height="globalStore.layout.headerHeight" :title="globalStore.name" class="mr-20px" />
        <base-menu />
      </template>
    </div>
    <div class="flex-[center] h-full">
      <div v-if="widget.search"
        class="flex-[center,space-between] py-6px px-8px background-custom-var(--el-fill-color-light) rounded-full color-custom-var(--el-text-color-secondary) cursor-pointer hover:color-custom-var(--el-text-color-primary)"
        @click="showSearchModal()">
        <el-icon>
          <Search />
        </el-icon>
        <span class="pl-8px font-size-14px whitespace-nowrap">搜索</span>
        <div v-show="shortcutKeys.enable && shortcutKeys.search"
          class="flex-[center] px-4px py-2px ml-8px background-custom-var(--el-bg-color) rounded-r-full font-size-12px whitespace-nowrap">
          {{ shortKeyCtrl }} K</div>
      </div>
      <div class="header-right-item" v-if="widget.settings">
        <el-icon :size="18" @click="showSetting()">
          <Setting />
        </el-icon>
      </div>
      <div class="header-right-item" v-if="widget.theme">
        <el-icon class="sun-icon" :size="18" @click="toggleTheme">
          <Sunny v-if="isDark" />
          <Moon v-else />
        </el-icon>
      </div>
      <div ref="languageRef" class="header-right-item" v-if="widget.language">
        <el-icon :size="18">
          <svg-icon name="language" />
        </el-icon>
      </div>
      <el-popover ref="languagePopoverRef" :virtual-ref="languageRef" trigger="click" virtual-triggering
        :show-arrow="false" width="120px" popper-class="fansy-popover">
        <div v-for="item in LANGUAGE_PRESET" :key="item.value" class="pl-12px py-4px mb-4px rounded-4px cursor-pointer"
          :class="[app.language === item.value ? 'background-custom-var(--el-fill-color-darker)' : null]"
          @click="setLanguage(item.value)">
          {{ item.label }}</div>
      </el-popover>
      <div class="header-right-item" v-if="widget.fullscreen">
        <el-icon class="full-icon" :size="18" @click="toggleFullScreen">
          <svg-icon name="fullscreen-off" v-if="isFullscreen" />
          <FullScreen v-else />
        </el-icon>
      </div>
      <div class="header-right-item" v-if="widget.notice">
        <el-badge is-dot style="display: inline-flex;">
          <el-icon class="bell-icon" :size="18">
            <Bell />
          </el-icon>
        </el-badge>
      </div>
      <div class="header-right-item is-avatar">
        <el-dropdown ref="menuDropdownRef" trigger="click" :show-arrow="false" popper-class="w-200px">
          <div class="flex-[center]">
            <el-badge type="success" :offset="[-4, 26]" is-dot style="display: inline-flex;">
              <el-avatar :size="32" :src="userStore.userInfo.avatar">
                <el-image :src="userStore.defaultAvatar" fit="contain" alt="user" />
              </el-avatar>
            </el-badge>
          </div>
          <template #dropdown>
            <div class="flex-[center] py-12px px-16px">
              <el-avatar :size="48" :src="userStore.userInfo.avatar" class="flex-shrink-0">
                <el-image :src="userStore.defaultAvatar" fit="contain" alt="user" />
              </el-avatar>
              <div class="flex-[,center,column]">
                <div class="pl-2">{{ userStore.userInfo.nickname }}
                </div>
                <div class="pl-2 break-all line-height-14px">{{ userStore.userInfo.email }}</div>
              </div>
            </div>
            <div class="w-full h-1px background-custom-var(--el-border-color-lighter)"></div>
            <div class="header-menu-item" @click="onRoute('/user/info')">
              <div class="flex-1">
                <el-icon size="16px">
                  <User />
                </el-icon>
                <span class="ml-4px font-size-14px">个人信息</span>
              </div>
            </div>
            <div class="header-menu-item" @click="onRoute('/user/info')">
              <div class="flex-1">
                <el-icon size="16px">
                  <Key />
                </el-icon>
                <span class="ml-4px font-size-14px">修改密码</span>
              </div>
            </div>
            <div class="w-full h-1px background-custom-var(--el-border-color-lighter)"></div>
            <div class="header-menu-item" @click="handleLogout()">
              <div class="flex-1 flex-[center]">
                <el-icon size="16px">
                  <SwitchButton />
                </el-icon>
                <span class="ml-4px font-size-14px">退出登录</span>
              </div>
              <span>{{ shortKeyAlt }} Q</span>
            </div>
          </template>
        </el-dropdown>
      </div>
    </div>
  </el-header>
  <dialog-menu-search v-model:show="visibleSearch" />
  <drawer-setting v-model:show="visibleSetting" />
  <dialog-lock-screen v-model:show="visibleLock" />
</template>

<script setup>
import DialogMenuSearch from '@/components/modals/dialog-menu-search/index.vue'
import DrawerSetting from '@/components/modals/drawer-setting/index.vue'
import DialogLockScreen from '@/components/modals/dialog-lock-screen/index.vue'
import { useGlobalStore } from '@/store/app'
import { useUserStore } from '@/store/user'
import { logout } from '@/api/core/login'
import { useFullscreen } from '@/hooks/use-full-screen'
import { useMessage } from '@/hooks/use-message'
import { useTheme } from '@/hooks/use-theme';
import Storage from '@/common/storage'
import { useMagicKeys, whenever } from '@vueuse/core'
import { isMacOS } from '@/utils/index'
import { LANGUAGE_PRESET } from '@/constants/settings'

const router = useRouter()
const globalStore = useGlobalStore()
const userStore = useUserStore()
const { isFullscreen, toggleFullScreen } = useFullscreen()
const { showConfirmWarningBox } = useMessage()
const { isDark, toggleDark } = useTheme()
const widget = computed(() => globalStore.preference.widget)
const app = computed(() => globalStore.preference.app)
const shortcutKeys = computed(() => globalStore.preference.shortcutKeys)
const sidebar = computed(() => globalStore.preference.sidebar)
const menu = computed(() => globalStore.preference.menu)

const languageRef = ref(null)
const languagePopoverRef = ref(null)
const menuDropdownRef = ref(null)
const visibleSetting = ref(false)
const visibleSearch = ref(false)
const visibleLock = ref(false)
const shortKeyAlt = computed(() => isMacOS ? '⌥' : 'Alt')
const shortKeyCtrl = computed(() => isMacOS ? '⌘' : 'Ctrl')

const showSearchModal = () => {
  visibleSearch.value = true
}

const showLockModal = () => {
  visibleLock.value = true
}

const showSetting = () => {
  visibleSetting.value = true
}

const setLanguage = (value) => {
  app.value.language = value
  setTimeout(() => {
    languagePopoverRef?.value.hide()
  }, 300);
}

const onRoute = (path) => {
  menuDropdownRef?.value.handleClose()
  router.push(path)
}

const toggleTheme = (event) => {
  const isAppearanceTransition =
    document.startViewTransition &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!isAppearanceTransition || !event) {
    toggleDark()
    return;
  }

  // 动画效果，借鉴 vben
  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  );
  const transition = document.startViewTransition(async () => {
    toggleDark()
    await nextTick();
  });
  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];
    document.documentElement.animate(
      {
        clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 450,
        easing: 'ease-in',
        pseudoElement: isDark.value
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)',
      },
    );
  });
}

const handleLogout = async () => {
  menuDropdownRef.value?.handleClose()
  showConfirmWarningBox('即将登出系统？', '', {
    callback: async (value, action) => {
      if (value === 'confirm') {
        await logout()
        userStore.logout()
        router.push('/login')
      }
    }
  })
}

// const highlight = (str) => {
//   if (!searchValue.value) return str
//   return str.replace(
//     searchValue.value,
//     `<span style="color: var(--el-color-primary);font-weight:bold;">${searchValue.value}</span>`
//   )
// }

const registerShortKeys = () => {
  const keys = useMagicKeys()

  // 退出登录
  whenever(keys.Alt_KeyQ, () => {
    if (!shortcutKeys.value.enable || !shortcutKeys.value.logout) return
    handleLogout()
  })
  // 锁屏
  whenever(keys.Alt_KeyL, () => {
    if (!shortcutKeys.value.enable || !shortcutKeys.value.lock) return
    showLockModal()
  })
  const ctrlKey = isMacOS ? 'Cmd' : 'Ctrl'
  // 全局搜索
  whenever(keys[ctrlKey + '_KeyK'], () => {
    if (!widget.value.search || !shortcutKeys.value.enable || !shortcutKeys.value.search) return
    showSearchModal()
  })
}

registerShortKeys()

defineOptions({
  name: 'BaseHeader'
})
</script>

<style lang="scss" scoped>
.header-right-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  margin-left: 8px;
  border-radius: 100%;
  cursor: pointer;
  transition: all 0.3s;

  &.is-avatar {
    width: 44px;
    height: 44px;
  }

  &:hover {
    // background: var(--el-color-primary-light-3);
    background: var(--el-fill-color-light);
    // color: var(--el-color-primary-light-9);

    .full-icon {
      animation: twinkle 0.3s ease-in-out;
    }

    .bell-icon {
      animation: shake 0.3s ease-in-out;
    }

    .sun-icon {
      // animation: twinkle 0.3s ease-in-out;
    }
  }
}

.header-menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  color: #606266;
  cursor: pointer;

  &:hover {
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
  }
}

@keyframes twinkle {
  0% {
    transform: scale(0.3);
  }

  80% {
    transform: scale(1.2);
  }

  to {
    transform: scale(1);
  }
}

@keyframes shake {
  20% {
    -webkit-transform: rotate3d(0, 0, 1, 15deg);
    transform: rotate3d(0, 0, 1, 15deg);
  }

  40% {
    -webkit-transform: rotate3d(0, 0, 1, -10deg);
    transform: rotate3d(0, 0, 1, -10deg);
  }

  60% {
    -webkit-transform: rotate3d(0, 0, 1, 5deg);
    transform: rotate3d(0, 0, 1, 5deg);
  }

  80% {
    -webkit-transform: rotate3d(0, 0, 1, -5deg);
    transform: rotate3d(0, 0, 1, -5deg);
  }

  to {
    -webkit-transform: rotate3d(0, 0, 1, 0deg);
    transform: rotate3d(0, 0, 1, 0deg);
  }
}
</style>