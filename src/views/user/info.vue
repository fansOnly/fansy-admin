<template>
  <div v-loading="loading" class="fansy-detail-container flex">
    <div class="w-350px mr-32px">
      <div class="p-16px background-custom-var(--el-fill-color) rounded-6px">
        <div class="flex-[center,center,column] mt-50px">
          <div class="relative">
            <div class="absolute right-4px bottom--4px">
              <upload-file :auto-upload="false" @change="handleFileChange">
                <div
                  class="flex-[center,center] p-4px rounded-full background-custom-var(--el-color-primary) cursor-pointer">
                  <el-icon size="20px" color="#fff">
                    <UploadFilled />
                  </el-icon>
                </div>
              </upload-file>
            </div>
            <el-avatar :size="100" :src="adminInfo.avatar">
              <el-image :src="userStore.defaultAvatar" fit="contain" alt="user" />
            </el-avatar>
          </div>
          <div class="mt-8px">{{ adminInfo.nickname }}</div>
          <div class="mt-8px">{{ adminInfo.roleId }}</div>
        </div>
        <el-divider />
        <div class="flex-[center] mt-8px">
          <el-icon class="mr-8px">
            <Phone />
          </el-icon>
          <div class="flex-1">{{ adminInfo.phone }}</div>
        </div>
        <div class="flex-[center] mt-8px">
          <el-icon class="mr-8px">
            <Phone />
          </el-icon>
          <div class="flex-1">{{ adminInfo.email }}</div>
        </div>
      </div>
    </div>
    <div class="flex-1">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="info">
          <el-form ref="formRef" :model="form" :rules="rules" label-width="90px" label-position="left" class="mt-16px">
            <el-form-item label="用户昵称" prop="nickname">
              <el-input v-model="form.nickname" :maxlength="20" placeholder="请输入昵称" clearable />
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="form.phone" :maxlength="11" placeholder="请输入正确的手机号" clearable />
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入正确的邮箱" clearable />
            </el-form-item>
            <el-form-item class="mt-32px">
              <el-button type="primary" @click="onSubmit(formRef)">提交</el-button>
              <el-button @click="onReset(formRef)">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="修改密码" name="password">
          <change-password class="mt-16px" @loading="onLoading" />
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 裁剪头像 -->
    <dialog-image-cropper v-model:show="visibleAvatarCropper" name="avatar" :src="avatarSrc"
      @confirm="handleCropperAvatar" />
  </div>
</template>

<script setup>
import ChangePassword from '@/components/change-password/index.vue'
import UploadFile from '@/components/upload-file/index.vue'
import DialogImageCropper from '@/components/modals/dialog-image-cropper/index.vue'
import { getAdminDetail, updateAdmin } from '@/api/common/admin'
import { useUserStore } from '@/store/user';
import { isPhone, isEmail } from '@/utils/validate'
import { useMessage } from '@/hooks/use-message'

const userStore = useUserStore();
const { showSuccessMessage, showErrorMessage } = useMessage()

const formRef = ref(null)
const loading = ref(false)
const visibleAvatarCropper = ref(false)
const adminInfo = ref({});
const form = ref({})
const activeName = ref('info')
const avatarSrc = ref('https://images.pexels.com/photos/226746/pexels-photo-226746.jpeg')
const rules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (!isPhone(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      }
    }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (!isEmail(value)) {
          callback(new Error('请输入正确的邮箱'))
        } else {
          callback()
        }
      }
    }
  ]
}

function handleFileChange(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    avatarSrc.value = e.target.result;
    visibleAvatarCropper.value = true;
  };
  reader.readAsDataURL(file.raw);
}

// 裁剪头像
function handleCropperAvatar(file, formData) {
  console.log('handleAvatarSuccess formData: ', formData);
  console.log('handleAvatarSuccess file: ', file);
  // TODO: 上传头像
}

function onSubmit(formEl) {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      updateAdminData()
    }
  })
}

function onReset(formEl) {
  if (!formEl) return
  formEl.resetFields()
}

function onLoading(val) {
  loading.value = val
}

async function getAdminInfo() {
  try {
    loading.value = true
    const res = await getAdminDetail(userStore.userInfo.id)
    adminInfo.value = {
      nickname: res.nickname,
      id: res.id,
      roleId: res.roleId,
      phone: res.phone,
      email: res.email,
      avatar: res.avatar
    }
    form.value = {
      nickname: res.nickname,
      id: res.id,
      phone: res.phone,
      email: res.email,
    }
  } catch (error) { } finally {
    loading.value = false
  }
}

async function updateAdminData() {
  try {
    loading.value = true
    await updateAdmin({
      id: userStore.userInfo.id,
      ...form.value
    })
    adminInfo.value = {
      ...adminInfo.value,
      ...form.value
    }
    userStore.setUserInfo(adminInfo.value)
    showSuccessMessage('修改成功')
  } catch (error) {
    showErrorMessage(error.message)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getAdminInfo()
})
</script>

<style lang="scss" scoped></style>