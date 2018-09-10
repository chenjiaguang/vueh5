import Vue from 'vue'
import main from './Preview.vue'

let Main = Vue.extend(main)

let preview = {
  show: (obj) => {
    let {images, idx, options, clickedEl, placeholder} = obj
    if (!images || images.length < 1) { // 图片列表不存在
      return false
    } else if (!images[idx].width || !images[idx].height) { // 未获取到图片的宽高
      return false
    }
    let _initialOptions = {
      width: window.innerWidth,
      height: window.innerHeight,
      index: idx
    }
    let _options = Object.assign({}, _initialOptions, options)
    let div = window.document.createElement('div')
    let _main = new Main({
      data: function () {
        return {
          images: images.map((item) => {
            return {
              w: item.width,
              h: item.height,
              src: item.url,
              msrc: placeholder || null
            }
          }),
          options: _options,
          zIndex: new Date().getTime(),
          clickedEl: clickedEl
        }
      }
    })
    window.document.body.appendChild(div)
    _main.$mount(div)
  }
}

export default preview
