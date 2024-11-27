<template>
  <fansy-drawer v-model="show" title="偏好设置" width="380">
    <fansy-tabbar :current="1" :options="menuList" @change="onTabChange" />
    <div v-show="currentMenu === 'appearance'">
      <theme-mode />
      <theme-builtin />
    </div>
    <div v-show="currentMenu === 'layout'">
      <menu-layout />
      <style-layout />
    </div>
  </fansy-drawer>
</template>

<script setup>
import ThemeMode from './theme-mode.vue';
import ThemeBuiltin from './theme-builtin.vue';
import MenuLayout from './menu-layout.vue';
import StyleLayout from './style-layout.vue';

const show = defineModel('show')

const menuList = [
  { label: '外观', value: 'appearance' },
  { label: '布局', value: 'layout' },
  { label: '快捷键', value: 'keyboard' },
  { label: '通用', value: 'common' }
]
const currentMenu = ref('layout')

const onTabChange = (item) => {
  currentMenu.value = item.value
}

</script>

<style lang="scss" scoped></style>
