export default {
  namespaced: true,
  state: {
    isLogin: false,
    token: '',
    phone: ''
  },
  mutations: {
    login (state, payload = {}) {
      state.token = payload.token || window.localStorage.token || ''
      state.phone = payload.phone || window.localStorage.phone || ''
      state.isLogin = !!state.token
      window.localStorage.token = state.token
      window.localStorage.phone = state.phone
      window.localStorage.userChangeTime = Number(new Date())
    },
    logout (state) {
      state.token = ''
      state.phone = ''
      state.isLogin = false
      window.localStorage.token = ''
      window.localStorage.phone = ''
      window.localStorage.userChangeTime = Number(new Date())
    }
  }
}
