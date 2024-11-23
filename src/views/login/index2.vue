<template>
  <div class="login-page">
    <canvas id="login-canvas-bg"></canvas>
  </div>
</template>

<script>
  import CanvasParticle from '@/utils/particle'
  export default {
    components: {},
    data() {
      return {}
    },
    computed: {},
    watch: {},
    async created() {},
    async mounted() {
      const canvas = document.getElementById('login-canvas-bg')
      const particle = new CanvasParticle(canvas, {})
      particle.init()
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>
  .login-page {
    background: linear-gradient(180deg, skyblue, aqua, #a1a1fa);
  }
</style>