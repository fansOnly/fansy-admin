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

// let chart = null
const chartRef = ref(null)

// watchEffect(() => {
//   renderCharts()
// })


onMounted(() => {
  const { renderCharts } = useEcharts(chartRef)
  renderCharts(props.option)
})

// function initChart(isDark) {
//   console.log('isDark: ', isDark);
//   if (chartRef.value) {
//     console.log('chartRef.value: ', chartRef.value);
//     chart = echarts.init(chartRef.value, isDark ? 'dark' : null)
//     chart.setOption(props.option)
//   }
// }

// const reloadChart = () => {
//   chart.setOption(props.option)
// }

// defineExpose({
//   reloadChart
// })
</script>

<style lang="scss" scoped></style>