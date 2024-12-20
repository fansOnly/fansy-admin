import { md5Encrypt } from '../../../common/security/md5'

export default [
  {
    url: '/api-mock/core/login',
    method: 'post',
    timeout: 500,
    // statusCode: 403,
    response: (config) => {
      const { username, password } = config.body
      if (username == 'admin' && password === md5Encrypt('123456')) {
        const token =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJuZmdvIiwic3ViIjoiYTg0OWRlZmQtY2JiOC00NWIzLTkxNjAtMmE2MWQxOTVjY2I5IiwiaWF0IjoxNzI4MzUwNjg4LCJleHAiOjE3Mjg0MzcwODh9.NBN8mLrLsBw3WcQf3RuxYEaay0z4MkfbrrhuRTecJRM'
        return {
          code: 10000,
          message: 'success',
          data: {
            accessToken: token,
            refreshToken: 'refreshToken'
          }
        }
      } else {
        return {
          code: 1003,
          message: '用户名或密码错误'
        }
      }
    }
  },
  {
    url: '/api-mock/core/refresh_token',
    method: 'post',
    timeout: 500,
    response: (config) => {
      const { token } = config.body
      if (token) {
        return {
          code: 10000,
          message: 'success',
          data: {
            accessToken:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJuZmdvIiwic3ViIjoiYTg0OWRlZmQtY2JiOC00NWIzLTkxNjAtMmE2MWQxOTVjY2I5IiwiaWF0IjoxNzI4MzUwNjg4LCJleHAiOjE3Mjg0MzcwODh9.NBN8mLrLsBw3WcQf3RuxYEaay0z4MkfbrrhuRTecJRM',
            refreshToken: 'refreshToken'
          }
        }
      } else {
        return {
          code: 10032
        }
      }
    }
  },
  {
    url: '/api-mock/core/logout',
    method: 'post',
    timeout: 500,
    response: () => {
      return {
        code: 10000,
        message: 'success'
      }
    }
  }
]
