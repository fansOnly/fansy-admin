import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

let messageInstances = []
/**
 * Message 消息提示
 * @param {*} type 'success' | 'warning' | 'info' | 'error'
 */
const showMessage = (type = 'info', message = '', options = {}) => {
  const { plain = false, duration = 1500, onCloseFn, appContext } = options

  messageInstances.push(
    ElMessage(
      {
        type,
        message,
        duration,
        plain,
        onClose: () => {
          typeof onCloseFn === 'function' && onCloseFn()
        }
      },
      appContext
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
const useMessageBox = (type = 'confirm', message = '', options = {}) => {
  let {
    title = '',
    iconType = 'info',
    icon = '',
    showClose = true,
    lockScroll = true,
    showCancelButton = false,
    cancelButtonText = '取消',
    showConfirmButton = true,
    confirmButtonText = '确定',
    closeOnClickModal = true,
    draggable = false,
    center = false,
    callback,
    beforeClose,
    appContext
  } = options

  showCancelButton = ['confirm', 'prompt'].includes(type) ? true : showCancelButton
  closeOnClickModal = type === 'alert' ? false : closeOnClickModal
  ElMessageBox[type](
    message,
    title,
    {
      showClose,
      type: iconType,
      icon: icon,
      'lock-scroll': lockScroll,
      'show-cancel-button': showCancelButton,
      'show-confirm-button': showConfirmButton,
      'cancel-button-text': cancelButtonText,
      'confirm-button-text': confirmButtonText,
      'close-on-click-modal': closeOnClickModal,
      draggable,
      center,
      callback: (value, action) => {
        typeof callback === 'function' && callback(value, action)
      },
      beforeClose: (action, instance, done) => {
        typeof beforeClose === 'function' ? beforeClose(action, instance, done) : done()
      }
    },
    appContext
  )
}

let notificationInstances = []
/**
 * Notification 通知
 * @param {string} type 'success' | 'warning' | 'info' | 'error' | ''
 * @param {Object} options
 * @param {string} options.position 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
 */
const showNotification = (type = '', message = '', options = {}) => {
  const {
    title = '',
    duration = 4500,
    position = 'top-right',
    showClose = true,
    zIndex = 0,
    onCloseFn,
    onClickFn,
    appContext
  } = options

  notificationInstances.push(
    ElNotification(
      {
        type,
        title,
        message,
        duration,
        position,
        showClose,
        zIndex,
        onClick: () => {
          typeof onClickFn === 'function' && onClickFn()
        },
        onClose: () => {
          typeof onCloseFn === 'function' && onCloseFn()
        }
      },
      appContext
    )
  )
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
    showNotification,
    closeNotification,
    closeAllNotification
  }
}
