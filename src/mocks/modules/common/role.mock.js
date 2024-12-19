import Mock from 'mockjs'

const initList = () => {
  const arr = ['访客', '普通管理员', '系统管理员', '审核管理员', '超级管理员', '管理员']
  let res = []
  for (let i = 0; i < arr.length; i++) {
    res.push(
      Mock.mock({
        id: '@id',
        sortnum: (i + 1) * 10,
        title: arr[i],
        content: '@csentence',
        'permissions|1-5': ['@id'],
        operator: '@id',
        createTime: '@date(yyyy-MM-dd hh:mm:ss)',
        updateTime: '@date(yyyy-MM-dd hh:mm:ss)',
        status: i < 5 ? 1 : 0
      })
    )
  }
  return res
}

const TABLE_LIST = initList()
let CURREN_LIST = []

export default [
  {
    url: '/api-mock/common/role/list',
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
    url: '/api-mock/common/role/detail',
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
    url: '/api-mock/common/role/update',
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
    url: '/api-mock/common/role/add',
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
  ,
  {
    url: '/api-mock/common/role/remove',
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
