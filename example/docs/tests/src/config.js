/* eslint-disable no-console */

/**
 * @typedef {import('./type').BackstopJSConfig} BackstopJSConfig
 * @typedef {import('./type').Scenario} Scenario
 */

// const crypto = require('crypto')
// const fs = require('fs')
// const fetch = require('node-fetch-commonjs')
const backstop = require('backstopjs')
const { getRoutes } = require('./routes')
// const { useCache, setCache } = require('./cache')

// const logger = console.log

const defaultConfig = {
  id: '',
  viewports: [],
  scenarios: [],
  paths: {
    bitmaps_reference: 'backstop_data/bitmaps_reference',
    bitmaps_test: 'backstop_data/bitmaps_test',
    engine_scripts: 'tests/src/scripts',
    html_report: 'backstop_data/html_report',
    ci_report: 'backstop_data/ci_report'
  },
  engine: 'playwright',
  engineOptions: {
    browser: 'chromium',
    headless: true,
    args: ['--log-level=3'],
    logLevel: 6
  },
  report: ['CI'],
  asyncCaptureLimit: 5,
  asyncCompareLimit: 50,
  debug: false,
  onBeforeScript: 'logger.js',
  misMatchThreshold: 0.05
}

/* const getChecksum = async (route) => {
  console.log('Fetching:', route)
  const html = await fetch('http://localhost:5000').then(resp => resp.text())
  return crypto.createHash('md5').update(html).digest('hex')
}

const isCached = async (route, checksum) => {
  if (checksum === true) { return true }
  const newChecksum = await getChecksum(route)
  return checksum === newChecksum
}

const getReference = async (configValue, route, cache) => {
  let checksum

  for (const item of cache.pagesChecksum) {
    if (item.path === route) {
      checksum = item.checksum
      break
    }
  }
  if (checksum) { return checksum }
  console.log('Generating reference:', route)
  await backstop('reference', { filter: route, config: configValue })
    .catch((err) => { console.error(`Reference failed for '${route}': `, err) })
  return getChecksum(route)
}

const useTestold = async (config, cache = true) => {
  let result
  // fs.writeFileSync('./backstop.json', JSON.stringify(configValue, null, 2))
  for (const [index, scenario] of configValue.scenarios.entries()) {
    const checksum = await getReference(configValue, scenario.label, cacheData)

    newCache.pagesChecksum.push({
      path: scenario.url,
      checksum: String(checksum)
    })
    if (!cache) { continue }
    if (isCached(scenario.label, checksum)) {
      delete filters[index]
    }
  }
  for (let index = 0; index < configValue.scenarios.length; index++) {
    configValue.scenarios[index].url = `${baseUrl.slice(0, -1)}${configValue.scenarios[index].label}`
  }
  console.log('url:', configValue.scenarios[0].url)
  // filters.join('|')
  // console.log = () => {}
  console.log('Filters:', filters.join('|'))
  await backstop('test', { filter: filters.join('|'), config: configValue })
    .then(() => { result = true })
    .catch(() => { result = false })
  // console.log = logger
  setCache(newCache)
  return result
} */

const useTest = async (configValue, cache = true) => {
  let result // @type {boolean}
  await backstop('test', { config: configValue })
    .then(() => { result = true })
    .catch(() => { result = false })
  return result
}

const useReference = async (configValue, baseUrl) => {
  let result // @type {boolean}
  await backstop('reference', { config: configValue })
    .then(() => { result = true })
    .catch(() => { result = false })
  return result
}

const useApprove = async (configValue) => {
  let result // @type {boolean}
  await backstop('approve', { config: configValue })
    .then(() => { result = true })
    .catch(() => { result = false })
  return result
}

const useReport = async (configValue) => {
  let result // @type {boolean}
  await backstop('openReport', { config: configValue })
    .then(() => { result = true })
    .catch(() => { result = false })
  return result
}

/**
 * @param {string} name The name of the test.
 * @param {BackstopJSConfig} config The backstopjs config object, will be extended if autoconf is true.
 * @param {string} baseUrl The base url of the app.
 * @return {BackstopJSConfig} The auto generated and merged config.
 */
const getConfig = async (name, config, baseUrl) => {
  const configValue = { ...defaultConfig, ...config } // @type {BackstopJSConfig}
  const routes = await getRoutes()
  const scenarios = routes.map((route) => {
    return {
      label: route,
      url: `${baseUrl.slice(-1) === '/' ? baseUrl.slice(0, -1) : baseUrl}${route}`
    }
  }) // @type {Scenario[]}
  configValue.id = name
  configValue.scenarios = [...scenarios]
  return configValue
}

/**
 * @param {string} name The name of the test.
 * @param {object} config The backstopjs config object, will be extended if autoconf is true.
 * @param {string} baseUrl The base url of the app.
 * @param {boolean} autoconf If true, the test scenarios will be configured automatically.
 * @param {boolean} cache Use cache ?.
 * @return {boolean} The result of the test.
 */
const useConfig = async (name, config, baseUrl, { stage = null, autoconf = true, cache = true, seeOnFail = false }) => {
  const stageArg = stage || process.argv.filter(x => x.startsWith('-stage='))[0]?.replace('-stage=', '')
  /** @type {BackstopJSConfig} */
  const newConfig = autoconf
    ? await getConfig(name, config, baseUrl)
    : { ...defaultConfig, ...config }
  let result = false

  switch (stageArg) {
    case 'reference':
      result = await useReference(newConfig, baseUrl)
      break
    case 'approve':
      result = await useApprove(newConfig)
      break
    case 'report':
      result = await useReport(newConfig)
      break
    default:
      result = await useTest(newConfig, baseUrl, cache)
      break
  }
  if (!result && seeOnFail) {
    await useReport(newConfig)
  }
  return result
}

module.exports = { useConfig, getConfig, useTest, useReference, useApprove, useReport }
