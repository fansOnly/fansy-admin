const COMMON_TYPE_KEY = 'context-menu'
const NEXT_X_DISTANCE = 200
const NEXT_Y_DISTANCE = 100

class ContextPad {
  constructor({ lf }) {
    this.menuMap = new Map()
    this.lf = lf
    this._dom = document.createElement('div')
    this._dom.className = 'context-pad'
    this.menuMap.set(COMMON_TYPE_KEY, [])
    this.visible = false
  }
  render(lf, container) {
    this.container = container
    lf.on('node:click', ({ data }) => {
      console.log('node: click data: ', data)
      this._data = data
      this.createMenu()
    })
    lf.on('blank:click', () => {
      this.hide()
    })
  }
  show() {
    const [x, y] = this.getPosition()
    this._dom.style.left = `${x + 10}px`
    this._dom.style.top = `${y}px`
    this._dom.style.display = 'block'
    this.container.appendChild(this._dom)
    if (!this.visible) {
      this.lf.on(
        'node:delete,node:dbclick,edge:delete,edge:click,node:dragstart,graph:transform,history:change,anchor:drag',
        this.onHide
      )
    }
    this.visible = true
  }
  hide() {
    this._dom.innerHTML = ''
    this._dom.style.display = 'none'
    if (this.visible) {
      this.container.removeChild(this._dom)
    }
    this.lf.off(
      'node:delete,node:dbclick,edge:delete,edge:click,node:dragstart,graph:transform,history:change,anchor:drag',
      this.onHide
    )
    this.visible = false
  }
  onHide = () => {
    this.hide()
  }
  createMenu() {
    const { isSilentMode } = this.lf.options
    // 静默模式不显示菜单
    if (isSilentMode) {
      return
    }

    // let items = (this.menuMap.get(this._data.type) || []).concat(
    //   this.menuMap.get(COMMON_TYPE_KEY) || []
    // )
    const items = this.menuMap.get(COMMON_TYPE_KEY) || []
    const menus = document.createDocumentFragment()
    items.forEach((item) => {
      const menu = document.createElement('div')
      menu.className = 'context-menu-item'
      if (item.className) {
        menu.classname += ` ${item.className}`
      }
      menu.innerText = item.label
      menu.addEventListener('click', () => {
        // this.hide()
        if (typeof item.callback === 'function') {
          item.callback(this._data, menu)
        } else {
          this.addNode({
            sourceId: this._data.id,
            x: this._data.x,
            y: this._data.y,
            properties: item.properties,
            type: item.type
          })
        }
      })
      menus.appendChild(menu)
    })
    this._dom.innerHTML = ''
    this._dom.appendChild(menus)
    this.show()
  }
  addNode(node, y) {
    const isDeep = y !== undefined
    if (y === undefined) {
      y = node.y
    }
    const nodeModel = this.lf.getNodeModelById(node.sourceId)
    const leftTopX = node.x - 100 + NEXT_X_DISTANCE
    const leftTopY = y - node.y / 2 - 20
    const rightBottomX = node.x + 100 + NEXT_X_DISTANCE
    const rightBottomY = y + node.y / 2 + 20
    const existElements = this.lf.getAreaElement([leftTopX, leftTopY], [rightBottomX, rightBottomY])
    if (existElements.length) {
      y = y + NEXT_Y_DISTANCE
      this.addNode(node, y)
      return
    }
    const newNode = this.lf.addNode({
      type: node.type,
      x: node.x + 200,
      y,
      properties: node.properties
    })
    let startPoint
    let endPoint
    if (isDeep) {
      startPoint = {
        x: node.x,
        y: node.y + nodeModel.height / 2
      }
      endPoint = {
        x: newNode.x - newNode.width / 2,
        y: newNode.y
      }
    }
    this.lf.addEdge({
      sourceNodeId: node.sourceId,
      targetNodeId: newNode.id,
      startPoint,
      endPoint
    })
  }
  setContextMenu(menus) {
    this.menuMap.set(COMMON_TYPE_KEY, menus)
  }
  setMenuByType(type, menus) {
    this.menuMap.set(type, menus)
  }
  getPosition() {
    const data = this._data
    const Model = this.lf.graphModel.getElement(data.id)
    if (!Model) {
      console.warn(`找不到元素${data.id}`)
      return
    }
    let x
    let y
    // if (Model.BaseType === 'edge') {
    //   x = Number.MIN_SAFE_INTEGER
    //   y = Number.MAX_SAFE_INTEGER
    //   const edgeData = Model.getData()
    //   x = Math.max(edgeData.startPoint.x, x)
    //   y = Math.min(edgeData.startPoint.y, y)
    //   x = Math.max(edgeData.endPoint.x, x)
    //   y = Math.min(edgeData.endPoint.y, y)
    //   if (edgeData.pointsList) {
    //     edgeData.pointsList.forEach((point) => {
    //       x = Math.max(point.x, x)
    //       y = Math.min(point.y, y)
    //     })
    //   }
    // }
    if (Model.BaseType === 'node') {
      x = data.x + Model.width / 2
      y = data.y - Model.height / 2
    }
    return this.lf.graphModel.transformModel.CanvasPointToHtmlPoint([x, y])
  }
  /**
   * export
   * @param data 节点id、节点类型、菜单位置
   */
  showContextMenu(data) {
    if (!data || !data.id) {
      console.warn('请检查传入的参数')
      return
    }
    this._data = data
    this.createMenu()
  }
  dispose() {
    // this.lf.off('node:click')
  }
}

ContextPad.pluginName = 'contextPad'

export { ContextPad }
