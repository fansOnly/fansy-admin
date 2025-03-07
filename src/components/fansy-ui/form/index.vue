<template>
  <el-form class="w-100%" ref="formRef" :model="formData" :label-width="formConfig.label.width"
    :label-position="formConfig.label.position" :suffix="formConfig.label.suffix" :size="formConfig.size">
    <el-row :gutter="formConfig.layout.gutter">
      <el-col v-for="(item, index) in formItemsSorted" :key="index"
        :span="item.config?.layoutSpan || formConfig.layout.span">
        <el-form-item :label="item.label" :prop="item.prop" :rules="item.rules"
          v-if="item.showOnlyValued ? formData[item.prop] : true">
          <template v-if="item.type === 'date'">
            <el-date-picker v-model="formData[item.prop]" type="date" :placeholder="item.placeholder"
              v-bind="item.attrs" :readonly="disabled || item.attrs?.readonly" :style="{ width: '100%', ...item.style }" />
          </template>
          <template v-else-if="item.type === 'daterange'">
            <el-date-picker v-model="formData[item.prop]" type="daterange"
              :range-separator="item.config?.separator || '-'"
              :start-placeholder="item.config?.startPlaceholder || '开始日期'"
              :end-placeholder="item.config?.endPlaceholder || '结束日期'" :shortcuts="item.config?.shortcuts"
              v-bind="item.attrs" :readonly="disabled || item.attrs?.readonly" :style="{ width: '100%', ...item.style }" />
          </template>
          <template v-else-if="item.type === 'datetime'">
            <el-date-picker v-model="formData[item.prop]" type="datetime" :placeholder="item.placeholder"
              v-bind="item.attrs" :readonly="disabled || item.attrs?.readonly" :style="{ width: '100%', ...item.style }" />
          </template>
          <template v-else-if="item.type === 'datetimerange'">
            <el-date-picker v-model="formData[item.prop]" type="datetimerange"
              :range-separator="item.config?.separator || '-'"
              :start-placeholder="item.config?.startPlaceholder || '开始时间'"
              :end-placeholder="item.config?.endPlaceholder || '结束时间'" :shortcuts="item.config?.shortcuts"
              v-bind="item.attrs" :readonly="disabled || item.attrs?.readonly" :style="{ width: '100%', ...item.style }" />
          </template>
          <template v-else-if="item.type === 'select'">
            <el-select v-model="formData[item.prop]" :placeholder="item.placeholder" v-bind="item.attrs"
              :readonly="disabled || item.attrs?.readonly" :style="{ width: '100%', ...item.style }">
              <el-option v-for="opt in item.options" :key="opt.value" :label="opt.label" :value="opt.value"
                :disabled="opt.disabled" />
            </el-select>
          </template>
          <template v-else-if="item.type === 'multiple-select'">
            <el-select v-model="formData[item.prop]" :placeholder="item.placeholder" multiple collapse-tags
              collapse-tags-tooltip :max-collapse-tags="item.config?.maxCollapseTags || 2" v-bind="item.attrs"
              :readonly="disabled || item.attrs?.readonly" :style="{ width: '100%', ...item.style }">
              <el-option v-for="opt in item.options" :key="opt.value" :label="opt.label" :value="opt.value"
                :disabled="opt.disabled" />
            </el-select>
          </template>
          <template v-else-if="item.type === 'number'">
            <el-input-number v-model="formData[item.prop]" :placeholder="item.placeholder" v-bind="item.attrs"
              :readonly="disabled || item.attrs?.readonly" :style="{ width: '100%', ...item.style }" />
          </template>
          <template v-else-if="item.type === 'textarea'">
            <el-input v-model="formData[item.prop]" type="textarea" :placeholder="item.placeholder" v-bind="item.attrs"
              :readonly="disabled || item.attrs?.readonly" :style="{ width: '100%', ...item.style }" />
          </template>
          <template v-else-if="item.type === 'radio'">
            <el-radio-group v-model="formData[item.prop]" :placeholder="item.placeholder" v-bind="item.attrs"
              :readonly="disabled || item.attrs?.readonly" :style="{ width: '100%', ...item.style }">
              <el-radio v-for="opt in item.options" :key="opt.value" :label="opt.label" :value="opt.value"
                :disabled="opt.disabled"></el-radio>
            </el-radio-group>
          </template>
          <template v-else-if="item.type === 'checkbox'">
            <el-checkbox-group v-model="formData[item.prop]" :placeholder="item.placeholder" v-bind="item.attrs"
              :readonly="disabled || item.attrs?.readonly" :style="{ width: '100%', ...item.style }">
              <el-checkbox v-for="opt in item.options" :key="opt.value" :label="opt.label" :value="opt.value"
                :disabled="opt.disabled"></el-checkbox>
            </el-checkbox-group>
          </template>
          <template v-else-if="item.type === 'file'">
            <el-upload :show-file-list="false" drag
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" v-bind="item.attrs"
              :disabled="disabled" :style="{ width: '100%', ...item.style }"
              :on-success="(res, file, FileList) => handleSuccess(res, file, FileList, item)"
              :before-upload="file => beforeUpload(file, item)">
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                拖拽文件到这里或者<em>点击上传</em>
              </div>
              <template v-if="item.slots?.tip" #tip>
                <div class="el-upload__tip">{{ item.slots.tip }}</div>
              </template>
            </el-upload>
          </template>
          <template v-else-if="item.type === 'custom'">
            <slot :name="item.prop" :prop="item.prop"></slot>
          </template>
          <template v-else-if="item.modify">
            <el-input v-model.[item.modify]="formData[item.prop]" :placeholder="item.placeholder" v-bind="item.attrs"
              :readonly="disabled || item.attrs?.readonly" :style="{ width: '100%', ...item.style }" />
          </template>
          <template v-else>
            <el-input v-model="formData[item.prop]" :placeholder="item.placeholder" v-bind="item.attrs"
              :readonly="disabled || item.attrs?.readonly" :style="{ width: '100%', ...item.style }" />
          </template>
        </el-form-item>
      </el-col>
      <el-col v-if="showConfirmButton || showResetButton || formConfig.showBack" :span="formConfig.layout.span">
        <el-form-item label-width="0">
          <el-button v-if="showConfirmButton && !disabled" type="primary" @click="onSubmit(formRef)">{{
            confirmButtonText
            }}</el-button>
          <el-button v-if="showResetButton && !disabled" @click="onReset">{{ resetButtonText }}</el-button>
          <template v-if="formConfig.showBack">
            <el-button @click="onBack">返回</el-button>
          </template>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
