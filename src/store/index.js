import Vuex from 'vuex'
import modules from './modules'

const store = new Vuex.Store({
  strict: true,
  modules
})

export default store
