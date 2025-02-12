class Storage {
  constructor() {
    this.keyPrefix = import.meta.env.VITE_NAMESPACE
  }
  makeKey(key = '', upper = false) {
    const keyName = `${this.keyPrefix}-${key}`
    return upper ? keyName.toUpperCase() : keyName
  }

  getLocalItem(key, upper = false) {
    let data = null
    try {
      const keyName = this.makeKey(key, upper)
      data = localStorage.getItem(keyName)
    } catch (error) {
      data = null
    }
    return data
  }

  getSessionItem(key, upper = false) {
    let data = null
    try {
      const keyName = this.makeKey(key, upper)
      data = sessionStorage.getItem(keyName)
    } catch (error) {
      data = null
    }
    return data
  }

  setSessionItem(key, value, upper = false) {
    const keyName = this.makeKey(key, upper)
    sessionStorage.setItem(keyName, value)
  }

  setLocalItem(key, value, upper = false) {
    const keyName = this.makeKey(key, upper)
    localStorage.setItem(keyName, value)
  }

  removeLocalItem(key, upper = false) {
    try {
      const keyName = this.makeKey(key, upper)
      localStorage.removeItem(keyName)
    } catch (error) {}
  }

  removeSessionItem(key, upper = false) {
    try {
      const keyName = this.makeKey(key, upper)
      sessionStorage.removeItem(keyName)
    } catch (error) {}
  }

  clearLocal() {
    const keys = this.getStorageKeys()
    keys.forEach((key) => {
      localStorage.removeItem(key)
    })
  }

  clearSession() {
    const keys = this.getStorageKeys(false)
    keys.forEach((key) => {
      sessionStorage.removeItem(key)
    })
  }

  clearStorage() {
    this.clearLocal()
    this.clearSession()
  }

  clearAll() {
    localStorage.clear()
    sessionStorage.clear()
  }

  getStorageKeys(client = true) {
    const storage = client ? localStorage : sessionStorage
    const keys = []
    for (let i = 0; i < storage.length; i++) {
      keys.push(storage.key(i))
    }
    return keys.filter((key) => key.includes(import.meta.env.VITE_NAMESPACE))
  }
}

export default new Storage()
