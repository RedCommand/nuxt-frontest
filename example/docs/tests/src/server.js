const fetch = require('node-fetch-commonjs')

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const waitServer = async (url, timeout) => {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url)
      if (res.status === 200) {
        return
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }
    await sleep(100)
  }
  throw new Error(`Server did not start in ${timeout}ms`)
}

module.exports = { waitServer }
