'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_DOMAIN: '"http://fanttest.fantuanlife.com"',
  LOCATION_DOMAIN: '"https://fanttest.fantuanlife.com/cweb/index.html#"'
})
