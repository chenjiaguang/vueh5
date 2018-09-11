import Vue from 'vue'
import Vuex from 'vuex'
import VueLazyload from 'vue-lazyload'
import ajax from './lib/ajax'
import browserUA from './lib/browserUA'
import toast from './components/toast'
import modal from './components/modal'
import Preview from './components/preview'

import VConsole from 'vconsole/dist/vconsole.min.js' // import vconsole
import {
  /* eslint-disable no-unused-vars */
  Style
} from 'cube-ui'

/* eslint-disable no-new */
if (process.env.NODE_ENV !== 'production') { // 非正式环境包，就实例化vconsole
  new VConsole() // 初始化
}
Vue.prototype.$assetsPublicPath = '/h5'
Vue.prototype.$winWidth = window.innerWidth
Vue.prototype.$winHeight = window.innerHeight
Vue.prototype.$tranScale = 1 / window.devicePixelRatio
Vue.prototype.$apiDomain = process.env.API_DOMAIN
Vue.prototype.$locationDomain = process.env.LOCATION_DOMAIN
Vue.prototype.$ajax = ajax
Vue.prototype.$browserUA = browserUA
Vue.prototype.$toast = toast
Vue.prototype.$modal = modal
Vue.prototype.$previewImage = Preview
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: '/h5/cwebassets/image/img_error.png',
  loading: '/h5/cwebassets/image/img_loading.png',
  attempt: 1
})
Vue.use(Vuex)

window.addEventListener('resize', function () {
  Vue.prototype.$winWidth = window.innerWidth
  Vue.prototype.$winHeight = window.innerHeight
}, false)

export default Vue
