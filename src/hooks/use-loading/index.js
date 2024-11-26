import { ElLoading } from 'element-plus'

let loadingInstance = null

export const useLoading = () => {
  const showLoading = (options) => {
    loadingInstance = ElLoading.service(options)
  }

  const hideLoading = () => {
    loadingInstance.close()
  }

  return {
    showLoading,
    hideLoading
  }
}
