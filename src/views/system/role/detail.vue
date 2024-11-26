<template>
  <div v-loading="loading">
    <fansy-form :form-data="formData" :form-items="formItems" :form-config="{ showBack: true }" @submit="handleSubmit">
      <template #permissions="{ prop }">
        <el-tree-select v-model="formData[prop]" :data="menuTree" multiple render-after-expand check-on-click-node
          show-checkbox style="width: 100%" />
      </template>
    </fansy-form>
  </div>
</template>

<script setup>
import { getRoleDetail, addRole, updateRole } from '@/api/common/role'
import { getMenuList } from '@/api/common/menu'
import { ACCOUNT_STATUS_LIST } from '@/constants/common'
import { generateRouteTree } from '@/router/util'
import { useMessage } from '@/hooks/use-message'

const router = useRouter()
const route = useRoute()
const { showMessage } = useMessage()

const id = route.query.id
const loading = ref(false)
const menuTree = ref([])

const formItems = [
  {
    label: '序号',
    prop: 'sortnum',
    placeholder: '请输入序号',
    type: 'number',
    attrs: {
      step: 10,
      min: 1
    }
  },
  {
    label: '角色名称',
    prop: 'title',
    placeholder: '请输入角色名称',
    rules: [
      {
        required: true,
        message: '请输入角色名称',
        trigger: 'blur'
      }
    ]
  },
  {
    label: '角色权限',
    prop: 'permissions',
    placeholder: '请选择角色权限',
    type: 'custom'
  },
  {
    label: '角色描述',
    prop: 'content',
    placeholder: '请输入角色描述',
    type: 'textarea',
    attrs: {
      autosize: { minRows: 2, maxRows: 4 }
    }
  },
  {
    label: '状态',
    prop: 'status',
    placeholder: '请选择状态',
    type: 'select',
    options: ACCOUNT_STATUS_LIST,
    rules: [
      {
        required: true,
        message: '请选择状态',
        trigger: 'blur'
      }
    ]
  },
  {
    label: '创建时间',
    prop: 'createTime',
    type: 'datetime',
    showOnlyValued: true,
    attrs: {
      readonly: true
    }
  },
  {
    label: '更新时间',
    prop: 'updateTime',
    type: 'datetime',
    showOnlyValued: true,
    attrs: {
      readonly: true
    }
  }
]
const formData = ref({
  sortnum: 10,
  title: '',
  content: '',
  permissions: [],
  updateTime: '',
  createTime: new Date(),
  status: 1
})

const handleSubmit = () => {
  const api = id ? updateRole : addRole
  try {
    loading.value = true
    api(formData.value).then((res) => {
      if (res) {
        showMessage('success', `${id ? '编辑' : '新增'}成功`)
        router.back()
      }
    })
  } catch (error) {
    showMessage('error', error.message)
  } finally {
    loading.value = false
  }
}

const loadDetail = async () => {
  try {
    loading.value = true
    const data = await getRoleDetail(id)
    formData.value = data
  } catch (error) {
    showMessage('error', error.message)
  } finally {
    loading.value = false
  }
}

const loadMenuList = async () => {
  try {
    loading.value = true
    const data = await getMenuList()
    menuTree.value = generateRouteTree(
      data.map((v) => {
        return {
          id: v.id,
          parentId: v.parentId,
          label: v.title,
          value: v.id,
          disabled: v.status !== 1,
          children: v.children
        }
      })
    )
  } catch (error) {
    showMessage('error', error.message)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadMenuList()
  if (id) {
    loadDetail()
  }
})
</script>

<style lang="scss" scoped></style>