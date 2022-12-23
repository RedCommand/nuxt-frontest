const { useConfig } = require('./src/config')
const { waitServer } = require('./src/server')

test('my test', async () => {
  await waitServer('http://localhost:5000', 50000)
  const result = await useConfig('nuxt-image', {
    viewports: [
      {
        label: 'phone',
        width: 320,
        height: 480
      },
      {
        label: 'tablet',
        width: 768,
        height: 1024
      },
      {
        label: 'desktop',
        width: 2560,
        height: 1440
      }
      /* {
        label: 'desktop-dark',
        width: 2560,
        height: 1440,
        emulateDark: true
      } */
    ]
  }, 'http://localhost:5000/', { seeOnFail: true })

  expect(result).toBe(true)
}, 60000)
