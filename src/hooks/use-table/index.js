import { useMessage } from '../use-message'
const { showErrorMessage } = useMessage()

export const useTable = (api, params = {}) => {
  const { currentPage = 1, pageSize = 10, ...rest } = params
  const tableData = ref([])
  const page = ref(currentPage)
  const size = ref(pageSize)
  const total = ref(0)
  const loading = ref(false)

  const onPageChange = (data = {}, params = {}) => {
    if (data.currentPage) {
      page.value = data.currentPage
    }
    if (data.pageSize) {
      size.value = data.pageSize
    }
    loadList(params)
  }

  const loadList = async (params = {}) => {
    try {
      loading.value = true
      const data = await api({
        page: page.value,
        pageSize: size.value,
        ...rest,
        ...params
      })
      tableData.value = data.list
      total.value = data.total
      loading.value = false
    } catch (error) {
      showErrorMessage(error.message)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    loadList()
  })

  return {
    tableData,
    total,
    loading,
    loadList,
    onPageChange
  }
}
