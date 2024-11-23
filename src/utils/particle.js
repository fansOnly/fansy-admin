class Particle {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.speedX = this._getRandomRange(-1, 1)
    this.speedY = this._getRandomRange(-1, 1)
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
    this.canvas = canvas // 画布对象
    this.width = options.width || document.documentElement.clientWidth || document.body.clientWidth
    this.height =
      options.height || document.documentElement.clientHeight || document.body.clientHeight
    this.radius = options.radius || 3 // 粒子半径
    this.particleCount = options.particleCount || 200 // 粒子数量
    this.minDistance = options.minDistance || 100 // 粒子画线的最小距离
    this.collideDetect = options.collideDetect || true // 边界碰撞检测
    this.hasInteractMouse = options.hasInteractMouse || false // 是否有鼠标交互

    this.particles = [] // 粒子集合
    this.mouseOffset = null // 鼠标位置对象
    this.ctx = null // 画布上下文
  }

  init() {
    //设置canvas铺满屏幕
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.ctx = this.canvas.getContext('2d')

    this.createParticles()
    this.draw()
    this.handleCanvasEvent()
  }

  // 创建粒子对象
  createParticles() {
    for (let index = 0; index < this.particleCount; index++) {
      this.particles.push(
        new Particle(this._getRandomRange(0, this.width), this._getRandomRange(0, this.height))
      )
    }
  }

  draw() {
    // 清空画布
    this.canvas.width = this.width
    this.drawParticles()
    this.ctx.lineWidth = 0.1
    this.drawLines()

    requestAnimationFrame(this.draw.bind(this))
  }

  drawParticles() {
    this.ctx.fillStyle = 'lightyellow'
    this.ctx.beginPath()
    for (let index = 0; index < this.particles.length; index++) {
      const particle = this.particles[index]

      particle.draw(this.ctx)

      // 没有开启边界碰撞检测，越界的粒子,更新位置并保证其新位置不越界
      if (!this.collideDetect) {
        if (
          particle.x > this.width ||
          particle.x < 0 ||
          particle.y > this.height ||
          particle.y < 0
        ) {
          // 粒子直径
          const diameter = this.radius * 2
          particle.updateCoordinate(
            getRandomRange(diameter, this.width - diameter),
            getRandomRange(diameter, this.height - diameter)
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
    this.ctx.strokeStyle = 'blue'
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
          // 如果是鼠标，则让粒子向鼠标的位置移动,距离-10 保证粒子与鼠标之间的最小间距
          if (particle2 === this.mouseOffset && distance > this.minDistance - 10) {
            const xc = particle.x - particle2.x
            const yc = particle.y - particle2.y

            // 0.03 向鼠标坐标移动的速率
            particle.x -= xc * 0.03
            particle.y -= yc * 0.03
          }
          this.ctx.moveTo(particle.x, particle.y)
          this.ctx.lineTo(particle2.x, particle2.y)
        }
      }

      // 去掉重复比较
      arr.splice(arr.indexOf(particle), 1)
    }

    this.ctx.stroke()
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
