import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authToken: '',
    // TODO: Move this into environment variables
    cognitoData: {
      UserPoolId: 'us-east-1_zw36Y5Lit',
      ClientId: '5o54dn7u30p0mmstn4orljlip5'
    },
    user: null,                  // aws cognito user
    apiUrl: 'https://api.tectronus.com/yttracker'
  },
  getters: {
    authToken (state) {
      return state.authToken
    },
    cognitoData (state) {
      return state.cognitoData
    },
    user (state) {
      return state.user
    }
  },
  mutations: {
    setAuthToken (state, payload) {
      state.authToken = payload.token
    },
    setUser (state, payload) {
      state.user = payload.user
    }
  },
  actions: {
  },
  modules: {
  }
})
