
import { useTitle as usePageTitle } from '@vueuse/core'

export const useTitle = () => {
  const title = usePageTitle()
  const router = useRouter()
  const current = router.currentRoute

  watch(
    () => current.value.path,
    () => {
      const routeTitle = current.value.meta.title
      title.value = `${routeTitle} - ${import.meta.env.VITE_APP_TITLE}`
    },
    {
      immediate: true
    }
  )
}