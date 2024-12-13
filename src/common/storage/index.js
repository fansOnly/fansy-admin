function Storage() {
  const makeLocalKey = (key = '') => `::fansy-local::${key}`.toUpperCase()
  const makeSessionKey = (key = '') => `::fansy-session::${key}`.toUpperCase()

  const getItem = (key) => {
    let data = null
    try {
      data = localStorage.getItem(makeLocalKey(key)) || sessionStorage.getItem(makeSessionKey(key))
    } catch (error) {
      data = null
    }
    return data
  }

  const setItem = (key, value, client = true) => {
    if (client) {
      localStorage.setItem(makeLocalKey(key), value)
    } else {
      sessionStorage.setItem(makeSessionKey(key), value)
    }
  }

  const removeItem = (key) => {
    try {
      localStorage.removeItem(makeLocalKey(key))
      sessionStorage.removeItem(makeSessionKey(key))
    } catch (error) {}
  }

  const clear = () => {
    try {
      localStorage.clear()
      sessionStorage.clear()
    } catch (error) {}
  }

  return {
    getItem,
    setItem,
    removeItem,
    clear
  }
}

export default Storage()
