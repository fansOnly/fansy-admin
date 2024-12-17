<template>
  <div class="login-page">
    <div class="login-wrapper">
      <div class="logo flex-[center,center]">
        <el-icon size="70px" color="#f1cbe2">
          <Avatar />
        </el-icon>
      </div>
      <div class="text-center font-size-30px">hello world!</div>
      <div class="login-form mt-7px">
        <el-form ref="loginFormRef" :model="loginForm" :rules="rules" label-width="0" size="large">
          <el-form-item label="" prop="username">
            <el-input v-model="loginForm.username" type="text" prefix-icon="lock"
              @keyup.enter="submitForm(loginFormRef)" />
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input v-model="loginForm.password" type="password" show-password prefix-icon="key" autocomplete="off"
              @keyup.enter="submitForm(loginFormRef)" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="w-full" :loading="loading" @click="submitForm(loginFormRef)">
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="login-animation">
      <div class="star-animation-150"></div>
      <div class="star-animation-10"></div>
      <div class="star-animation-80"></div>
      <div class="star-animation-50"></div>
    </div>
  </div>
</template>

<script setup>
import { login } from '@/api/core/login'
import { md5Encrypt } from '@/common/security/md5'
import { useMessage } from '@/hooks/use-message'
const { showMessage } = useMessage()
import Storage from '@/common/storage'

const router = useRouter()
const route = useRoute()
const redirectedFrom = route.redirectedFrom

const loginFormRef = ref(null)
const loading = ref(false)
const loginForm = reactive({
  username: 'admin',
  password: '123456'
})

const rules = reactive({
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }]
})

const submitForm = (formEle) => {
  if (!formEle) return
  formEle.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const data = await login({
          username: loginForm.username,
          password: md5Encrypt(loginForm.password)
        })
        if (data) {
          Storage.setItem('token', data.token)
          showMessage('success', '登录成功')
          router.push(redirectedFrom || '/')
        }
      } catch (error) {
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style lang="scss" scoped>
@import url('@/assets/css/login.scss');

.login-page {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: #181828;
}

.login-wrapper {
  position: absolute;
  top: 50%;
  right: 50%;
  width: 300px;
  padding: 0 var(--padding-lg);
  background: var(--bg-white);
  border-radius: var(--border-radius-md);
  transform: translate3d(50%, -50%, 0);

  &::before {
    content: '';
    position: absolute;
    left: 1px;
    top: 1px;
    z-index: -1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    background-color: #e4ecf8;
    box-shadow: 2.5px 2.5px 10px rgba(50, 40, 119, 0.75);
  }
}

.logo {
  width: max-content;
  margin: 30px auto;
  background-color: #f6f9fe;
  border-radius: 100%;
  border: 10px solid #f6f9fe;
  box-shadow: 10px 5px 15px rgba(50, 40, 119, 0.25), -10px -5px 15px #fff;
}

.login-form {
  ::v-deep(.el-input__wrapper) {
    box-shadow: none;
  }
}
</style>
