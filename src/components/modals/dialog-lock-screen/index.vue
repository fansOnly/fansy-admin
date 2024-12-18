<template>
  <fansy-dialog v-model="show" title="锁定屏幕" width="500">
    <div class="flex-[center,,column] mt-20px">
      <el-avatar :size="70" :src="userStore.userInfo.avatar" class="mb-20px">
        <el-image :src="userStore.defaultAvatar" fit="contain" alt="user" />
      </el-avatar>
      <div class="mb-20px">{{ userStore.userInfo.nickname }}</div>
      <el-form ref="lockFormRef" :model="lockForm" :rules="rules" label-width="0" class="w-300px">
        <el-form-item label="" prop="password">
          <el-input v-model="lockForm.password" type="password" show-password autocomplete="off"
            @keyup.enter="submitForm(lockFormRef)" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="w-full" @click="submitForm(lockFormRef)">锁定屏幕</el-button>
        </el-form-item>
      </el-form>
    </div>
  </fansy-dialog>
</template>

<script setup>
import { useUserStore } from '@/store/user';
import { useGlobalStore } from '@/store/app';
const userStore = useUserStore();
const globalStore = useGlobalStore();

const show = defineModel('show')
const emit = defineEmits(['cancel', 'confirm'])

const lockFormRef = ref(null);
const lockForm = reactive({
  password: ''
});
const rules = {
  password: [
    { required: true, message: '请输入锁屏密码', trigger: 'blur' }
  ]
}

const submitForm = (formEle) => {
  if (!formEle) return
  formEle.validate(async (valid) => {
    if (valid) {
      try {
        globalStore.lockScreen.lock = true
        globalStore.lockScreen.password = lockForm.password
      } catch (error) {
      }
    }
  })
}

</script>

<style lang="scss" scoped>
.icon-list {
  grid-template-columns: repeat(5, 20%);
  height: 300px;
  overflow-y: auto;
}

.icon-item {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);

  &:hover,
  &.is-active {
    border-color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
  }
}
</style>