<template>
  <div class="puzzle-verify" :style="{ width: props.width + 32 + 'px' }">
    <div class="puzzle-verify-box">
      <div class="puzzle-buttons">
        <div class="puzzle-button" :style="{ color }" @click="onReset()">
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24">
            <path
              d="M983.480349 307.199781A512.950491 512.950491 0 0 0 513.318399 0a512.365348 512.365348 0 0 0-410.843135 205.531282 42.422827 42.422827 0 0 0 67.80338 50.687964 427.66598 427.66598 0 0 1 343.039755-171.666164 428.251123 428.251123 0 0 1 392.557434 256.438674 42.422827 42.422827 0 0 0 77.604516-33.865118zM34.379313 332.799762A334.55519 334.55519 0 0 0 0.002194 469.869379a42.276541 42.276541 0 0 0 84.699368 0.877713 251.611249 251.611249 0 0 1 24.795411-99.035358A42.422827 42.422827 0 0 0 34.379313 332.799762z m10.166849 387.144867A512.950491 512.950491 0 0 0 513.318399 1023.999269a512.365348 512.365348 0 0 0 410.404278-204.872997 42.422827 42.422827 0 0 0-67.730237-50.761107 427.66598 427.66598 0 0 1-342.674041 171.081021 428.251123 428.251123 0 0 1-391.387149-253.805533 42.422827 42.422827 0 0 0-77.385088 34.377118z m948.954751-24.575983c21.284556-43.885683 30.866264-89.96565 30.50055-142.628469a42.276541 42.276541 0 0 0-84.699368 0.731428c0.292571 40.009114-6.582852 73.362233-21.942842 105.033067a42.422827 42.422827 0 0 0 76.214803 36.937117z"
              fill="currentColor" p-id="7603"></path>
            <path
              d="M776.632497 276.333517A44.982825 44.982825 0 0 0 731.430243 321.096914c0 24.649125 20.260557 44.690254 45.202254 44.690253h177.005588A69.924521 69.924521 0 0 0 1024.001463 296.22836V117.759916a44.982825 44.982825 0 0 0-45.202254-44.617111 44.982825 44.982825 0 0 0-45.275396 44.617111v158.573601h-156.891316zM247.37116 747.665752A44.982825 44.982825 0 0 0 292.573414 702.902355 44.982825 44.982825 0 0 0 247.37116 658.285244H70.365573A69.924521 69.924521 0 0 0 0.002194 727.770909v178.468444c0 24.575982 20.260557 44.617111 45.202254 44.617111a44.982825 44.982825 0 0 0 45.275396-44.617111v-158.573601h156.891316z"
              fill="currentColor" p-id="7604"></path>
          </svg>
        </div>
      </div>
      <div v-show="loading" class="puzzle-loading-mask">
        <svg class="puzzle-loading-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          width="24" height="24">
          <path
            d="M512 74.666667c-17.066667 0-32 14.933333-32 32v149.333333c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V106.666667c0-17.066667-14.933333-32-32-32zM693.333333 362.666667c8.533333 0 17.066667-2.133333 23.466667-8.533334l104.533333-104.533333c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0l-104.533333 104.533333c-12.8 12.8-12.8 32 0 44.8 4.266667 6.4 12.8 8.533333 21.333333 8.533334zM917.333333 480h-149.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h149.333333c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32zM714.666667 669.866667c-12.8-12.8-32-12.8-44.8 0s-12.8 32 0 44.8l104.533333 104.533333c6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466666-8.533333c12.8-12.8 12.8-32 0-44.8l-106.666666-104.533333zM512 736c-17.066667 0-32 14.933333-32 32v149.333333c0 17.066667 14.933333 32 32 32s32-14.933333 32-32v-149.333333c0-17.066667-14.933333-32-32-32zM309.333333 669.866667l-104.533333 104.533333c-12.8 12.8-12.8 32 0 44.8 6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466666-8.533333l104.533334-104.533333c12.8-12.8 12.8-32 0-44.8s-36.266667-12.8-46.933334 0zM288 512c0-17.066667-14.933333-32-32-32H106.666667c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h149.333333c17.066667 0 32-14.933333 32-32zM247.466667 202.666667c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l104.533333 104.533333c6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466666-8.533333c12.8-12.8 12.8-32 0-44.8l-106.666666-104.533333z"
            fill="#717171" p-id="3216"></path>
        </svg>
        <div class="puzzle-loading-text">{{ loadingText }}</div>
      </div>
      <img v-show="verifyStatus == 1" :src="src" class="puzzle-success-img" alt="">
      <canvas ref="imgCanvasRef"></canvas>
      <canvas ref="patchCanvasRef" class="patch-canvas" :style="{ left: (position - matchX) + 'px' }"></canvas>
      <div class="puzzle-verify-state" :class="{ 'is-fail': verifyStatus === 2, 'is-hide': verifyStatus === 0 }">{{
        verifyStatus === 1 ? successText : failText }}</div>
    </div>
    <div v-if="initialized" class="puzzle-slider-bar">
      {{ sliderText }}
      <div class="slider-bar-process" :style="{ width: (position / props.width * 100) + '%', background: color }"></div>
      <div class="slider-bar-block" :style="{ left: position + 'px', color }" @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave" @mousedown="onMouseDown">
        <svg v-if="moving" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30">
          <path
            d="M170.666667 128a42.666667 42.666667 0 0 0-42.666667 42.666667v682.666666a42.666667 42.666667 0 0 0 42.666667 42.666667h682.666666a42.666667 42.666667 0 0 0 42.666667-42.666667V170.666667a42.666667 42.666667 0 0 0-42.666667-42.666667H170.666667z m256 213.333333v128h170.666666V341.333333l170.666667 170.666667-170.666667 170.666667v-128h-170.666666v128l-170.666667-170.666667 170.666667-170.666667z"
            fill="currentColor" p-id="5781"></path>
        </svg>
        <svg v-else viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24">
          <path
            d="M128.7 128.7m63.7 0l0 0q63.7 0 63.7 63.7l0 639.55q0 63.7-63.7 63.7l0 0q-63.7 0-63.7-63.7l0-639.55q0-63.7 63.7-63.7Z"
            fill="currentColor" p-id="12434"></path>
          <path
            d="M768.5 128.7m63.7 0l0 0q63.7 0 63.7 63.7l0 639.55q0 63.7-63.7 63.7l0 0q-63.7 0-63.7-63.7l0-639.55q0-63.7 63.7-63.7Z"
            fill="currentColor" p-id="12435"></path>
          <path
            d="M448.6 128.7m63.7 0l0 0q63.7 0 63.7 63.7l0 639.55q0 63.7-63.7 63.7l0 0q-63.7 0-63.7-63.7l0-639.55q0-63.7 63.7-63.7Z"
            fill="currentColor" p-id="12436"></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  width: String | Number,
  height: String | Number,
  imgs: Array, // 图片数组
  color: {
    // 主题颜色
    type: String,
    default: '#4cd4e4'
  },
  patchFillStyle: {
    // 补丁填充颜色
    type: String,
    default: 'rgba(255,255,255, 0.7)'
  },
  patchStrokeStyle: {
    // 补丁边框颜色
    type: String,
    default: 'rgba(255,255,255, 0.7)'
  },
  range: {
    // 验证误差范围
    type: Number,
    default: 2
  },
  loadingText: {
    type: String,
    default: '加载中...'
  },
  sliderText: {
    type: String,
    default: '拖动滑块完成拼图'
  },
  successText: {
    type: String,
    default: '验证成功'
  },
  failText: {
    type: String,
    default: '验证失败'
  }
})
const emit = defineEmits(['success', 'fail', 'reset'])

