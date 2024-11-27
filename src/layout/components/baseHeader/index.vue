<template>
  <el-header :height="globalStore.layout.headerHeight + 'px'"
    class="flex-[center,space-between] background-custom-var(--el-fill-color-blank) border-bottom-[1px,solid,var(--el-border-color-lighter)] transition"
    :class="{ 'overflow-hidden': globalStore.layout.maximize }">
    <div class="flex-[center]">
      <el-icon class="cursor-pointer" :size="20" @click="globalStore.toggleMenuCollapse">
        <Expand v-if="globalStore.menu.collapse" />
        <Fold v-else />
      </el-icon>
      <breadcrumb class="ml-4" />
    </div>
    <div class="flex-[center] h-full">
      <div
        class="flex-[center,space-between] py-6px px-8px background-custom-var(--el-fill-color-light) rounded-full color-custom-var(--el-text-color-secondary) cursor-pointer hover:color-custom-var(--el-text-color-primary)"
        @click="showSearchModal()">
        <el-icon>
          <Search />
        </el-icon>
        <span class="px-12px font-size-14px">搜索</span>
        <div
          class="flex-[center] px-4px py-2px background-custom-var(--el-fill-color-darker) rounded-r-full font-size-12px">
          {{ shortKeyCtrl }} K</div>
      </div>
      <div class="header-right-item">
        <el-icon :size="18" @click="showSetting()">
          <Setting />
        </el-icon>
      </div>
      <div class="header-right-item">
        <el-icon class="full-icon" :size="18" @click="toggleFullScreen">
          <svg-icon name="fullscreen-off" v-if="isFullscreen" />
          <FullScreen v-else />
        </el-icon>
      </div>
      <div class="header-right-item">
        <el-icon class="sun-icon" :size="18" @click="toggleTheme">
          <Sunny v-if="isDark" />
          <Moon v-else />
        </el-icon>
      </div>
      <div class="header-right-item">
        <el-badge is-dot style="display: inline-flex;">
          <el-icon class="bell-icon" :size="18">
            <Bell />
          </el-icon>
        </el-badge>
      </div>
      <div class="header-right-item is-avatar">
        <el-dropdown ref="menuDropdownRef" trigger="click">
          <div class="flex-[center]">
            <el-badge type="success" :offset="[-4, 26]" is-dot style="display: inline-flex;">
              <el-avatar :size="32" :src="userStore.userInfo.avatar">
                <el-image :src="avatarDefaultImage" fit="contain" alt="user" />
              </el-avatar>
            </el-badge>
          </div>
          <template #dropdown>
            <div class="flex-[center] py-12px px-16px">
              <el-avatar :size="48" :src="userStore.userInfo.avatar" class="flex-shrink-0">
                <el-image :src="avatarDefaultImage" fit="contain" alt="user" />
              </el-avatar>
              <div class="flex-[,center,column]">
                <div class="pl-2">{{ userStore.userInfo.nickname }}
                </div>
                <div class="pl-2">{{ userStore.userInfo.email }}</div>
              </div>
            </div>
            <div class="border-top-[1px,solid,var(--el-border-color-lighter)]"></div>
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
            <div class="border-top-[1px,solid,var(--el-border-color-lighter)]"></div>
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
</template>

<script setup>
import DialogMenuSearch from '@/components/modals/dialog-menu-search/index.vue'
import DrawerSetting from '@/components/modals/drawer-setting/index.vue'
import { useGlobalStore } from '@/store/app'
import { useUserStore } from '@/store/user'
import { logout } from '@/api/core/login'
import { useFullscreen } from '@/hooks/use-full-screen'
import { useMessage } from '@/hooks/use-message'
import { useTheme } from '@/hooks/use-theme';
import Storage from '@/common/storage'
import { useMagicKeys, whenever } from '@vueuse/core'
import { isMacOS } from '@/utils/index'
import avatarDefaultImage from '@/assets/images/avatar.gif'

const router = useRouter()
const globalStore = useGlobalStore()
const userStore = useUserStore()
const { isFullscreen, toggleFullScreen } = useFullscreen()
const { useMessageBox } = useMessage()
const { isDark, toggleDark } = useTheme()

const menuDropdownRef = ref(null)
const visibleSetting = ref(false)
const searchValue = ref('')
const visibleSearch = ref(false)
const shortKeyAlt = computed(() => isMacOS ? '⌥' : 'Alt')
const shortKeyCtrl = computed(() => isMacOS ? '⌘' : 'Ctrl')

const showSearchModal = () => {
  visibleSearch.value = true
}

const showSetting = () => {
  visibleSetting.value = true
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
  useMessageBox('confirm', '即将登出系统？', {
    iconType: 'warning',
    callback: async (value, action) => {
      if (value === 'confirm') {
        await logout()
        Storage.removeItem('token')
        userStore.setUserInfo({})
        router.push('/login')
      }
    }
  })
}

const highlight = (str) => {
  if (!searchValue.value) return str
  return str.replace(
    searchValue.value,
    `<span style="color: var(--el-color-primary);font-weight:bold;">${searchValue.value}</span>`
  )
}

const registerShortKeys = () => {
  const keys = useMagicKeys()

  whenever(keys.Alt_KeyQ, () => {
    handleLogout()
  })
  const ctrlKey = isMacOS ? 'Cmd' : 'Ctrl'
  whenever(keys[ctrlKey + '_KeyK'], () => {
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