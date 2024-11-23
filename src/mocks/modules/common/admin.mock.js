import Mock from 'mockjs'

const initList = () => {
  const res = Mock.mock({
    ['LIST|14-106']: [
      {
        id: '@id',
        'sortnum|+10': 10,
        username: '@word(5,10)',
        nickname: '@cname',
        roleId: '@id',
        phone: /1[2-9]\d{9}/,
        email: '@email',
        age: '@integer(18, 80)',
        avatar: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        operator: '@id',
        createTime: '@date(yyyy-MM-dd hh:mm:ss)',
        updateTime: '@date(yyyy-MM-dd hh:mm:ss)',
        status: '@pick([-1, 0, 1])'
      }
    ]
  })
  return res.LIST
}

const TABLE_LIST = initList()
let CURREN_LIST = []

export default [
  {
    url: '/api-mock/common/admin/list',
    method: 'get',
    timeout: 500,
    response: (config) => {
      const { page = 1, pageSize = 10, username, nickname, phone, status } = config.query
      CURREN_LIST = TABLE_LIST.slice((page - 1) * pageSize, page * pageSize)
      if (username) {
        CURREN_LIST = CURREN_LIST.filter((v) => v.username.includes(username))
      }
      if (nickname) {
        CURREN_LIST = CURREN_LIST.filter((v) => v.nickname.includes(nickname))
      }
      if (phone) {
        CURREN_LIST = CURREN_LIST.filter((v) => v.phone.includes(username))
      }
      if (status !== '') {
        CURREN_LIST = CURREN_LIST.filter((v) => v.status === Number(status))
      }
      return {
        code: 200,
        message: 'success',
        data: {
          list: CURREN_LIST,
          total: TABLE_LIST.length
        }
      }
    }
  },
  {
    url: '/api-mock/common/admin/detail',
    method: 'get',
    timeout: 500,
    response: (config) => {
      const { id } = config.query
      const item =
        CURREN_LIST.find((v) => v.id === id) ||
        Mock.mock({
          id: id,
          sortnum: 10,
          username: '@word(5,10)',
          nickname: '@cname',
          phone: /1[2-9]\d{9}/,
          email: '@email',
          age: '@integer(18, 80)',
          // avatar: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
          avatar: 'https://fansonly.github.io/blogs/assets/test.gif',
          roleId: '@id',
          createTime: '@date(yyyy-MM-dd hh:mm:ss)',
          updateTime: '@date(yyyy-MM-dd hh:mm:ss)',
          status: '@pick([-1, 0, 1])'
        })
      return {
        code: 200,
        message: 'success',
        data: item
      }
    }
  },
  {
    url: '/api-mock/common/admin/update',
    method: 'post',
    timeout: 500,
    response: (config) => {
      const data = config.body
      return {
        code: 200,
        message: 'success',
        data
      }
    }
  },
  {
    url: '/api-mock/common/admin/add',
    method: 'post',
    timeout: 500,
    response: (config) => {
      const data = config.body
      return {
        code: 200,
        message: 'success',
        data
      }
    }
  },
  ,
  {
    url: '/api-mock/common/admin/remove',
    method: 'post',
    timeout: 500,
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: {
          affected: 1
        }
      }
    }
  }
]
