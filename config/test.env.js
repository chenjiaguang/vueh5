'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"test"',
  ASSETS_SUBDIRECTORY: JSON.stringify('cwebassets-' + global.time),
  ASSETS_PUBLIC_PATH: '"https://staticcdntest.fantuan.cn/h5/"',
  ASSETS_FULL_PATH: JSON.stringify('https://staticcdntest.fantuan.cn/h5/cwebassets-' + global.time + '/'),
  API_DOMAIN: '"https://fanttest.fantuan.cn"',
  WEIXINLOGINJUMP: '"/h5/weixinLoginJump"',
  LOCATION_DOMAIN: '"https://fanttest.fantuan.cn/cweb/index.html#"',
  LOGO_URL: JSON.stringify('https://fanttest.fantuan.cn/h5/cwebassets-' + global.time + '/image/van_logo.png')
})