const imgCanvasRef = ref(null)
const patchCanvasRef = ref(null)
const loading = ref(false)
const initialized = ref(false)
const hovering = ref(false)
const moving = ref(false)
const position = ref(0)
const startX = ref(0)
const matchX = ref(9999)
const verifyStatus = ref(0)
const src = ref('')
let count = 1 // 重试次数
let touchStartTime = 0 // 触摸开始时间
const buffer = 20 // 缓冲区

let timer = null
const l = 40
const r = 10
const PI = Math.PI
const L = l + r * 2 + 3 // 滑块实际边长

const loadImage = () => {
  return new Promise((resolve) => {
    const img = new Image()
    let url = 'https://picsum.photos/400/300?random=' + Math.random()
    if (props.imgs?.length) {
      url = props.imgs[Math.floor(Math.random() * props.imgs.length)]
    }
    src.value = img.src = url
    img.onload = () => {
      loading.value = false
      resolve(img)
    }
    img.onerror = () => {
      console.error('图片加载失败', count)
      if (count++ <= 3) {
        loadImage(url)
      } else {
        loading.value = false
        resolve(null)
      }
    }
  })
}

const drawPath = (ctx, x = 0, y = 0, operation) => {
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI)
  ctx.lineTo(x + l, y)
  ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI)
  ctx.lineTo(x + l, y + l)
  ctx.lineTo(x, y + l)
  ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true)
  ctx.lineTo(x, y)
  ctx.lineWidth = 2
  ctx.fillStyle = props.patchFillStyle
  ctx.strokeStyle = props.patchStrokeStyle
  ctx.stroke()
  ctx.globalCompositeOperation = 'destination-over'
  if (operation === 'fill') {
    ctx.fill()
  } else if (operation === 'clip') {
    ctx.save()
    ctx.clip()
  }
}

