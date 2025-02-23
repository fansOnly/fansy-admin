<template>
  <div class="login-page">
    <canvas id="login-canvas-bg" class="login-bg"></canvas>
    <div class="login-left">
      <div class="login-title">
        <h1>Fansy Admin</h1>
        <p>科技创新 · 智慧管理</p>
      </div>
    </div>
    <div class="login-right">
      <div class="login-form-wrapper">
        <div class="login-header">
          <div class="logo flex-[center,center]">
            <el-icon size="50px">
              <Avatar />
            </el-icon>
          </div>
          <h2>欢迎登录</h2>
        </div>
        <div class="login-form">
          <el-form ref="loginFormRef" :model="loginForm" :rules="rules" label-width="0" size="large">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" placeholder="请输入用户名" :prefix-icon="User"
                @keyup.enter="submitForm(loginFormRef)" />
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password
                :prefix-icon="Lock" autocomplete="off" @keyup.enter="submitForm(loginFormRef)" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="w-full" :loading="loading" @click="submitForm(loginFormRef)">
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { login } from '@/api/core/login'
import { md5Encrypt } from '@/common/security/md5'
import { useMessage } from '@/hooks/use-message'
import { User, Lock } from '@element-plus/icons-vue'
import Storage from '@/common/storage'
import { onMounted } from 'vue'
import CanvasParticle from '@/utils/particle'

const router = useRouter()
const route = useRoute()
const redirectedFrom = route.redirectedFrom
const { showMessage } = useMessage()

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
          Storage.setLocalItem('token', data.accessToken)
          Storage.setLocalItem('refresh-token', data.refreshToken)
          const lastUsername = Storage.getSessionItem('login-username')
          if (lastUsername !== loginForm.username) {
            Storage.clearSession('nav-bar')
            Storage.setSessionItem('login-username', loginForm.username)
          }
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

onMounted(() => {
  const canvas = document.getElementById('login-canvas-bg')
  const particle = new CanvasParticle(canvas, {})
  particle.init()
})
</script>

<style lang="scss" scoped>
.login-page {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  overflow: hidden;
}

.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
}

.login-left {
  flex: 1;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../../assets/images/bg.jpeg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;

  .login-title {
    position: relative;
    color: #fff;
    text-align: center;
    z-index: 1;

    h1 {
      font-size: 36px;
      margin-bottom: 10px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    p {
      font-size: 16px;
      opacity: 0.9;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    }
  }
}

.login-right {
  min-width: 600px;
  width: 35%;
  background: var(--el-fill-color-blank);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form-wrapper {
  min-width: 400px;
  width: 70%;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;

  .logo {
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
    background-color: var(--el-fill-color-dark);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    color: var(--el-color-primary);
  }

  h2 {
    font-size: 24px;
    color: var(--el-color-primary);
    margin: 0;
  }
}

.login-form {
  :deep(.el-input__wrapper) {
    background-color: var(--el-fill-color-dark);
    box-shadow: none;
    border: 1px solid transparent;

    &:hover,
    &.is-focus {
      border-color: var(--el-color-primary);
      box-shadow: 0 0 0 1px var(--el-color-primary);
    }
  }

  .el-button--primary {
    height: 44px;
    font-size: 16px;
    background: var(--el-color-primary);
    border: none;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
      background: var(--el-color-primary-light-3);
    }
  }
}
</style>
