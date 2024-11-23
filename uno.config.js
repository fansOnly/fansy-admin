import { defineConfig } from 'unocss'
import presetUno from '@unocss/preset-uno'

export default defineConfig({
  presets: [presetUno()],
  rules: [
    [/^(.*)-custom-(.*)$/, ([, prop, value]) => ({ [camelToKebab(prop)]: value })],
    [
      /^flex-\[(.*)\]$/,
      ([, value]) => {
        const [align, justify, direction, wrap] = value.split(',')
        return {
          display: 'flex',
          ...(align ? { 'align-items': align } : {}),
          ...(justify ? { 'justify-content': justify } : {}),
          ...(direction ? { 'flex-direction': direction } : {}),
          ...(wrap ? { 'flex-wrap': wrap } : {})
        }
      }
    ],
    [
      /^border(\-?.*)-\[(.*)\]$/,
      ([, direction, value]) => {
        const prop = direction ? `border${direction}` : 'border'
        const [width, style, color] = value.split(',')
        return {
          [prop]: `${width || '1px'} ${style || 'solid'} ${color || 'transparent'}`
        }
      }
    ],
    [/^shadow-custom-(.*)$/, ([, value]) => ({ 'box-shadow': value.replace(/_/g, ' ') })]
  ]
})

function camelToKebab(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}
