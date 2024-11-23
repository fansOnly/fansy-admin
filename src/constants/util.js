export const getConstantLabel = (list, value, label = '') => {
  const item = list.find((v) => v.value == value)
  return item?.label || label || ''
}
