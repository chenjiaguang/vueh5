'use strict'
const utils = require('./utils')
const config = require('../config')
const isBuild = process.env.IS_BUILD
const sourceMapEnabled = isBuild
  ? config.build.cssSourceMap
  : config.dev.cssSourceMap

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: isBuild
  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
