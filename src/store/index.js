import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // authToken: '',
    cognitoData: {
      UserPoolId: 'us-east-1_Nq7fxv1tA',
      ClientId: '5op2o50bkjf58itl0866ua082b'
    },
    user: null,                  // aws cognito user
    apiUrl: 'https://api.tectronus.com/yttracker'
  },
  getters: {
    // authToken (state) {
    //   return state.authToken
    // }
    cognitoData (state) {
      return state.cognitoData
    },
    user (state) {
      return state.user
    }
  },
  mutations: {
    // setAuthToken (state, payload) {
    //   state.authToken = payload.token
    // },
    setUser (state, payload) {
      state.user = payload.user
    }
  },
  actions: {
  },
  modules: {
  }
})
