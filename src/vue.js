import Vue from 'vue'
import Vuex from 'vuex'
import ajax from './lib/ajax'
import browserUA from './lib/browserUA'
import toast from './components/toast'

/* eslint-disable no-new */
Vue.prototype.$ajax = ajax
Vue.prototype.$browserUA = browserUA
Vue.prototype.$toast = toast
Vue.use(Vuex)

export default Vue
