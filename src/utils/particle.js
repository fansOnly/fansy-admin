class Particle {
  constructor(x, y, maxSpeed = 1) {
    this.x = x
    this.y = y
    this.speedX = this._getRandomRange(-maxSpeed, maxSpeed)
    this.speedY = this._getRandomRange(-maxSpeed, maxSpeed)
  }

  draw(ctx, radius) {
    ctx.moveTo(this.x, this.y)
    ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI)
  }

  updateCoordinate(x, y) {
    this.x = x
    this.y = y
    return this
  }

  _getRandomRange(min, max) {
    return Math.random() * (max - min) + min
  }
}

export default class CanvasParticle {
  constructor(canvas, options = {}) {
    this.options = {
      color: 'rgba(24, 144, 255, 1)', // 粒子颜色
      lineColor: '#fff', // 连线颜色
      radius: 1, // 粒子半径
      particleCount: 80, // 粒子数量
      maxSpeed: 0.5, // 粒子最大移动速度
      minDistance: 100, // 粒子之间连线的最小距离
      collideDetect: true, // 是否开启边界碰撞检测
      hasInteractMouse: false, // 是否开启鼠标交互
      density: 80, // 粒子密度
      clearOffset: 0.4, // 清除偏移量
      ...options
    }

    this.canvas = canvas
    this.width = options.width || document.documentElement.clientWidth || document.body.clientWidth
    this.height =
      options.height || document.documentElement.clientHeight || document.body.clientHeight

    this.radius = this.options.radius
    this.particleCount = this.options.particleCount
    this.minDistance = this.options.minDistance
    this.collideDetect = this.options.collideDetect
    this.hasInteractMouse = this.options.hasInteractMouse

    this.particles = []
    this.mouseOffset = null
    this.ctx = null
  }

  init() {
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.ctx = this.canvas.getContext('2d')

    this.createParticles()
    this.draw()
    if (this.options.hasInteractMouse) {
      this.handleCanvasEvent()
    }
  }

  createParticles() {
    for (let index = 0; index < this.particleCount; index++) {
      this.particles.push(
        new Particle(
          this._getRandomRange(0, this.width),
          this._getRandomRange(0, this.height),
          this.options.maxSpeed
        )
      )
    }
  }

  draw() {
    this.canvas.width = this.width
    this.drawParticles()
    this.ctx.lineWidth = 0.1
    this.drawLines()

    requestAnimationFrame(this.draw.bind(this))
  }

  drawParticles() {
    this.ctx.fillStyle = this.options.color
    this.ctx.beginPath()
    for (let index = 0; index < this.particles.length; index++) {
      const particle = this.particles[index]

      particle.draw(this.ctx, this.radius)

      if (!this.collideDetect) {
        if (
          particle.x > this.width ||
          particle.x < 0 ||
          particle.y > this.height ||
          particle.y < 0
        ) {
          const diameter = this.radius * 2
          particle.updateCoordinate(
            this._getRandomRange(diameter, this.width - diameter),
            this._getRandomRange(diameter, this.height - diameter)
          )
        }
      } else {
        this._handleCollide(particle)
      }

      particle.x += particle.speedX
      particle.y += particle.speedY
    }
    this.ctx.fill()
  }

  drawLines() {
    this.ctx.strokeStyle = this.options.lineColor
    this.ctx.beginPath()
    let arr = [...this.particles]
    this.mouseOffset && (arr = [this.mouseOffset].concat(arr))
    for (let index = 0; index < this.particles.length; index++) {
      const particle = this.particles[index]

      for (let j = arr.length - 1; j >= 0; j--) {
        const particle2 = arr[j]
        if (particle === particle2) {
          continue
        }
        const distance = this._calDistance(particle.x, particle2.x, particle.y, particle2.y)
        if (distance < this.minDistance) {
          if (particle2 === this.mouseOffset && distance > this.minDistance - 10) {
            const xc = particle.x - particle2.x
            const yc = particle.y - particle2.y
            particle.x -= xc * 0.03
            particle.y -= yc * 0.03
          }
          this.ctx.moveTo(particle.x, particle.y)
          this.ctx.lineTo(particle2.x, particle2.y)
        }
      }

      arr.splice(arr.indexOf(particle), 1)
    }

    this.ctx.stroke()
  }

  handleCanvasEvent() {
    this.canvas.addEventListener('mousemove', (e) => {
      this.mouseOffset = {
        x: e.offsetX,
        y: e.offsetY
      }
    })

    this.canvas.addEventListener('mouseout', () => {
      this.mouseOffset = null
    })
  }

  _handleCollide(particle) {
    if (
      (particle.speedX && particle.x + this.radius > this.width) ||
      (particle.speedX < 0 && particle.x < this.radius)
    ) {
      particle.speedX *= -1
    }
    if (
      (particle.speedY > 0 && particle.y + this.radius >= this.height) ||
      (particle.speedY < 0 && particle.y <= this.radius)
    ) {
      particle.speedY *= -1
    }
  }

  _calDistance(x1, x2, y1, y2) {
    return Math.hypot(x1 - x2, y1 - y2)
  }

  _getRandomRange(min, max) {
    return Math.random() * (max - min) + min
  }
}
