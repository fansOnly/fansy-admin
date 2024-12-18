<template>
  <div ref="chartRef" :style="{ width: formatUnit(width), height: formatUnit(height) }"></div>
</template>

<script setup>
import { formatUnit } from '@/utils/index'
import { useEcharts } from '@/hooks/use-echarts'

const props = defineProps({
  width: {
    type: [String, Number],
    default: '100%'
  },
  height: {
    type: [String, Number],
    default: '400px'
  },
  option: Object,
})

const chartRef = ref(null)

onMounted(() => {
  const { renderCharts } = useEcharts(chartRef)
  renderCharts(props.option)
})

</script>

<style lang="scss" scoped></style>