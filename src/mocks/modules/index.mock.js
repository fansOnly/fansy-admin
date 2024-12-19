let i = 0
let j = 11

export default [
  {
    url: '/api-mock/test',
    method: 'get',
    timeout: 500,
    // statusCode: 403,
    response: () => {
      if (i++ < 3) {
        return {
          code: 10031
        }
      } else {
        return {
          code: 10000
        }
      }
    }
  }
]