const props = defineProps({
  /**
   * @param {Object} formData 表单数据
   * @param {any} prop 表单项
   */
  formData: Object,
  /**
   * @param {Object} label 标签配置
   * @param {string} label.width 标签宽度
   * @param {string} label.position 标签位置
   * @param {string} label.suffix 标签后缀
   * @param {Object} layout 布局配置
   * @param {string} layout.gutter 栅格间距
   * @param {string} layout.span 栅格宽度
   * @param {boolean} useSearchForm 是否使用搜索表单布局
   * @param {boolean} submitOnReset 重置时是否提交表单
   * @param {boolean} showBack 是否显示返回按钮
   */
  formConfig: Object,
  /**
   * @param {number} sortnum 排序
   * @param {string} label 标签
   * @param {string} prop 属性
   * @param {string} placeholder 占位符
   * @param {string} type 类型 - 默认 input
   * @param {Array<{label: string, value: any}>} options 选项
   * @param {Object} attrs 穿透属性
   * @param {Object} style 自定义样式
   * @param {Array<RuleForm>} rules 校验规则
   * @param {boolean} required 是否必填
   * @param {string} message 提示信息
   * @param {string} trigger 触发条件 blur|click
   * @param {string} type 数据类型 date|array|...
   * @param {Function} validator 自定义校验函数
   */
  formItems: Array,
  disabled: {
    type: Boolean,
    default: false
  },
  showResetButton: {
    type: Boolean,
    default: true
  },
  resetButtonText: {
    type: String,
    default: '重置'
  },
  showConfirmButton: {
    type: Boolean,
    default: true
  },
  confirmButtonText: {
    type: String,
    default: '提交'
  }
})
const emit = defineEmits(['reset', 'submit', 'back'])

const router = useRouter()
/**
 * 预设两种布局
 * 1. 垂直布局，详情表单场景 - 默认
 * 2. 水平布局，表格搜索场景
 */
const dataFormLayoutPreset = {
  gutter: 12,
  span: 16
}
const searchFormLayoutPresets = {
  '2': {
    gutter: 12,
    span: 12
  },
  '3': {
    gutter: 12,
    span: 8
  },
  '4': {
    gutter: 12,
    span: 6
  }
}
const columns = props.formConfig.columns || 4
const formConfig = Object.assign(
  {
    size: 'large',
    label: {
      // width: 'auto', // 控制台警告
      width: '80px',
      position: 'left',
      suffix: ''
    },
    layout: props.formConfig.useSearchForm ? searchFormLayoutPresets[columns] : dataFormLayoutPreset,
    submitOnReset: false,
    showBack: false
  },
  props.formConfig
)

const formRef = ref(null)

const formItemsSorted = computed(() => {
  return props.formItems
    .map((v, i) => ({ sortnum: (i + 1) * 10, ...v }))
    .sort((a, b) => a.sortnum - b.sortnum)
})

const handleSuccess = (
  response,
  uploadFile,
  fileList,
  item
) => {
  // TODO: 处理上传成功后的逻辑
  const url = URL.createObjectURL(uploadFile.raw)
  props.formData[item.prop] = url
  emit('upload-success', response, uploadFile, fileList, item)
}

const beforeUpload = (rawFile, item) => {
  emit('before-upload', rawFile, item)
  // const types = item.attrs?.accept.split(',')
  // console.log('types: ', types);
  const maxSize = item.attrs?.maxSize || 10
  // if (rawFile.type !== 'image/jpeg') {
  //   ElMessage.error('Avatar picture must be JPG format!')
  //   return false
  // } else 
  if (rawFile.size / 1024 / 1024 > maxSize) {
    ElMessage.error(`上传的文件大小不能超过 ${maxSize}M!`)
    return false
  }
  return true
}

const onSubmit = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      emit('submit')
    }
  })
}
const onReset = () => {
  formRef.value.resetFields()
  if (formConfig.submitOnReset) {
    onSubmit(formRef.value)
  }
  emit('reset')
}
const onBack = () => {
  router.back()
  emit('back')
}
</script>

<style lang="scss" scoped></style>