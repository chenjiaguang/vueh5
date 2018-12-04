'use strict'
module.exports = {
  NODE_ENV: '"production"',
  ASSETS_SUBDIRECTORY: JSON.stringify('cwebassets-' + global.time),
  ASSETS_PUBLIC_PATH: '"https://staticcdn.fantuan.cn/h5/"',
  ASSETS_FULL_PATH: JSON.stringify('https://staticcdn.fantuan.cn/h5/cwebassets-' + global.time + '/'),
  API_DOMAIN: '"https://fant.fantuan.cn"',
  WEIXINLOGINJUMP: '"/h5/weixinLoginJump"',
  LOCATION_DOMAIN: '"https://fant.fantuan.cn/cweb/index.html#"',
  LOGO_URL: JSON.stringify('https://fant.fantuan.cn/h5/cwebassets-' + global.time + '/image/van_logo.png')
}
