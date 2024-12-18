import { nextTick } from 'vue'
import {
  tryOnUnmounted,
  useDebounceFn,
  useResizeObserver,
  useTimeoutFn,
  useWindowSize
} from '@vueuse/core'
import { echarts } from './echart'
import { useTheme } from '@/hooks/use-theme'
const { isDark } = useTheme()

export const useEcharts = (chartRef) => {
  let chartInstance = null
  let chartOptions = null

  const { width, height } = useWindowSize()
  const resizeHandler = useDebounceFn(resizeCharts, 200)

  function initCharts(theme) {
    if (!chartRef?.value) return
    chartInstance = echarts.init(chartRef.value, theme || isDark.value ? 'dark' : null)
  }

  function renderCharts(options = {}, clear = false) {
    chartOptions = options
    return new Promise((resolve) => {
      nextTick(() => {
        useTimeoutFn(() => {
          if (!chartInstance) {
            initCharts()
            if (!chartInstance) return
          }
          if (clear) {
            chartInstance.clear()
          }
          chartInstance.setOption(chartOptions)
          resolve(null)
        }, 30)
      })
    })
  }

  function resizeCharts() {
    chartInstance?.resize({
      animation: {
        duration: 300,
        easing: 'quadraticIn'
      }
    })
  }

  watch([width, height], () => {
    resizeHandler?.()
  })

  watch(isDark, (newVal) => {
    if (!chartInstance) return
    chartInstance.dispose()
    initCharts()
    renderCharts(chartOptions)
    resizeCharts()
  })

  useResizeObserver(chartRef, resizeHandler)

  tryOnUnmounted(() => {
    chartInstance?.dispose()
  })

  return {
    renderCharts,
    resizeCharts
  }
}
