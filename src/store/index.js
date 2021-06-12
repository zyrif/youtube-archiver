import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authToken: '',
    apiUrl: 'http://localhost:8000'
  },
  getters: {
    authToken (state) {
      return state.authToken
    }
  },
  mutations: {
    setAuthToken (state, payload) {
      state.authToken = payload.token
    },
  },
  actions: {
  },
  modules: {
  }
})
