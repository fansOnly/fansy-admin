<template>
  <svg :class="classNames" :style="{ width, height: _height }">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script setup>
const props = defineProps({
  name: { type: String, require: true },
  width: { type: String, default: '16px' },
  height: { type: String },
  className: { type: String },
})
const _height = computed(() => {
  return props.height ? props.height : props.width
})
const iconName = computed(() => {
  return `#${props.name}`
})
const classNames = computed(() => {
  return props.className ? 'svg-icon ' + props.className : 'svg-icon'
})
</script>