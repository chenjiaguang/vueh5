'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"test"',
  API_DOMAIN: '"http://fanttest.fantuanlife.com"',
  WEIXINLOGINJUMP_HTTPS: '"https://fanttest.fantuanlife.com/h5/weixinLoginJump"',
  WEIXINLOGINJUMP_HTTP: '"http://fanttest.fantuanlife.com/h5/weixinLoginJump"',
  LOCATION_DOMAIN: '"https://fanttest.fantuanlife.com/cweb/index.html#"'
})
