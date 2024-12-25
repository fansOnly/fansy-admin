<template>
  <div v-loading="loading" class="m--20px p-20px">

    <el-button @click="recognize('https://tesseract.projectnaptha.com/img/eng_bw.png', 'text1')">识别示例图片1</el-button>
    <div class="flex mt-20px">
      <div class="flex-shrink-0 w-200px mr-20px"><el-image src="https://tesseract.projectnaptha.com/img/eng_bw.png"
          alt="" /></div>
      <p v-html="result.text1"></p>
    </div>
    <el-button class="mt-20px"
      @click="recognize('https://bsddata.oss-cn-hangzhou.aliyuncs.com/virtual_live/images/202412251509109793.png', 'text2')">识别示例图片2</el-button>
    <div class="flex mt-20px">
      <div class="flex-shrink-0 w-200px mr-20px"><el-image
          src="https://bsddata.oss-cn-hangzhou.aliyuncs.com/virtual_live/images/202412251509109793.png" alt="" />
      </div>
      <p v-html="result.text2"></p>
    </div>

    <el-card style="max-width: 480px" class="mt-20px">
      <template #header>
        <div class="card-header">
          <span>单个识别 - 上传图片识别</span>
        </div>
      </template>

      <el-upload drag action="https://yuanmei.metawa.cn:8443/api/common/upload/upload" :on-success="handleSuccess"
        :before-upload="beforeUpload">
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          Drop file here or <em>click to upload</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            jpg/png files with a size less than 500kb
          </div>
        </template>
      </el-upload>
      <div>识别结果: </div>
      <p v-html="result.text"></p>

    </el-card>
    <el-card style="max-width: 6000px" class="mt-20px">
      <template #header>
        <div class="card-header">
          <span>多个识别</span>
        </div>
      </template>
      <el-button
        @click="recognizeMultiple(['https://tesseract.projectnaptha.com/img/eng_bw.png', 'https://bsddata.oss-cn-hangzhou.aliyuncs.com/virtual_live/images/202412251509109793.png'])">批量识别示例图片</el-button>
      <div class="flex mt-20px">
        <div class="flex-1 w-200px"><el-image src="https://tesseract.projectnaptha.com/img/eng_bw.png" alt="" /></div>
        <div class="flex-1 w-200px ml-10px"><el-image
            src="https://bsddata.oss-cn-hangzhou.aliyuncs.com/virtual_live/images/202412251509109793.png" alt="" />
        </div>
      </div>
      <div class="mt-20px">识别结果: </div>
      <div v-for="(item, index) in results" :key="item" class="flex p-12px">
        <span class="flex-shrink-0 mr-8px">{{ index + 1 }}. </span>
        <p v-html="item"></p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import Tesseract, { createWorker } from 'tesseract.js';

const loading = ref(false)
const result = reactive({
  text: '',
  text1: '',
  text2: ''
})
const results = ref([])

const scheduler = Tesseract.createScheduler()
async function workerGen() {
  const worker = await Tesseract.createWorker(['chi_sim', 'eng']);
  scheduler.addWorker(worker);
}

async function recognizeMultiple(images) {
  await workerGen()
  const promises = images.map(image => {
    return new Promise(resolve => {
      scheduler.addJob('recognize', image).then(res => resolve(res))
    })
  })
  try {
    loading.value = true
    const res = await Promise.all(promises)
    results.value = res.map(item => item.data.text)
    await scheduler.terminate();
  } catch (error) {
  } finally {
    {
      loading.value = false
    }
  }
}

async function recognize(image, prop = 'text') {
  try {
    loading.value = true
    const worker = await createWorker(['chi_sim', 'eng']);
    const ret = await worker.recognize(image);
    await worker.terminate();
    console.log('ret: ', ret);
    result[prop] = ret.data.text
  } catch (error) { } finally {
    loading.value = false
  }
}

function handleSuccess(response, uploadFile) {
  if (response?.data?.url) {
    recognize(response.data.url)
  }
}

function beforeUpload(rawFile) {
  if (!['image/jpeg', 'image/png'].includes(rawFile.type)) {
    ElMessage.error('请上传 jpg/png 文件!')
    return false
  }
  else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('文件大小不能超过 2MB!')
    return false
  }
  return true
}

</script>

<style lang="scss" scoped></style>
