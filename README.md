# nuxt-frontest

## how it work
frontest is a warpper for [BackstopJS](https://github.com/garris/BackstopJS).
<br/>
BackstopJS is a test engine based on screenshots. in order to do a test, BackstopJS will first need a reference of what tha page look like. Then you can make modification to your site and then start a test. BackstopJS will take screenshots of all page you asked and compare them to the references.
**nuxt-frontest** is a warpper that use jest to start a web server, configure BackstopJS and lanch BackstopJS.

## features
- [ ] auto start a dev server
  - [x] start a dev server when test start
  - [ ] use first available port (currently it use port 5000)
- [x] support multiple test suites
- [x] allow configuration to be extended by test suite
- [ ] caching optimisation
- [ ] auto generate missing references
  - [ ] on test
  - [x] on approve
- [ ] auto generate routes from nuxt router


## install
- Copy the folowing files and folders in the root of your project:
  - `tests/`
  - `jest.config.js`
  - `jest-puppeteer.config.js`
- Add the folowing scripts to your `package.json`:
```json
    "test": "jest",
    "test:reference": "jest -stage=reference",
    "test:approve": "jest -stage=approve",
    "test:report": "jest -stage=report"
```
> :warning: Your `package.json` must contain a `dev` script that can be lauch using `PORT=5000 yarn dev` ; it should also be able to change port using the port env variable.
- Add the following dev dependencies to your `package.json`:
```json
    "@jest/globals": "^29.3.1",
    "@types/jest": "^29.2.3",
    "ts-jest": "^29.0.3",
    "backstopjs": "^6.1.4",
    "jest-dev-server": "^6.1.1",
    "jest-puppeteer": "^6.1.1",
    "node-fetch-commonjs": "^3.2.4",
    "nuxt": "npm:nuxt3@latest"
```

## use
### references
Theses references wil be used to compare the previour version with the current one.
First you need to create reference of your different pages.<br/>
You can create thoses references with:
<br/>
`yarn test:reference`

### test
Now that there iis references, you can start a test.
<br/>
You can do that with:
<br/>
`yarn test`

### approve
If one or more test(s) fail, you can approve the change with:
<br/>
`yarn test:approve`

### report
It is posible to open an autogenerated (by BackstopJS) html report with:
<br/>
`yarn test:report`

## what next
using a small warpper has a lot of disavantage:
- it is not possible to interact with the nuxt server (for example to ask the nuxt router what are the different routes)
- it is realy heavy (running a test engine in an other test engine which launch a dev server is not realy optimised)

A first solution to the first problem is to create a nuxt module but there is currently no way to stop the dev server from a module.
<br/>
For the second problem, the best solution will be to not use BackstopJS for testing. BackstopJS is not realy complicated: it's a program which start a headless puppeter browser and take screenshot. Also BackstopJS do not compare the screenshot directly, it use an other library [Resemble.js](https://github.com/rsmbl/Resemble.js) to compare images.