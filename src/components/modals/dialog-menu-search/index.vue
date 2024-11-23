<template>
  <fansy-dialog v-model="show" width="500" :show-close="false" style="--el-dialog-padding-primary: 0">
    <el-input ref="searchInputRef" v-model="search" clearable placeholder="搜索导航菜单" prefix-icon="Search" size="large"
      class="w-full p-16px" @keydown.up.prevent="" @keydown.down.prevent="" />
    <div class="w-full min-h-100px max-h-300px px-16px overflow-y-auto">
      <template v-if="!searchList?.length">
        <div v-if="search" class="flex-[center,center,column] h-100px color-#888 select-none">
          <el-icon size="18px">
            <Search />
          </el-icon>
          <div class="flex-[center] mt-8px color-#888">没有搜索到相关内容 "<span
              class="ml-2px color-custom-var(--el-text-color-regular) font-500">{{ search
              }}</span>"</div>
        </div>
        <div v-else class="flex-[center,center,column] h-100px select-none">没有搜索历史</div>
      </template>
      <template v-if="searchList?.length">
        <div v-if="!search" class="mb-12px font-500">搜索历史</div>
        <div v-for="(item, index) in searchList" :key="item.meta?.id" ref="searchItemRef"
          class="flex-[center,space-between] w-full h-56px mb-8px px-16px rounded-4px font-size-16px cursor-pointer"
          :class="[searchIndex === index ? 'background-custom-var(--el-color-primary-light-3) color-#fff' : 'background-custom-var(--el-fill-color) color-custom-var(--el-text-color-regular)']"
          @click="onConfirm(item, index)">
          <el-icon v-if="item.meta?.icon" size="20px" class="flex-shrink-0 mr-8px">
            <component :is="item.meta.icon" />
          </el-icon>
          <span class="flex-1 select-none">{{ item.meta.title }}</span>
          <svg v-if="search && searchIndex === index" width="20" height="20" viewBox="0 0 20 20">
            <g stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 3v4c0 2-2 4-4 4H2"></path>
              <path d="M8 17l-6-6 6-6"></path>
            </g>
          </svg>
          <div v-if="!search"
            class="flex-shrink-0 flex-[center,center] w-24px h-24px rounded-full transition hover:background-custom-rgba(0,0,0,.3)"
            @click.stop="onRemove(index)">
            <el-icon size="18px">
              <Close />
            </el-icon>
          </div>
        </div>
      </template>
    </div>
    <div
      class="flex-[center,space-between] h-44px mt-8px px-12px shadow-custom-0_0_2px_var(--fansy-box-shadow-color-lighter)">
      <div class="flex-1 flex-[center] gap-10px">
        <div class="flex-[center]"><svg width="15" height="15" aria-label="Enter key" role="img">
            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2">
              <path d="M12 3.53088v3c0 1-1 2-2 2H4M7 11.53088l-3-3 3-3"></path>
            </g>
          </svg><span class="ml-4px font-size-12px select-none">选择</span></div>
        <div class="flex-[center]"><svg width="15" height="15" aria-label="Arrow down" role="img">
            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2">
              <path d="M7.5 3.5v8M10.5 8.5l-3 3-3-3"></path>
            </g>
          </svg><svg width="15" height="15" aria-label="Arrow up" role="img">
            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2">
              <path d="M7.5 11.5v-8M10.5 6.5l-3-3-3 3"></path>
            </g>
          </svg><span class="ml-4px font-size-12px select-none">切换</span></div>
        <div class="flex-[center]"><svg width="15" height="15" aria-label="Escape key" role="img">
            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2">
              <path
                d="M13.6167 8.936c-.1065.3583-.6883.962-1.4875.962-.7993 0-1.653-.9165-1.653-2.1258v-.5678c0-1.2548.7896-2.1016 1.653-2.1016.8634 0 1.3601.4778 1.4875 1.0724M9 6c-.1352-.4735-.7506-.9219-1.46-.8972-.7092.0246-1.344.57-1.344 1.2166s.4198.8812 1.3445.9805C8.465 7.3992 8.968 7.9337 9 8.5c.032.5663-.454 1.398-1.4595 1.398C6.6593 9.898 6 9 5.963 8.4851m-1.4748.5368c-.2635.5941-.8099.876-1.5443.876s-1.7073-.6248-1.7073-2.204v-.4603c0-1.0416.721-2.131 1.7073-2.131.9864 0 1.6425 1.031 1.5443 2.2492h-2.956">
              </path>
            </g>
          </svg><span class="ml-4px font-size-12px select-none">关闭</span></div>
      </div>
    </div>
  </fansy-dialog>
</template>

<script setup>
import { useStorage, StorageSerializers, onKeyStroke, useArrayUnique } from '@vueuse/core'
const router = useRouter()
const routes = router.getRoutes()
const show = defineModel('show')
const emit = defineEmits(['cancel', 'confirm'])

const searchInputRef = ref(null)
const searchItemRef = ref(null)
const search = ref('')
const searchIndex = ref(0)
const storageKey = `${import.meta.env.VITE_NAMESPACE}search-history`
// localStorage.removeItem(storageKey)
const storage = localStorage.getItem(storageKey) || []
const history = useStorage(storageKey, storage, localStorage, { serializer: StorageSerializers.object })
const searchList = computed(() => search.value ? routes.filter(route => route.meta.title.includes(search.value) || route.name.includes(search.value)) : (history.value || []))

const onConfirm = async (item, index) => {
  searchIndex.value = index
  const data = useArrayUnique(history.value.concat(item), (a, b) => a.meta.id === b.meta.id)
  history.value = data.value
  await nextTick();
  if (item.meta.type === 'external-link') {
    window.open(item.meta.src, '_blank');
  } else {
    router.push({ path: item.path, replace: true });
  }
  resetSearch()
  emit('confirm')
}

const onRemove = (index) => {
  history.value.splice(index, 1)
  if (searchIndex.value > history.value.length - 1) {
    searchIndex.value = history.value.length - 1
  }
}

function onKeydownEnter() {
  const item = searchList.value[searchIndex.value]
  onConfirm(item, searchIndex.value)
}
function onKeydownUp() {
  if (!searchList.value.length) return
  searchIndex.value = Math.max(0, --searchIndex.value)
  searchItemRef.value[searchIndex.value].scrollIntoView({ block: 'nearest' })
}
function onKeydownDown() {
  if (!searchList.value.length) return
  searchIndex.value = Math.min(searchList.value.length - 1, ++searchIndex.value)
  searchItemRef.value[searchIndex.value].scrollIntoView({ block: 'nearest' })
}
function onKeydownClose() {
  resetSearch()
  emit('cancel')
}

function resetSearch() {
  show.value = false
  search.value = ''
  searchIndex.value = 0
}


watchEffect(() => {
  if (show.value) {
    setTimeout(() => {
      searchInputRef.value?.focus()
    }, 300);
  }
})

onMounted(async () => {
  onKeyStroke('Enter', onKeydownEnter);
  onKeyStroke('ArrowUp', onKeydownUp);
  onKeyStroke('ArrowDown', onKeydownDown);
  onKeyStroke('Escape', onKeydownClose);
})
</script>

<style lang="scss" scoped></style>