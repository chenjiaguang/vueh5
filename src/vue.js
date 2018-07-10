import Vue from 'vue'
import Vuex from 'vuex'
import ajax from './lib/ajax'
import browserUA from './lib/browserUA'
import toast from './components/toast'

Vue.prototype.$apiDomain = process.env.API_DOMAIN
Vue.prototype.$locationDomain = process.env.LOCATION_DOMAIN
Vue.prototype.$ajax = ajax
Vue.prototype.$browserUA = browserUA
Vue.prototype.$toast = toast
Vue.use(Vuex)

export default Vue
