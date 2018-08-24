export default {
  namespaced: true,
  state: {
    isLogin: false,
    token: ''
  },
  mutations: {
    login (state, payload = {}) {
      state.token = payload.token || window.localStorage.token || ''
      state.isLogin = !!state.token
      window.localStorage.token = state.token
      window.localStorage.userChangeTime = Number(new Date())
    },
    logout (state) {
      state.token = ''
      state.isLogin = false
      window.localStorage.token = ''
      window.localStorage.userChangeTime = Number(new Date())
    }
  }
}
