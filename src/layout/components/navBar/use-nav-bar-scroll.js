import { useDebounceFn } from '@vueuse/core'

export const useNavBarScroll = () => {
  const navScrollRef = ref(null)
  const scrollable = ref(false)
  const scrollLeft = ref(0)
  const scrollLeftAble = ref(false)
  const scrollRightAble = ref(false)

  // const autoDistance = computed(() => {
  //   const { scrollContentWidth } = getScrollElWidth()
  //   return 2 * scrollContentWidth / navBarSortedList.value.length
  // })

  async function scrollDistance(direction = '', distance = 200) {
    if (direction === 'left' && !scrollLeftAble.value) return
    if (direction === 'right' && !scrollRightAble.value) return
    await nextTick()
    const wrapRef = navScrollRef.value?.wrapRef
    if (wrapRef && scrollable.value) {
      navScrollRef.value.scrollTo({
        behavior: 'smooth',
        left: wrapRef.scrollLeft + (direction === 'left' ? -distance : distance)
      })
    }
  }

  async function scrollToActive() {
    await nextTick()
    const wrapRef = navScrollRef.value?.wrapRef
    if (wrapRef && scrollable.value) {
      requestAnimationFrame(() => {
        const activeRef = wrapRef.querySelector('.is-active')
        if (activeRef) {
          activeRef.scrollIntoView({ behavior: 'smooth', inline: 'start' })
        }
      })
    }
  }

  async function checkScrollable() {
    await nextTick()
    const wrapRef = navScrollRef.value?.wrapRef
    if (wrapRef) {
      const { scrollContentWidth, scrollWrapWidth } = getScrollElWidth()
      scrollable.value = scrollWrapWidth < scrollContentWidth
    }
  }

  function getScrollElWidth() {
    const wrapRef = navScrollRef.value?.wrapRef
    if (!wrapRef) return {}
    return {
      scrollContentWidth: wrapRef.scrollWidth,
      scrollWrapWidth: wrapRef.offsetWidth
    }
  }

  function getScrollDirection() {
    const { scrollContentWidth, scrollWrapWidth } = getScrollElWidth()
    scrollLeftAble.value = scrollLeft.value > 0
    scrollRightAble.value = scrollLeft.value < scrollContentWidth - scrollWrapWidth
  }

  const onScroll = useDebounceFn(({ scrollLeft: value }) => {
    scrollLeft.value = value
    getScrollDirection()
  })

  onMounted(() => {
    checkScrollable()
    scrollToActive()
    getScrollDirection()
  })

  return {
    navScrollRef,
    scrollable,
    scrollLeft,
    scrollLeftAble,
    scrollRightAble,
    onScroll,
    scrollDistance,
    scrollToActive,
    checkScrollable
  }
}
