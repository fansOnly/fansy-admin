import { useFullscreen as ufs } from '@vueuse/core'

export function useFullscreen(context = null) {
  const { isFullscreen, toggle } = ufs(context)

  return { isFullscreen, toggleFullScreen: toggle }
}
