<template>
  <div>
    <fansy-form :form-data="formData" :form-items="formItems"
      :form-config="{ submitOnReset: true, useSearchForm: true, size: 'default' }" confirmButtonText="搜索"
      @submit="handleSearch">
    </fansy-form>
    <fansy-table :table-data="tableData" :init-data="initData" :table-config="tableConfig" :columns="columns"
      :loading="loading" @add="handleAdd" @batch-delete="handleBatchDelete" @action="handleAction"
      @page-change="pageData => onPageChange(pageData, formData)">
      <template #avatar="{ row }">
        <el-avatar :src="row.avatar" />
      </template>
    </fansy-table>
  </div>
</template>

<script setup>
import { getRoleList, updateRole, removeRole } from '@/api/common/role'
import { useTable } from '@/hooks/use-table'
import { COMMON_ACTIONS, ACCOUNT_STATUS_LIST } from '@/constants/common'
import { getConstantLabel } from '@/constants/util'

const router = useRouter()

const formItems = [
  {
    label: '角色名称',
    prop: 'title'
  },
  {
    label: '状态',
    prop: 'status',
    type: 'select',
    options: ACCOUNT_STATUS_LIST
  }
]

const columns = [
  {
    label: 'ID',
    prop: 'id',
    width: 190
  },
  {
    label: '角色名称',
    prop: 'title',
    minWidth: 120
  },
  {
    label: '角色描述',
    prop: 'content',
    showOverflowTooltip: true,
    minWidth: 120
  },
  {
    label: '创建时间',
    prop: 'createTime',
    width: 180
  },
  {
    label: '更新时间',
    prop: 'updateTime',
    width: 180
  },
  {
    label: '状态',
    prop: 'status',
    width: 80,
    formatter: (row) => {
      return getConstantLabel(ACCOUNT_STATUS_LIST, row.status)
    }
  }
]
const formData = reactive({
  title: '',
  status: ''
})
const { tableData, total, loading, loadList, onPageChange } = useTable(getRoleList, {
  currentPage: 1,
  pageSize: 10,
  ...formData
})
const initData = reactive({
  selections: [],
  pagination: {
    currentPage: 1,
    pageSize: 10,
    total: total
  }
})
const tableConfig = {
  actionColumnWidth: 60,
  actionPublishText: '启用',
  actionUnPublishText: '禁用',
  actionColumnWidth: 250,
  isActionColumnFixed: true,
}

const handleSearch = () => {
  loadList(formData)
}

const handleAdd = () => {
  router.push('/system/role/add')
}

const handleBatchDelete = (selections) => {
  removeRole(selections)
  loadList(formData)
}

const handleAction = (action, index, data) => {
  if (action.value === COMMON_ACTIONS.EDIT) {
    router.push({ path: '/system/role/edit', query: { id: data.id } })
  } else if (action.value === COMMON_ACTIONS.DELETE) {
    removeRole(data.id)
    loadList(formData)
  } else {
    updateRole({ id: data.id, status: action.data })
    loadList(formData)
  }
}
</script>