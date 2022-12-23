/* eslint-disable no-console */
const fs = require('fs')

const useCache = (cachePath = './tests/src/cache.json') => {
  const file = fs.readFileSync(cachePath)
  if (!file) {
    console.error('Cache file not found:', cachePath)
    return null
  }
  const cache = JSON.parse(file)
  if (!cache) {
    console.error('Cache file is empty or invalid:', cachePath)
    return null
  }

  return cache
}

const setCache = (cache, cachePath = './tests/src/cache.json') => {
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2))
}

module.exports = { useCache, setCache }
