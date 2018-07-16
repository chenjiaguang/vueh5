import Vue from 'vue'
import Vuex from 'vuex'
import ajax from './lib/ajax'
import browserUA from './lib/browserUA'
import toast from './components/toast'
import modal from './components/modal'
import ImagePreview from './components/ImagePreview'
import VConsole from 'vconsole/dist/vconsole.min.js' // import vconsole

/* eslint-disable no-new */
if (process.env.NODE_ENV !== 'production') { // 非正式环境包，就实例化vconsole
    new VConsole() // 初始化
}
Vue.prototype.$apiDomain = process.env.API_DOMAIN
Vue.prototype.$locationDomain = process.env.LOCATION_DOMAIN
Vue.prototype.$ajax = ajax
Vue.prototype.$browserUA = browserUA
Vue.prototype.$toast = toast
Vue.prototype.$modal = modal
Vue.prototype.$previewImage = ImagePreview
Vue.use(Vuex)

export default Vue
