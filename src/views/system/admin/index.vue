<template>
  <div>
    <fansy-form :form-data="formData" :form-items="formItems"
      :form-config="{ submitOnReset: true, useSearchForm: true, size: 'default' }" confirmButtonText="搜索"
      @submit="handleSearch">
    </fansy-form>
    <fansy-table :table-data="tableData" :init-data="initData" :table-config="tableConfig"
      :tools-config="{ showExport: true }" :columns="columns" :loading="loading" @add="handleAdd" @export="handleExport"
      @batch-delete="handleBatchDelete" @action="handleAction"
      @page-change="pageData => onPageChange(pageData, formData)">
      <template #avatar="{ row }">
        <el-avatar :src="row.avatar" />
      </template>
    </fansy-table>
  </div>
</template>

<script setup>
import { getAdminList, updateAdmin, removeAdmin } from '@/api/common/admin'
import { useTable } from '@/hooks/use-table'
import { COMMON_ACTIONS, ACCOUNT_STATUS_LIST } from '@/constants/common'
import { getConstantLabel } from '@/constants/util'

const router = useRouter()

const formItems = [
  {
    label: '登录账号',
    prop: 'username'
  },
  {
    label: '用户名',
    prop: 'nickname'
  },
  {
    label: '手机号',
    prop: 'phone'
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
    label: '登录账号',
    prop: 'username',
    width: 120
  },
  {
    label: '用户名',
    prop: 'nickname',
    width: 80
  },
  {
    label: '头像',
    prop: 'avatar',
    width: 70,
    custom: true
  },
  {
    label: '手机',
    prop: 'phone',
    width: 130
  },
  {
    label: '邮箱',
    prop: 'email',
    width: 180
  },
  {
    label: '角色',
    prop: 'roleId',
    width: 180
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
      return getConstantLabel(ACCOUNT_STATUS_LIST, row.status, '异常')
    }
  }
]
const formData = reactive({
  username: '',
  nickname: '',
  phone: '',
  status: ''
})
const { tableData, total, loading, loadList, onPageChange } = useTable(getAdminList, {
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
  isActionColumnFixed: true,
  actionPublishText: '启用',
  actionUnPublishText: '禁用'
}

const handleSearch = () => {
  loadList(formData)
}

const handleAdd = () => {
  router.push('/system/admin/add')
}

const handleExport = () => {
  console.log('handleExport: ')
}

const handleBatchDelete = (selections) => {
  try {
    removeAdmin(selections)
    loadList(formData)
  } catch (error) { }
}

const handleAction = (action, index, data) => {
  if (action.value === COMMON_ACTIONS.EDIT) {
    router.push({ path: '/system/admin/edit', query: { id: data.id } })
  } else if (action.value === COMMON_ACTIONS.DELETE) {
    removeAdmin(data.id)
    loadList(formData)
  } else {
    updateAdmin({ id: data.id, status: action.data })
    loadList(formData)
  }
}
</script>