// const { setup: setupDevServer } = require('jest-dev-server')

module.exports = {
  server: {
    command: 'PORT=5000 yarn dev',
    port: 5000,
    launchTimeout: 50000
  }
}
