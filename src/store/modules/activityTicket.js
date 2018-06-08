export default {
  namespaced: true,
  state: {
    ticketId: ''
  },
  mutations: {
    saveId (state, payload = {}) {
      state.ticketId = payload.ticketId || window.localStorage.ticketId || ''
      window.localStorage.ticketId = state.ticketId
    },
    clearId (state) {
      state.ticketId = ''
      window.localStorage.ticketId = ''
    }
  }
}
