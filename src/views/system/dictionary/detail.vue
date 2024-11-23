<template>
  <div v-loading="loading">
    <fansy-form :form-data="formData" :form-items="formItems" :form-config="{ showBack: true }" @submit="handleSubmit">
      <template #options="{ prop }">
        <el-row :gutter="12" v-for="(item, index) in formData[prop]" :key="index" class="mb-5 w-full">
          <el-col :span="6">
            <el-form-item label="" :prop="`${prop}.${index}.title`" size="default"
              :rules="[{ required: true, message: '请输入字典项名称', trigger: 'blur' }]">
              <el-input v-model="item.title" placeholder="请输入字典项名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" :prop="`${prop}.${index}.value`" size="default"
              :rules="[{ required: true, message: '请输入字典项值', trigger: 'blur' }]">
              <el-input v-model="item.value" placeholder="请输入字典项值" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" :prop="`${prop}.${index}.status`" size="default"
              :rules="[{ required: true, message: '请选择状态', trigger: 'blur' }]">
              <el-select v-model="item.status" placeholder="请选择状态">
                <el-option v-for="opt in ACCOUNT_STATUS_LIST" :key="opt.value" :label="opt.label" :value="opt.value"
                  :disabled="opt.disabled" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="">
              <el-button type="danger" icon="Delete" size="default"
                @click="formData[prop].splice(index, 1)">删除</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button type="default" icon="Plus" size="default" @click="onAddDictionaryItem()">新增字典项</el-button>
      </template>
    </fansy-form>
  </div>
</template>

<script setup>
import { getDictionaryDetail, addDictionary, updateDictionary } from '@/api/common/dictionary'
import { ACCOUNT_STATUS_LIST } from '@/constants/common'
import { useMessage } from '@/hooks'

const router = useRouter()
const route = useRoute()
const { showMessage } = useMessage()

const id = route.query.id
const loading = ref(false)

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
    label: '字典名称',
    prop: 'title',
    placeholder: '请输入字典名称',
    rules: [
      {
        required: true,
        message: '请输入字典名称',
        trigger: 'blur'
      }
    ]
  },
  {
    label: '字典值',
    prop: 'options',
    type: 'custom',
    rules: [
      {
        required: true,
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
  id: '',
  sortnum: 10,
  title: '',
  options: [],
  updateTime: '',
  createTime: new Date(),
  status: 1
})

const onAddDictionaryItem = () => {
  formData.value.options.push({
    title: '',
    value: '',
    status: 1
  })
}

const handleSubmit = () => {
  const api = id ? updateDictionary : addDictionary
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
    const data = await getDictionaryDetail(id)
    formData.value = data
  } catch (error) {
    showMessage('error', error.message)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (id) {
    loadDetail()
  }
})
</script>

<style lang="scss" scoped></style>