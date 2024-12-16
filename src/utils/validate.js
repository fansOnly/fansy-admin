export const isPhone = (value) =>
  /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(value)

export const isEmail = (value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)

export const isColor = (color) => {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  const rgbColorRegex = /^(rgb)\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/
  const rgbaColorRegex = /^(rgba)\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(0?\.\d+|1(\.0+)?)\)$/

  return hexColorRegex.test(color) || rgbColorRegex.test(color) || rgbaColorRegex.test(color)
}

export const isPassword = (value) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)

export const isChinese = (value) => /^[\u4e00-\u9fa5]+$/.test(value)

export const isNickname = (value) => /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/.test(value)
