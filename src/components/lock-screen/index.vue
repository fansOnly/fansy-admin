<template>
  <div class="flex-[center,center,column] w-100vw h-100vh">
    <template v-if="step === 1">
      <div class="font-size-30px font-500 lin-height-none text-center select-none">{{ date }}</div>
      <div class="flex-[center,center] w-full my-50px px-10 text-center select-none">
        <div class="flex-1 h-500px background-custom-var(--el-bg-color) rounded-8px font-size-240px line-height-500px ">
          {{ hour }}</div>
        <div class="w-80px font-size-100px font-500">:</div>
        <div
          class="flex-1 h-500px background-custom-var(--el-bg-color) rounded-20px font-size-240px line-height-500px ">
          {{ minute }}</div>
      </div>
      <div class="color-custom-var(--el-text-color-secondary) text-center cursor-pointer" @mouseover="iconSize = 45"
        @mouseout="iconSize = 40" @click="onUnlock()">
        <div class="h-50px">
          <svg-icon name="lock" :width="iconSize + 'px'" class="transition-all hover:color-white" />
        </div>
        <div class="mt-6px font-size-18px font-500 select-none">点击解锁</div>
      </div>
    </template>
    <template v-if="step === 2">
      <div class="flex-[center,center,column] h-300px">
        <div class="font-size-30px font-500 lin-height-none text-center select-none">{{ hour }} : {{ minute }}</div>
        <div class="font-size-30px font-500 lin-height-none text-center select-none">{{ date }}</div>
      </div>
      <div class="flex-1 flex-[center,,column]">
        <el-avatar :size="70" :src="userStore.userInfo.avatar" class="mb-20px">
          <el-image :src="userStore.defaultAvatar" fit="contain" alt="user" />
        </el-avatar>
        <el-form ref="unlockFormRef" :model="unlockForm" :rules="rules" label-width="0" class="w-300px">
          <el-form-item label="" prop="password">
            <el-input v-model="unlockForm.password" type="password" show-password autocomplete="off"
              @keyup.enter="submitForm(unlockFormRef)" />
          </el-form-item>
          <el-form-item style="margin-bottom:0;">
            <el-button type="primary" class="w-full" @click="submitForm(unlockFormRef)">进入系统</el-button>
          </el-form-item>
        </el-form>
        <div class="w-full mt-10px"><el-button text class="w-full" size="small" @click="onBackLogin()">返回登录</el-button>
        </div>
        <div class="w-full mt-10px"><el-button text class="w-full" size="small" @click="onBack()">返回</el-button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useDateFormat, useNow, useTimeout } from '@vueuse/core'
import { useUserStore } from '@/store/user';
import { useGlobalStore } from '@/store/app';
const globalStore = useGlobalStore()
const userStore = useUserStore()
const router = useRouter()

const unlockFormRef = ref(null)
const iconSize = ref(40)
const date = useDateFormat(useNow(), 'YYYY-MM-DD dddd')
const hour = useDateFormat(useNow(), 'HH')
const minute = useDateFormat(useNow(), 'mm')
const step = ref(1)
const unlockForm = reactive({
  password: ''
})

const validatePass = (rule, value, callback) => {
  if (value !== globalStore.lockScreen.password) {
    callback(new Error('锁屏密码错误！'))
  }
  callback()
}
const rules = {
  password: [
    { required: true, message: '请输入密码' },
    { validator: validatePass, trigger: 'blur' }
  ]
}

function onUnlock() {
  step.value = 2
}

const submitForm = (formEle) => {
  if (!formEle) return
  formEle.validate(async (valid) => {
    if (valid) {
      try {
        globalStore.lockScreen.lock = false
        globalStore.lockScreen.password = ''
      } catch (error) {
      }
    }
  })
}

function onBackLogin() {
  userStore.logout()
  router.push('/login')
  useTimeout(() => {
    globalStore.lockScreen.lock = false
    globalStore.lockScreen.password = ''
  }, 500)
}

function onBack() {
  step.value = 1
}

</script>

<style lang="scss" scoped></style>