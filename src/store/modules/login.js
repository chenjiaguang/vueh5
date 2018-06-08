export default {
  namespaced: true,
  state: {
    isLogin: false,
    token: '',
    phone: '',
    name: '',
    avatar: ''
  },
  mutations: {
    login (state, payload = {}) {
      state.token = payload.token || window.localStorage.token || ''
      state.phone = payload.phone || window.localStorage.phone || ''
      state.name = payload.name || window.localStorage.name || ''
      state.avatar = payload.avatar || window.localStorage.avatar || ''
      state.isLogin = !!state.token
      window.localStorage.token = state.token
      window.localStorage.phone = state.phone
      window.localStorage.name = state.name
      window.localStorage.avatar = state.avatar
    },
    logout (state) {
      state.token = ''
      state.phone = ''
      state.name = ''
      state.avatar = ''
      state.isLogin = false
      window.localStorage.token = ''
      window.localStorage.phone = ''
      window.localStorage.name = ''
      window.localStorage.avatar = ''
    }
  }
}
