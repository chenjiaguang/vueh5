'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_DOMAIN: '"http://fanttest.fantuanlife.com"',
  WEIXINLOGINJUMP_HTTPS: '"https://fanttest.fantuanlife.com/h5/weixinLoginJump"',
  WEIXINLOGINJUMP_HTTP: '"http://192.168.1.199:8080/h5/weixinLoginJump"',
  LOCATION_DOMAIN: '"https://fanttest.fantuanlife.com/cweb/index.html#"',
  LOGO_URL:'"http://fanttest.fantuanlife.com/h5/cwebassets/image/van_logo.png"'
})
