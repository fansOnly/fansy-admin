import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

let messageInstances = []
/**
 * Message 消息提示
 * @param {*} type 'success' | 'warning' | 'info' | 'error'
 */
const showMessage = (type = 'info', message = '', options = {}) => {
  const config = {
    plain: false,
    duration: 1500,
    onCloseFn: null,
    appContext: null
  }
  Object.assign(config, options)

  messageInstances.push(
    ElMessage(
      {
        type,
        message,
        duration: config.duration,
        plain: config.plain,
        onClose: () => {
          typeof config.onCloseFn === 'function' && config.onCloseFn()
        }
      },
      config.appContext
    )
  )
}

const showSuccessMessage = (message = '', options = {}) => {
  showMessage('success', message, options)
}

const showWarningMessage = (message = '', options = {}) => {
  showMessage('warning', message, options)
}

const showInfoMessage = (message = '', options = {}) => {
  showMessage('info', message, options)
}

const showErrorMessage = (message = '', options = {}) => {
  showMessage('error', message, options)
}

const closeMessage = () => {
  if (!messageInstances.length) return
  const current = messageInstances.pop()
  current.close()
}
const closeAllMessage = () => ElMessage.closeAll()

/**
 * MessageBox 消息弹框
 * @param {string} type 'confirm' | 'prompt' | 'alert'
 * @param {object} options
 * @param {string} options.iconType 'success' | 'info' | 'warning' | 'error'
 */
const useMessageBox = (type = 'confirm', message = '', title = '', options = {}) => {
  const config = {
    iconType: 'info',
    icon: '',
    showClose: true,
    lockScroll: true,
    showCancelButton: false,
    cancelButtonText: '取消',
    showConfirmButton: true,
    confirmButtonText: '确定',
    closeOnClickModal: true,
    draggable: false,
    center: false,
    callback: null,
    beforeClose: null,
    appContext: null
  }
  Object.assign(config, options)

  const showCancelButton = ['confirm', 'prompt'].includes(type) ? true : config.showCancelButton
  const closeOnClickModal = type === 'alert' ? false : config.closeOnClickModal
  ElMessageBox[type](
    message,
    title,
    {
      showClose: config.showClose,
      type: config.iconType,
      icon: config.icon,
      lockScroll: config.lockScroll,
      showCancelButton: showCancelButton,
      showConfirmButton: config.showConfirmButton,
      cancelButtonText: config.cancelButtonText,
      confirmButtonText: config.confirmButtonText,
      closeOnClickModal: closeOnClickModal,
      draggable: config.draggable,
      center: config.center,
      callback: (value, action) => {
        typeof config.callback === 'function' && config.callback(value, action)
      },
      beforeClose: (action, instance, done) => {
        typeof config.beforeClose === 'function'
          ? config.beforeClose(action, instance, done)
          : done()
      }
    },
    config.appContext
  )
}

const showConfirmWarningBox = (message = '', title = '', options = {}) => {
  useMessageBox('confirm', message, title, {
    ...options,
    iconType: 'warning'
  })
}

const showConfirmSuccessBox = (message = '', title = '', options = {}) => {
  useMessageBox('confirm', message, title, {
    ...options,
    iconType: 'success'
  })
}

let notificationInstances = []
/**
 * Notification 通知
 * @param {string} type 'success' | 'warning' | 'info' | 'error' | ''
 * @param {Object} options
 * @param {string} options.position 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
 */
const showNotification = (type = '', message = '', title = '', options = {}) => {
  const config = {
    duration: 4500,
    position: 'top-right',
    showClose: true,
    zIndex: 0,
    onCloseFn: null,
    onClickFn: null,
    appContext: null
  }
  Object.assign(config, options)

  notificationInstances.push(
    ElNotification(
      {
        type,
        title,
        message,
        duration: config.duration,
        position: config.position,
        showClose: config.showClose,
        zIndex: config.zIndex,
        onClick: () => {
          typeof config.onClickFn === 'function' && config.onClickFn()
        },
        onClose: () => {
          typeof config.onCloseFn === 'function' && config.onCloseFn()
        }
      },
      config.appContext
    )
  )
}

const showSuccessNotification = (message = '', title = '', options = {}) => {
  showNotification('success', message, title, options)
}
const showWarningNotification = (message = '', title = '', options = {}) => {
  showNotification('warning', message, title, options)
}
const showInfoNotification = (message = '', title = '', options = {}) => {
  showNotification('info', message, title, options)
}
const showErrorNotification = (message = '', title = '', options = {}) => {
  showNotification('error', message, title, options)
}

const closeNotification = () => {
  if (!notificationInstances.length) return
  const current = notificationInstances.pop()
  current.close()
}
const closeAllNotification = () => ElNotification.closeAll()

export const useMessage = () => {
  return {
    showMessage,
    showSuccessMessage,
    showWarningMessage,
    showInfoMessage,
    showErrorMessage,
    closeMessage,
    closeAllMessage,
    useMessageBox,
    showConfirmWarningBox,
    showConfirmSuccessBox,
    showNotification,
    showSuccessNotification,
    showWarningNotification,
    showInfoNotification,
    showErrorNotification,
    closeNotification,
    closeAllNotification
  }
}
