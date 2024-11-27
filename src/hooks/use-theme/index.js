import { useDark, useToggle } from '@vueuse/core'

export const useTheme = () => {
  const isDark = useDark()
  const toggleDark = useToggle(isDark)

  // const watchMedia = () => {
  //   // 监听系统主题偏好设置变化
  //   window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({matches}) => {
  //   console.log('prefers-color-scheme: dark: ', matches)
  //   })
  // }

  return {
    isDark,
    toggleDark
  }
}