const clearCanvas = (ctx) => {
  ctx.clearRect(0, 0, props.width, props.height)
}

const draw = async () => {
  loading.value = true
  const imgCtx = imgCanvasRef.value.getContext('2d')
  const patchCtx = patchCanvasRef.value.getContext('2d')

  // 随机生成图片
  const img = await loadImage()
  if (!img) return
  initialized.value = true

  clearCanvas(imgCtx)
  clearCanvas(patchCtx)

  const x = getRandom(L + buffer, props.width - (L + buffer))
  const y = getRandom(buffer + r * 2, props.height - (L + buffer))
  drawPath(imgCtx, x, y, 'fill')
  drawPath(patchCtx, x, y, 'clip') // 画入图片
  imgCtx.drawImage(img, 0, 0, props.width, props.height)
  patchCtx.drawImage(img, 0, 0, props.width, props.height)
  patchCtx.restore()
  matchX.value = x
}

const getRandom = (start, end) => {
  return Math.round(Math.random() * (end - start) + start)
}

const onMouseEnter = () => {
  hovering.value = true
}

const onMouseDown = (event) => {
  if (!hovering.value || loading.value) return
  event.preventDefault()
  touchStartTime = +new Date()
  moving.value = true
  startX.value = event.clientX
  window.addEventListener('mousemove', onMoving)
  window.addEventListener('mouseup', onMoveEnd)
}

const onMoving = (event) => {
  if (verifyStatus.value === 2) {
    verifyStatus.value = 0
    clearTimer()
  }
  const diff = event.clientX - startX.value
  const newPosition = Math.max(0, Math.min(props.width - 50, diff))
  position.value = newPosition
}

const onMoveEnd = (event) => {
  if (moving.value) {
    event.preventDefault()
    hovering.value = false
    moving.value = false
    startX.value = 0
    if (
      position.value >= matchX.value - props.range &&
      position.value <= matchX.value + props.range
    ) {
      emit('success', +new Date() - touchStartTime)
      verifyStatus.value = 1
      timer = setTimeout(() => {
        position.value = 0
        verifyStatus.value = 0
        clearTimer()
      }, 1000)
    } else {
      emit('fail')
      verifyStatus.value = 2
      position.value = 0
      timer = setTimeout(() => {
        verifyStatus.value = 0
        clearTimer()
      }, 1000)
    }
  }

  window.removeEventListener('mousemove', onMoving)
  window.removeEventListener('mouseup', onMoveEnd)
}

const clearTimer = () => {
  clearTimeout(timer)
  timer = null
}

const onMouseLeave = () => {
  hovering.value = false
}

const onReset = () => {
  if (loading.value) return
  emit('reset')
  verifyStatus.value = 0
  clearTimer()
  draw()
}

onMounted(() => {
  imgCanvasRef.value.width = props.width
  imgCanvasRef.value.height = props.height
  patchCanvasRef.value.width = props.width
  patchCanvasRef.value.height = props.height
  draw()
})

defineExpose({
  onReset
})
</script>

<style lang="scss" scoped>
.puzzle-verify {
  padding: 16px;
  border-radius: 4px;
  background: #fff;
  overflow: hidden;
}

canvas,
svg {
  vertical-align: top;
}

.puzzle-verify-box {
  position: relative;
  overflow: hidden;
}

.puzzle-buttons {
  display: flex;
  align-items: center;
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 4;
}

.puzzle-button {
  margin-left: 12px;
  cursor: pointer;
}

.puzzle-loading-icon {
  animation: rotate 1.5s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.puzzle-loading-mask {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  z-index: 6;
  pointer-events: none;
}

.puzzle-loading-text {
  margin-top: 4px;
  font-size: 12px;
  color: #717171;
}

.puzzle-success-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 9;
}

.patch-canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.puzzle-verify-state {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  color: #fff;
  line-height: 30px;
  text-align: center;
  background: rgba(54, 248, 54, 0.6);
  user-select: none;
  z-index: 10;
  transition: all 0.2s ease;

  &.is-hide {
    opacity: 0;
  }

  &.is-fail {
    background: rgba(243, 97, 97, 0.6);
  }
}

.puzzle-slider-bar {
  position: relative;
  width: 100%;
  height: 50px;
  margin-top: 12px;
  background: #eaeaea;
  border-radius: 4px;
  text-align: center;
  line-height: 50px;
  user-select: none;
}

.slider-bar-process {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  opacity: 0.8;
}

.slider-bar-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 50px;
  background: #fff;
  box-shadow: 0 0px 3px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  cursor: pointer;

  &:active {
    cursor: move;
  }
}
</style>