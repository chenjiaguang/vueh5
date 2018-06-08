import Vue from 'vue'
import Vuex from 'vuex'
import ajax from './lib/ajax'
import toast from './components/toast'

/* eslint-disable no-new */
Vue.prototype.$ajax = ajax
Vue.prototype.$toast = toast
Vue.use(Vuex)

export default Vue
