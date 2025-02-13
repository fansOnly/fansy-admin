<template>
  <fansy-dialog v-model="show" title="修改密码" width="600">
    <change-password class="mt-16px" @loading="onLoading" @success="onSuccess" />
  </fansy-dialog>
</template>

<script setup>
import ChangePassword from '@/components/change-password/index.vue'
import { useLoading } from '@/hooks/use-loading'

const show = defineModel('show')
const { showLoading, hideLoading } = useLoading()

function onLoading(val) {
  if (val) {
    showLoading()
  } else {
    hideLoading()
  }
}

function onSuccess() {
  show.value = false
}
</script>