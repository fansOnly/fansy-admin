<template>
  <fansy-drawer v-model="show" width="380">
    <template #header>
      <div>偏好设置</div>
      <el-tooltip effect="light" content="恢复默认" popper-class="fansy-tooltip-popper">
        <el-icon size="18px" class="mr-8px cursor-pointer hover:color-custom-var(--el-color-primary)"
          @click="onReset()">
          <el-badge :is-dot="isChanged">
            <RefreshRight />
          </el-badge>
        </el-icon>
      </el-tooltip>
    </template>

    <fansy-tabbar ref="tabbarRef" :options="menuList" @change="onTabChange" />
    <div v-show="current === 0">
      <theme-mode />
      <theme-builtin />
    </div>
    <div v-show="current === 1">
      <menu-layout />
      <style-layout />
    </div>
    <div v-show="current === 2">
      <shortcut-keys />
    </div>
    <div v-show="current === 3">
      <common-and-animation />
    </div>
  </fansy-drawer>
</template>

<script setup>
import ThemeMode from './theme-mode.vue';
import ThemeBuiltin from './theme-builtin.vue';
import MenuLayout from './menu-layout.vue';
import StyleLayout from './style-layout.vue';
import ShortcutKeys from './shortcut-keys.vue';
import CommonAndAnimation from './common-and-animation.vue';
import { useGlobalStore } from '@/store/app'
import { PREFERENCE_PRESET } from '@/constants/preset'

const show = defineModel('show')
const globalStore = useGlobalStore()

const menuList = [
  { label: '外观', value: 'appearance' },
  { label: '布局', value: 'layout' },
  { label: '快捷键', value: 'keyboard' },
  { label: '通用', value: 'common' }
]
const tabbarRef = ref(null)
const current = ref(0)
const isChanged = ref(false)

const onTabChange = (item, index) => {
  current.value = index
}

const onReset = () => {
  if (!isChanged.value) return
  globalStore.resetPreference()
}

watch(show, (val) => {
  if (!val) {
    current.value = 0
    tabbarRef.value?.setCurrent(0)
  }
})

watch(() => globalStore.preference, (newVal) => {
  isChanged.value = !isSameObject(newVal, PREFERENCE_PRESET)
}, { deep: true })

function isSameObject(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}
</script>

<style lang="scss" scoped></style>
