<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="90px" label-position="left">
    <el-form-item label="当前密码" prop="oldPass">
      <el-input v-model="form.oldPass" :maxlength="20" placeholder="请输入当前密码" type="password" show-password
        autocomplete="off" />
    </el-form-item>
    <el-form-item label="新密码" prop="password">
      <el-input v-model="form.password" :maxlength="20" placeholder="请输入新密码" type="password" show-password
        autocomplete="off" />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input v-model="form.confirmPassword" :maxlength="20" placeholder="请确认新密码" type="password" show-password
        autocomplete="off" />
    </el-form-item>
    <el-form-item class="mt-32px">
      <el-button type="primary" @click="onSubmit(formRef)">提交</el-button>
      <el-button @click="onReset(formRef)">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { md5Encrypt } from '@/common/security/md5'
import { changePassword } from '@/api/core/login'
import { useUserStore } from '@/store/user';
import { useMessage } from '@/hooks/use-message'

const userStore = useUserStore()
const { showSuccessMessage, showErrorMessage } = useMessage()

const emit = defineEmits(['loading', 'success'])

const formRef = ref(null)
const loading = ref(false)
const form = ref({})
const rules = {
  oldPass: [
    { required: true, message: '请输入当前密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }, {
      validator: (rule, value, callback) => {
        if (value === form.value.oldPass) {
          callback(new Error('新密码不能与原密码相同!'))
        } else {
          callback()
        }
      }, trigger: 'blur'
    },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.value.password) {
          callback(new Error('两次输入的密码不一致!'))
        } else {
          callback()
        }
      }, trigger: 'blur'
    },
  ],
}

function onSubmit(formEl) {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      updatePassword()
    }
  })
}

function onReset(formEl) {
  if (!formEl) return
  formEl.resetFields()
}

async function updatePassword() {
  try {
    loading.value = true
    emit('loading', true)
    const res = await changePassword({
      id: userStore.userInfo.id,
      oldPass: md5Encrypt(form.value.oldPass),
      password: md5Encrypt(form.value.password)
    })
    if (res) {
      showSuccessMessage('密码修改成功')
      emit('success')
      // TODO: 重新登陆？
    }
  } catch (error) {
    showErrorMessage(error.message)
  } finally {
    loading.value = false
    emit('loading', false)
  }
}

</script>

<style lang="scss" scoped></style>