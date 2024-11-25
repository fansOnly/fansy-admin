import { useStorage, StorageSerializers } from '@vueuse/core'
import { useGlobalStore } from '@/store/app'
const globalStore = useGlobalStore()

export const useNavBarHook = () => {
  const storageKey = `${import.meta.env.VITE_NAMESPACE}nav-bar-data`
  // localStorage.removeItem(storageKey)
  // sessionStorage.removeItem(storageKey)
  const storage = localStorage.getItem(storageKey) || []
  const navBarData = useStorage(storageKey, storage, localStorage, {
    serializer: StorageSerializers.object
  })

  const router = useRouter()
  const currentNavBar = router.currentRoute
  const currentNavIndex = ref(-1)
  const routes = router.getRoutes()

  const _init = () => {
    initAffix()
    initCurrent()
  }

  const initAffix = () => {
    routes.filter((v) => v.meta?.affix).forEach(addItem)
  }

  const initCurrent = () => {
    const current = routes.find((v) => v.name === currentNavBar.value.name)
    addItem(current)
  }

  const addItem = (item) => {
    if (!checkItem(item.name)) return
    if (!hasItem(navBarData.value, item)) {
      navBarData.value.push({
        name: item.name,
        path: item.path,
        meta: item.meta
      })
    }
    currentNavIndex.value = navBarData.value.findIndex((v) => v.name === item.name)
  }

  const removeItem = (name) => {
    if (!checkItem(name)) return

    const index = navBarData.value.findIndex((v) => v.name === name)
    navBarData.value.splice(index, 1)
    if (currentNavIndex.value === index) {
      currentNavIndex.value = index - 1
      const prev = navBarData.value[currentNavIndex.value]
      router.push(prev.path)
    }
  }

  function hasItem(arr, item) {
    return arr.find((v) => v.name === item.name)
  }

  const checkItem = (name) => {
    if (!router.hasRoute(name)) {
      console.error(
        `Permission denied on route ${item.path}. Please check if the route is available?`
      )
      return false
    }
    return !!name
  }

  const clickItem = (name) => {
    const index = navBarData.value.findIndex((v) => v.name === name)
    currentNavIndex.value = index
    const target = navBarData.value[index]
    router.push(target.path)
  }

  const closeAll = () => {
    navBarData.value = affixNavList.value.slice()
    currentNavIndex.value = affixNavList.value.length - 1
    const last = navBarData.value[currentNavIndex.value]
    router.push(last?.path || '/')
  }

  const closeOther = () => {
    const current = navBarData.value[currentNavIndex.value]
    if (currentNavIndex.value > affixNavList.value.length) {
      navBarData.value = affixNavList.value.concat(current)
    } else {
      navBarData.value = affixNavList.value
    }
  }

  const closeLeft = () => {
    if (currentNavIndex.value === 0) return
    const rightNavList = navBarData.value.splice(currentNavIndex.value)

    if (currentNavIndex.value >= affixNavList.value.length) {
      navBarData.value = affixNavList.value.concat(rightNavList)
    } else {
      for (let i = currentNavIndex.value - 1; i >= 0; i--) {
        const item = affixNavList.value[i]
        if (hasItem(rightNavList, item)) {
          continue
        } else {
          rightNavList.unshift(item)
        }
      }
      navBarData.value = rightNavList
    }
    currentNavIndex.value = navBarData.value.findIndex((v) => v.name === currentNavBar.value.name)
  }

  const closeRight = () => {
    if (currentNavIndex.value === navBarData.value.length - 1) return
    const leftNavList = navBarData.value.splice(0, currentNavIndex.value + 1)

    if (currentNavIndex.value < affixNavList.value.length) {
      for (let i = currentNavIndex.value + 1; i < affixNavList.value.length; i++) {
        const item = affixNavList.value[i]
        if (hasItem(leftNavList, item)) {
          continue
        } else {
          leftNavList.splice(i, 0, item)
        }
      }
    }
    navBarData.value = leftNavList
    currentNavIndex.value = navBarData.value.findIndex((v) => v.name === currentNavBar.value.name)
  }

  const openBlank = () => {
    window.open(location.href, '_blank')
  }

  const maximize = () => {
    globalStore.setLayoutMaximize(true)
  }
  const minimize = () => {
    globalStore.setLayoutMaximize(false)
  }

  const affixNav = () => {
    const current = navBarData.value[currentNavIndex.value]
    current.meta.affix = true
    navBarData.value.splice(currentNavIndex.value, 1, current)
    currentNavIndex.value = navBarSortedList.value.findIndex(
      (v) => v.name === currentNavBar.value.name
    )
  }
  const unAffixNav = () => {
    const current = navBarData.value[currentNavIndex.value]
    current.meta.affix = false
    navBarData.value.splice(currentNavIndex.value, 1, current)
    currentNavIndex.value = navBarSortedList.value.findIndex(
      (v) => v.name === currentNavBar.value.name
    )
  }

  const handleCommand = (command) => {
    switch (command) {
      case 'close-all':
        closeAll()
        break
      case 'close-other':
        closeOther()
        break
      case 'close-left':
        closeLeft()
        break
      case 'close-right':
        closeRight()
        break
      case 'open-blank':
        openBlank()
        break
      case 'maximize':
        maximize()
        break
      case 'minimize':
        minimize()
        break
      case 'affix':
        affixNav()
        break
      case 'affix-off':
        unAffixNav()
        break
      default:
        break
    }
  }

  const closeable = computed(() => {
    return (item) => !item.meta?.affix && navBarData.value.length > 1
  })

  const currentNav = computed(() => navBarData.value[currentNavIndex.value])

  const affixNavList = computed(
    () =>
      routes
        .filter((v) => v.meta?.affix)
        .map((v) => ({
          name: v.name,
          path: v.path,
          meta: v.meta
        }))
    // .sort((a, b) => a.meta.sortnum - b.meta.sortnum)
  )

  const navBarSortedList = computed(() =>
    navBarData.value
      // .sort((a, b) => a.meta.sortnum - b.meta.sortnum)
      .sort((a, b) => b.meta.affix - a.meta.affix)
  )

  const isFirstNav = computed(() => currentNavIndex.value === 0)

  const isLastNav = computed(() => currentNavIndex.value === navBarData.value.length - 1)

  _init()

  onBeforeRouteUpdate((to) => addItem(to))

  return {
    navBarSortedList,
    currentNavIndex,
    currentNavBar,
    currentNav,
    closeable,
    isFirstNav,
    isLastNav,
    clickItem,
    removeItem,
    handleCommand
  }
}

// export const isSameRoute = (r1 = {}, r2 = {}) => {
//   if (r1.name !== r2.name) {
//     return false
//   }
//   if (r1.fullPath !== r2.fullPath) {
//     return false
//   }
//   // if (r1.query && r2.query && Object.keys(r1.query).length !== Object.keys(r2.query).length) {
//   //   return false
//   // }
//   for (const key in r1.query) {
//     if (r1.query[key] !== r2.query[key]) {
//       return false
//     }
//   }
//   return true
// }
