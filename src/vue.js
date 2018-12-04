import Vue from 'vue'
import Vuex from 'vuex'
import VueLazyload from 'vue-lazyload'
import ajax from './lib/ajax'
import browserUA from './lib/browserUA'
import toast from './components/toast'
import modal from './components/modal'
import prompt from './components/prompt'
import Preview from './components/preview'
import Video from './components/video'
import appCall from './lib/appCall'
import '@/iconfont/iconfont.css'

import VConsole from 'vconsole/dist/vconsole.min.js' // import vconsole
import {
  /* eslint-disable no-unused-vars */
  Style
} from 'cube-ui'

/* eslint-disable no-new */
if (process.env.NODE_ENV !== 'production') { // 非正式环境包，就实例化vconsole
  new VConsole() // 初始化
}
Vue.prototype.$assetsFullPath = process.env.ASSETS_FULL_PATH
Vue.prototype.$winWidth = window.innerWidth > 800 ? 800 : window.innerWidth
Vue.prototype.$winHeight = window.innerHeight
Vue.prototype.$tranScale = 1 / window.devicePixelRatio
Vue.prototype.$apiDomain = process.env.API_DOMAIN
Vue.prototype.$locationDomain = process.env.LOCATION_DOMAIN
Vue.prototype.$ajax = ajax
Vue.prototype.$browserUA = browserUA
Vue.prototype.$toast = toast
Vue.prototype.$modal = modal
Vue.prototype.$prompt = prompt
Vue.prototype.$previewImage = Preview
Vue.prototype.$video = Video
Vue.prototype.$appCall = appCall
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: Vue.prototype.$assetsFullPath + 'image/img_error.png',
  loading: Vue.prototype.$assetsFullPath + 'image/img_loading.png',
  attempt: 1
})
window._max_width = 800
Vue.use(Vuex)
window.receiveIsFantuan = function (string) {
  window._is_app = parseInt(string)
  Vue.prototype.$isApp = window._is_app
}
appCall('isFanTuan')
Vue.prototype.$isApp = window._is_app
window.addEventListener('resize', function () {
  Vue.prototype.$winWidth = window.innerWidth > 800 ? 800 : window.innerWidth
  Vue.prototype.$winHeight = window.innerHeight
}, false)

export default Vue
