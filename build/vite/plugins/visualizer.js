import visualizer from 'rollup-plugin-visualizer'

/**
 * 依赖分析
 */
export const useVisualizerPlugin = () => {
  return visualizer({
    filename: './node_modules/.cache/visualizer/stats.html',
    open: true,
    gzipSize: true,
    brotliSize: true
  })
}