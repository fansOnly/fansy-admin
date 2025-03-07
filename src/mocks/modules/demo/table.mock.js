import Mock from 'mockjs'
import { tableApiPath } from '../../../api/api-path'

const initTableList = () => {
  const res = Mock.mock({
    ['LIST|53-106']: [
      {
        id: '@id',
        'sortnum|+10': 10,
        name: '@cname',
        content: '@cword(5, 30)',
        city: '@city',
        province: '@province',
        zip: '@zip',
        date: '@date',
        status: '@pick([0, 1, 2])'
      }
    ]
  })
  return res.LIST
}

const TABLE_LIST = initTableList()
let CURREN_LIST = []

export default [
  {
    url: `/api-mock${tableApiPath.list}`,
    method: 'get',
    timeout: 500,
    response: (config) => {
      const { page = 1, pageSize = 10 } = config.query
      CURREN_LIST = TABLE_LIST.slice((page - 1) * pageSize, page * pageSize)
      return {
        code: 10000,
        message: 'success',
        data: {
          list: CURREN_LIST,
          total: TABLE_LIST.length
        }
      }
    }
  },
  {
    url: `/api-mock${tableApiPath.detail}`,
    method: 'get',
    timeout: 300,
    response: (config) => {
      const { id } = config.query
      const item = CURREN_LIST.find((v) => v.id === id)
      return {
        code: 10000,
        message: 'success',
        data: item
      }
    }
  },
  {
    url: `/api-mock${tableApiPath.add}`,
    method: 'post',
    timeout: 300,
    response: (config) => {
      const params = config.body
      TABLE_LIST.unshift(params)
      return {
        code: 10000,
        message: 'success'
      }
    }
  },
  {
    url: `/api-mock${tableApiPath.update}`,
    method: 'post',
    timeout: 300,
    response: (config) => {
      const { id, ...rest } = config.body
      const item = CURREN_LIST.find((v) => v.id === id)
      return {
        code: 10000,
        message: 'success'
      }
    }
  },
  {
    url: `/api-mock${tableApiPath.delete}`,
    method: 'post',
    timeout: 300,
    response: (config) => {
      const { id } = config.body
      if (typeof id === 'string') {
        const index = TABLE_LIST.findIndex((v) => v.id === id)
        TABLE_LIST.splice(index, 1)
      } else {
        TABLE_LIST.filter((v) => !id.includes(v.id))
      }
      return {
        code: 10000,
        message: 'success'
      }
    }
  }
]
