import Mock from 'mockjs'

const initList = () => {
  const res = Mock.mock({
    ['LIST|5-30']: [
      {
        id: '@id',
        title: '@word(5,10)',
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
    url: '/api-mock/common/search/list',
    method: 'get',
    timeout: 1000,
    response: (config) => {
      const { title, page = 1, pageSize = 9999 } = config.query
      CURREN_LIST = TABLE_LIST.slice((page - 1) * pageSize, page * pageSize)
      if (title) {
        CURREN_LIST = CURREN_LIST.filter((v) => v.title.includes(title))
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
  }
]
