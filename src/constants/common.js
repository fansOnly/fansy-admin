export const COMMON_ACTIONS = {
  SEARCH: 'search',
  REFRESH: 'refresh',
  EDIT: 'edit',
  DELETE: 'delete',
  ADD: 'add',
  DETAIL: 'detail',
  VIEW: 'view',
  PUBLISH: 'publish',
  UN_PUBLISH: 'unPublish',
  TOP: 'top',
  UN_TOP: 'unTop',
  ENABLE: 'enable',
  DISABLE: 'disable',
  RESET: 'reset',
  IMPORT: 'import',
  EXPORT: 'export',
  DOWNLOAD: 'download',
  UPLOAD: 'upload',
  PRINT: 'print',
  COPY: 'copy',
  SEND: 'send',
  RECEIVE: 'receive',
  AUDIT: 'audit',
  REJECT: 'reject',
  CANCEL: 'cancel',
  CONFIRM: 'confirm',
  RESET: 'reset',
  RESET_PASSWORD: 'resetPassword',
  CHANGE_PASSWORD: 'changePassword',
  CHANGE_STATUS: 'changeStatus',
  CHANGE_ROLE: 'changeRole',
  CHANGE_PERMISSION: 'changePermission'
}
// 常规数据状态
export const DATA_STATUS_LIST = [
  { label: '置顶', value: 2 },
  { label: '上架', value: 1 },
  { label: '下架', value: 0 }
]
// 账号数据状态
export const ACCOUNT_STATUS_LIST = [
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 },
  { label: '异常', value: -1 }
]
// 徽章数据状态
export const BADGE_STATUS_LIST = [
  { label: 'danger', value: 0 },
  { label: 'success', value: 1 },
  { label: 'primary', value: 2 },
  { label: 'warning', value: 3 }
]
// 菜单类型
export const MENU_TYPE_LIST = [
  { label: '页面', value: 'default' },
  { label: 'iframe', value: 'iframe' },
  { label: '外链', value: 'external-link' }
]
// 真假选择 true-false
export const TRUE_FALSE_LIST = [
  { label: '是', value: true },
  { label: '否', value: false }
]
// 1-0选择
export const ONE_ZERO_LIST = [
  { label: '是', value: 1 },
  { label: '否', value: 0 }
]
