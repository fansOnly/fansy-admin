import 'nprogress/nprogress.css'
let nProgressInstance = null

async function initNprogress() {
  if (nProgressInstance) return nProgressInstance
  nProgressInstance = await import('nprogress')
  nProgressInstance.configure({
    speed: 300,
    minimum: 0.02,
    trickleSpeed: 200,
    showSpinner: false
  })
  return nProgressInstance
}

async function startNprogress() {
  const nprogress = await initNprogress()
  nprogress?.start()
}

async function stopNprogress() {
  const nprogress = await initNprogress()
  nprogress?.done()
}

async function checkNprogress() {
  const nprogress = await initNprogress()
  return nprogress?.isStarted()
}

export { checkNprogress, startNprogress, stopNprogress }
