import Mock from 'mockjs'
import { dictionaryApiPath } from '../../../api/api-path'

const initList = () => {
  const res = Mock.mock({
    ['LIST|5-10']: [
      {
        id: '@id',
        'sortnum|+10': 10,
        title: '@cword(2,5)',
        ['options|1-3']: [
          {
            title: '@cword(2,5)',
            value: '@pick([1,2,3,4,5])',
            status: '@pick([0, 1])'
          }
        ],
        operator: '@id',
        createTime: '@date(yyyy-MM-dd hh:mm:ss)',
        updateTime: '@date(yyyy-MM-dd hh:mm:ss)',
        status: '@pick([0, 1])'
      }
    ]
  })
  return res.LIST
}

const TABLE_LIST = initList()
let CURREN_LIST = []

export default [
  {
    url: `/api-mock${dictionaryApiPath.list}`,
    method: 'get',
    timeout: 500,
    response: (config) => {
      const { page = 1, pageSize = 10, status, title } = config.query
      CURREN_LIST = TABLE_LIST.slice((page - 1) * pageSize, page * pageSize)
      if (title) {
        CURREN_LIST = CURREN_LIST.filter((v) => v.title.includes(title))
      }
      if (status !== '') {
        CURREN_LIST = CURREN_LIST.filter((v) => v.status === Number(status))
      }
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
    url: `/api-mock${dictionaryApiPath.detail}`,
    method: 'get',
    timeout: 500,
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
    url: `/api-mock${dictionaryApiPath.update}`,
    method: 'post',
    timeout: 500,
    response: (config) => {
      const data = config.body
      return {
        code: 10000,
        message: 'success',
        data
      }
    }
  },
  {
    url: `/api-mock${dictionaryApiPath.add}`,
    method: 'post',
    timeout: 500,
    response: (config) => {
      const data = config.body
      return {
        code: 10000,
        message: 'success',
        data
      }
    }
  },
  {
    url: `/api-mock${dictionaryApiPath.remove}`,
    method: 'post',
    timeout: 500,
    response: () => {
      return {
        code: 10000,
        message: 'success',
        data: {
          affected: 1
        }
      }
    }
  }
]
