import { useMessage } from '@/hooks/use-message'
const { showMessage } = useMessage()

/**
 * script error
 * @param {*} event
 * @param {*} source
 * @param {*} lineno
 * @param {*} colno
 * @param {*} error
 */
const scriptErrorHandler = (event, source, lineno, colno, error) => {
  console.log(':: script error :: ', error)
}

/**
 * static resource loading error
 */
const registerResourceErrorHandler = () => {
  window.addEventListener('error', (event) => {
    console.log(':: resource error :: ', event)
  })
}

/**
 * promise exception
 */
const registerPromiseErrorHandler = () => {
  window.addEventListener('unhandledrejection', (event) => {
    console.log(':: unhandledrejection :: ', event)
  })
}

/**
 * Vue exception
 * @param {*} err
 * @param {*} instance
 * @param {*} info
 */
const vueErrorHandler = (err, instance, info) => {
  // 处理错误，例如：报告给一个服务
  console.log(':: vue error :: ', err, instance, info)
  if (err instanceof ReferenceError) {
    showMessage('error', err.message)
  }
}

/**
 * vite load error
 */
const registerViteErrorHandler = () => {
  window.addEventListener('vite:preloadError', (event) => {
    console.log(':: vite preload error :: ', event)
    // window.location.reload()
  })
}

export const setupErrorHandler = (app) => {
  app.config.errorHandler = vueErrorHandler
  window.onerror = scriptErrorHandler
  registerPromiseErrorHandler()
  registerResourceErrorHandler()
  registerViteErrorHandler()
}
