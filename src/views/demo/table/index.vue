<template>
  <div>
    <fansy-form :form-data="formData" :form-items="formItems" show-reset-button
      :form-config="{ submitOnReset: true, useSearchForm: true, size: 'default' }" confirmButtonText="搜索"
      @submit="handleSearch" @reset="handleReset">
      <template #custom="{ prop }">
        <el-input v-model="formData[prop]" placeholder="this is a custom input" style="width: 100%" />
      </template>
    </fansy-form>
    <fansy-table :table-data="tableData" :init-data="initData" :table-config="tableConfig" :tools-config="toolsConfig"
      :columns="columns" :actions="actions" :loading="loading" @add="handleAdd" @export="handleExport"
      @batch-delete="handleBatchDelete" @action="handleAction"
      @page-change="pageData => onPageChange(pageData, formData)">
      <template #date="{ index, row }">
        slot 插槽 - {{ row.date }}
      </template>
    </fansy-table>
  </div>
</template>

<script setup>
import { getTableList, deleteTable, updateTable } from '@/api/demo/table'
import { COMMON_ACTIONS, DATA_STATUS_LIST } from '@/constants/common'
import { getConstantLabel } from '@/constants/util'
import { useTable } from '@/hooks/use-table'

const formItems = [
  {
    label: '标题',
    prop: 'title',
    placeholder: '请输入标题',
    validation: {},
    type: 'input'
  },
  {
    label: '省份',
    prop: 'province',
    placeholder: '请选择省份',
    type: 'select',
    options: [
      { label: '安徽省', value: '0001' },
      { label: '上海市', value: '0002' },
      { label: '山东省', value: '0003' },
      { label: '四川省', value: '0004' },
      { label: '广东省', value: '0005' }
    ]
  },
  {
    label: '日期',
    prop: 'date',
    placeholder: '请选择日期',
    type: 'date'
  },
  {
    label: '日期范围',
    prop: 'daterange',
    placeholder: '请选择起始日期',
    type: 'daterange',
    config: {
      separator: '至',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      shortcuts: [
        {
          text: '近一周',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
          }
        },
        {
          text: '近一月',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            return [start, end]
          }
        },
        {
          text: '近三个月',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            return [start, end]
          }
        }
      ]
    }
  },
  {
    label: '时间',
    prop: 'datetime',
    placeholder: '请选择时间',
    type: 'datetime'
  },
  {
    label: '时间范围',
    prop: 'datetimerange',
    placeholder: '请选择起始时间',
    type: 'datetimerange',
    config: {
      layoutSpan: 12
    }
  },
  {
    label: '状态',
    prop: 'state',
    placeholder: '请选择状态',
    type: 'multiple-select',
    // config: {
    //   maxCollapseTags: 3
    // },
    options: [
      { label: '草稿', value: '0' },
      { label: '已发布', value: '1' },
      { label: '已下架', value: '2' },
      { label: '异常', value: '3' },
      { label: '异常', value: '4' },
      { label: '异常', value: '5' }
    ]
  },
  {
    type: 'custom',
    label: '自定义',
    prop: 'custom'
  }
]

const columns = [
  {
    label: '序号',
    prop: 'sortnum',
    width: 60,
    fixed: true // left right
  },
  {
    label: 'ID',
    prop: 'id',
    width: 190
  },
  {
    label: '姓名',
    prop: 'name',
    width: 120
  },
  {
    label: '省份',
    prop: 'province',
    width: 180
  },
  {
    label: '城市',
    prop: 'city',
    width: 180
  },
  {
    label: '简介',
    prop: 'content',
    showOverflowTooltip: true,
    width: 200
  },
  {
    label: '邮编',
    prop: 'zip',
    width: 120
  },
  {
    label: '日期',
    prop: 'date',
    width: 180,
    custom: true
  },
  {
    label: '状态',
    prop: 'status',
    width: 80,
    formatter: (row) => {
      return getConstantLabel(DATA_STATUS_LIST, row.status)
    }
  }
]

const actions = [
  {
    sort: 11,
    label: '置顶',
    value: COMMON_ACTIONS.TOP,
    icon: 'Top',
    type: 'info',
    isShow: (status) => status !== 2,
    data: 2
  },
  {
    sort: 12,
    label: '取消置顶',
    value: COMMON_ACTIONS.UN_TOP,
    icon: 'Bottom',
    type: 'info',
    isShow: (status) => status === 2,
    data: 1
  }
]
const formData = reactive({
  title: '张'
})
const { tableData, total, loading, loadList, onPageChange } = useTable(getTableList, {
  currentPage: 1,
  pageSize: 10,
  ...formData
})
const initData = reactive({
  selections: [],
  // selection: '',
  pagination: {
    currentPage: 1,
    pageSize: 10,
    total: total
  }
})
const tableConfig = {
  isActionColumnFixed: true,
  actionColumnWidth: 350
}
const toolsConfig = {
  showExport: true
}

const handleSearch = () => {
  console.log('handleSearch =====', formData)
  loadList(formData)
}
const handleReset = () => {
  console.log('handleReset =====', formData)
}

const handleAdd = () => {
  console.log('handleAdd: ')
}

const handleExport = () => {
  console.log('handleExport: ')
}

const handleBatchDelete = (selections) => {
  console.log('handleBatchDelete: ', selections)
  deleteTable(selections)
  loadList(formData)
}

const handleAction = (action, index, data) => {
  console.log('handleAction value, index, data: ', action, index, data)
  if (action.value === COMMON_ACTIONS.EDIT) {
    router.push({ path: '/system/admin/edit', query: { id: data.id } })
  } else if (action.value === COMMON_ACTIONS.DELETE) {
    deleteTable(data.id)
    loadList(formData)
  } else {
    // 更新状态
    updateTable({ id: data.id, status: action.data })
    loadList(formData)
  }
}
</script>