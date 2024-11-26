<template>
  <div v-loading="loading">
    <fansy-form :form-data="formData" :form-items="formItems" :form-config="{ showBack: true }" @submit="handleSubmit">
    </fansy-form>
  </div>
</template>

<script setup>
import { getAdminDetail, addAdmin, updateAdmin } from '@/api/common/admin'
import { getRoleList } from '@/api/common/role'
import { ACCOUNT_STATUS_LIST } from '@/constants/common'
import { isPhone, isEmail } from '@/utils/validate'
import { useMessage } from '@/hooks/use-message'

const router = useRouter()
const route = useRoute()
const { showMessage } = useMessage()

const id = route.query.id
const loading = ref(false)
const roleOptions = ref([])

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
    label: '登录账号',
    prop: 'username',
    placeholder: '请输入登录账号',
    rules: [
      {
        required: true,
        message: '请输入登录账号',
        trigger: 'blur'
      }
    ]
  },
  {
    label: '用户名',
    prop: 'nickname',
    placeholder: '请输入用户名',
    attrs: {
      maxlength: 20
    },
    rules: [
      {
        required: true,
        message: '请输入用户名',
        trigger: 'blur'
      }
    ]
  },
  {
    label: '手机号',
    prop: 'phone',
    placeholder: '请输入手机号',
    attrs: {
      maxlength: 11
    },
    rules: [
      {
        required: true,
        message: '请输入手机号',
        trigger: 'blur'
      },
      {
        validator: (rule, value, callback) => {
          if (!isPhone(value)) {
            callback(new Error('请输入正确的手机号'))
          } else {
            callback()
          }
        }
      }
    ]
  },
  {
    label: '邮箱',
    prop: 'email',
    placeholder: '请输入邮箱',
    attrs: {
      maxlength: 50
    },
    rules: [
      {
        validator: (rule, value, callback) => {
          if (value && !isEmail(value)) {
            callback(new Error('请输入正确的邮箱'))
          } else {
            callback()
          }
        }
      }
    ]
  },
  {
    label: '年龄',
    prop: 'age',
    placeholder: '请输入年龄',
    type: 'number',
    attrs: {
      class: 'input-number-align--left',
      controls: false,
      max: 120,
      min: 10
    }
  },
  {
    label: '角色',
    prop: 'roleId',
    placeholder: '请选择角色',
    type: 'select',
    options: [],
    rules: [
      {
        required: true,
        message: '请选择角色',
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
  username: '',
  nickname: '',
  phone: '',
  email: '',
  age: 18,
  avatar: '',
  roleId: '',
  updateTime: '',
  createTime: new Date(),
  status: 1
})

const handleSubmit = () => {
  const api = id ? updateAdmin : addAdmin
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

const renderRoleList = () => {
  formItems.forEach((v) => {
    if (v.prop === 'roleId') {
      v.options = roleOptions.value
    }
  })
}

const loadRoleList = async () => {
  try {
    loading.value = true
    const data = await getRoleList()
    roleOptions.value = data.list.map((v) => {
      return {
        label: v.title,
        value: v.id,
        disabled: v.status !== 1
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
    const data = await getAdminDetail(id)
    formData.value = data
  } catch (error) {
    showMessage('error', error.message)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadRoleList()
  renderRoleList()
  if (id) {
    loadDetail()
  }
})
</script>

<style lang="scss" scoped></style>