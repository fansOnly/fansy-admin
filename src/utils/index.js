export const EMPTY_ARR = []
export const EMPTY_OBJ = {}
export const NOOP = () => {}
export const NO = false

const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (target, key) => hasOwnProperty.call(target, key)

export const extend = Object.assign

export const objectToString = Object.prototype.toString
export const toTypeString = (value) => objectToString.call(value)

export const isString = (value) => typeof value === 'string'
export const isNumber = (value) => typeof value === 'number'
export const isObject = (value) => value !== null && typeof value === 'object'
export const isFunction = (value) => typeof value === 'function'
export const isArray = Array.isArray
export const isPromise = (value) =>
  isObject(value) && isFunction(value.then) && isFunction(value.catch)
export const isPlainObject = (value) => toTypeString(value) === '[object Object]'
export const isDate = (value) => toTypeString(value) === '[object Date]'

export const cacheFunction = (fn) => {
  const cached = Object.create(null)
  return (key) => {
    return cached[key] || (cached[key] = fn(key))
  }
}

export const formatUnit = (value) => {
  if (/^\d+$/.test(String(value)) || isNumber(value)) {
    return value + 'px'
  }
  return value
}

export function isMacOS() {
  const platform = navigator.platform.toLowerCase()
  return platform.includes('mac')
}
