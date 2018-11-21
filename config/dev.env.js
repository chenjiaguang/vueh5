'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ASSETS_PUBLIC_PATH: '"/h5/"',
  API_DOMAIN: '"https://fanttest.fantuan.cn"',
  WEIXINLOGINJUMP: '"https://fanttest.fantuan.cn/h5/weixinLoginJump"',
  LOCATION_DOMAIN: '"https://fanttest.fantuan.cn/cweb/index.html#"',
  LOGO_URL: '"https://fanttest.fantuan.cn/h5/cwebassets/image/van_logo.png"'
})
