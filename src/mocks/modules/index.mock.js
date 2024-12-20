export default [
  {
    url: '/api-mock/test',
    method: 'get',
    timeout: 500,
    // statusCode: 403,
    response: (config) => {
      if (!config.headers.authorization) {
        return {
          code: 10031
        }
      } else {
        return {
          code: 10000,
          message: 'success'
        }
      }
    }
  }
]
