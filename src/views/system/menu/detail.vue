<template>
  <div v-loading="loading">
    <fansy-form :form-data="formData" :form-items="formItems" :form-config="{ showBack: true }" @submit="handleSubmit">
      <template #parentId="{ prop }">
        <el-tree-select v-model="formData[prop]" :data="menuTree" render-after-expand check-on-click-node show-checkbox
          style="width: 100%" />
      </template>
      <template #relationId="{ prop }">
        <el-tree-select v-model="formData[prop]" :data="menuTree" render-after-expand check-on-click-node show-checkbox
          style="width: 100%" />
      </template>
      <template #icon="{ prop }">
        <el-icon v-if="formData[prop]" :size="40" class="mr-2">
          <component :is="formData[prop]" />
        </el-icon>
        <el-button type="default" @click="openIconDialog(prop)">选择图标</el-button>
      </template>
    </fansy-form>

    <dialog-select-icon v-model:show="visibleIcon" @confirm="confirmIconDialog" />
  </div>
</template>

<script setup>
import DialogSelectIcon from '@/components/modals/dialog-select-icon/index.vue'

import { getMenuList, getMenuDetail, addMenu, updateMenu } from '@/api/common/menu'
import { ACCOUNT_STATUS_LIST, MENU_TYPE_LIST, ONE_ZERO_LIST } from '@/constants/common'
import { generateRouteTree } from '@/router/util'
import { useMessage } from '@/hooks/use-message'

const router = useRouter()
const route = useRoute()
const { showMessage } = useMessage()

const { id, type: addType } = route.query || {}
const loading = ref(false)
const menuTree = ref([])
const dialogProp = ref('')
const visibleIcon = ref(false)

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
    label: '父级菜单',
    prop: 'parentId',
    placeholder: '请选择父级菜单',
    type: 'custom',
    rules: [
      // {
      //   required: true,
      //   message: '请选择父级菜单',
      //   trigger: 'blur'
      // }
    ]
  },
  {
    label: '关联菜单',
    prop: 'relationId',
    placeholder: '请选择关联菜单',
    type: 'custom',
    rules: [
      // {
      //   required: true,
      //   message: '请选择关联菜单',
      //   trigger: 'blur'
      // }
    ]
  },
  {
    label: '菜单名称',
    prop: 'title',
    placeholder: '请输入菜单名称',
    rules: [
      {
        required: true,
        message: '请输入菜单名称',
        trigger: 'blur'
      }
    ]
  },
  {
    label: '菜单图标',
    prop: 'icon',
    placeholder: '请选择菜单图标',
    type: 'custom'
  },
  {
    label: '路由名称',
    prop: 'name',
    placeholder: '请输入路由名称',
    rules: [
      {
        required: true,
        message: '请输入路由名称',
        trigger: 'blur'
      }
    ]
  },
  {
    label: '路由组件',
    prop: 'component',
    placeholder: '请输入路由组件',
    rules: [
      {
        required: true,
        message: '请输入路由组件',
        trigger: 'blur'
      }
    ]
  },
  {
    label: '路由地址',
    prop: 'path',
    placeholder: '请输入路由地址',
    rules: [
      {
        required: true,
        message: '请输入路由地址',
        trigger: 'blur'
      }
    ]
  },
  {
    label: '菜单类型',
    prop: 'type',
    placeholder: '请选择菜单类型',
    type: 'select',
    options: MENU_TYPE_LIST,
    rules: [
      {
        required: true,
        message: '请选择菜单类型',
        trigger: 'blur'
      }
    ]
  },
  {
    label: '登录权限',
    prop: 'auth',
    placeholder: '请设置登录权限',
    type: 'radio',
    options: ONE_ZERO_LIST,
    rules: [
      {
        required: true,
        message: '请设置登录权限',
        trigger: 'blur'
      }
    ]
  },
  {
    label: '固钉菜单',
    prop: 'affix',
    placeholder: '请设置固钉菜单',
    type: 'radio',
    options: ONE_ZERO_LIST,
    rules: [
      {
        required: true,
        message: '请设置固钉菜单',
        trigger: 'blur'
      }
    ]
  },
  {
    label: '缓存菜单',
    prop: 'cache',
    placeholder: '请设置缓存菜单',
    type: 'radio',
    options: ONE_ZERO_LIST,
    rules: [
      {
        required: true,
        message: '请设置缓存菜单',
        trigger: 'blur'
      }
    ]
  },
  {
    label: '显示菜单',
    prop: 'visible',
    placeholder: '请设置显示菜单',
    type: 'radio',
    options: ONE_ZERO_LIST,
    rules: [
      {
        required: true,
        message: '请设置显示菜单',
        trigger: 'blur'
      }
    ]
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
  parentId: '',
  relationId: '',
  title: '',
  name: '',
  path: '',
  component: '',
  type: '',
  icon: '',
  auth: 1,
  affix: 0,
  visible: 1,
  cache: 1,
  updateTime: '',
  createTime: new Date(),
  status: 1
})

const addFormItem = (type) => {
  if (type === 'sub') {
    formItems.splice(2, 1)
  }
}

const openIconDialog = (prop) => {
  dialogProp.value = prop
  visibleIcon.value = true
}

const confirmIconDialog = (val) => {
  formData.value[dialogProp.value] = val
  visibleIcon.value = false
}

const handleSubmit = () => {
  const api = id ? updateMenu : addMenu
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

const loadList = async () => {
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

const loadDetail = async () => {
  try {
    loading.value = true
    const data = await getMenuDetail(id)
    formData.value = data
    const type = data.parentId ? 'sub' : data.relationId ? 'relation' : 'default'
    addFormItem(type)
  } catch (error) {
    showMessage('error', error.message)
  } finally {
    loading.value = false
  }
}

addFormItem(addType)

onMounted(async () => {
  await loadList()
  if (id) {
    loadDetail()
  }
})
</script>

<style lang="scss" scoped></style>