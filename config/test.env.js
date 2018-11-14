'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"test"',
  API_DOMAIN: '"http://fanttest.fantuan.cn"',
  WEIXINLOGINJUMP_HTTPS: '"https://fanttest.fantuan.cn/h5/weixinLoginJump"',
  WEIXINLOGINJUMP_HTTP: '"http://fanttest.fantuan.cn/h5/weixinLoginJump"',
  LOCATION_DOMAIN: '"https://fanttest.fantuan.cn/cweb/index.html#"',
  LOGO_URL:'"http://fanttest.fantuan.cn/h5/cwebassets/image/van_logo.png"'
})
