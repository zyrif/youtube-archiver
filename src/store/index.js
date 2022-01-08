import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// This store primarily has user authentication logic.
// If you find yourself adding other logics here,
// consider splitting up into a separate file
export default new Vuex.Store({
  state: {
    apiUrl: 'https://api.tectronus.com/yttracker',

    // TODO: Move IDs into environment variables
    cognitoUserPool: new CognitoUserPool({
        UserPoolId: 'us-east-1_zw36Y5Lit',
        ClientId: '5o54dn7u30p0mmstn4orljlip5'
    }),
    cognitoUser: null,
  },
  getters: {
    isLoggedIn (state, getters) {
      return getters.accessToken !== '' ? true : false
    },
    idToken (state) {
      if (!state.cognitoUser || !state.cognitoUser.getSignInUserSession()) {
        return ''
      }
      return state.cognitoUser.getSignInUserSession().getIdToken().getJwtToken()
    },
    accessToken (state) {
      if (!state.cognitoUser || !state.cognitoUser.getSignInUserSession()) {
        return ''
      }
      return state.cognitoUser.getSignInUserSession().getAccessToken().getJwtToken()
    },
  },
  mutations: {
    setUser (state, { email }) {
      state.cognitoUser = new CognitoUser({
        Username: email,
        Pool: state.cognitoUserPool,
      })
    },
  },
  actions: {
    authenticateUser (context, { authData, successCallback, errorCallback }) {
      let authDetails = new AuthenticationDetails({
        Username: authData.email,
        Password: authData.password,
      })

      context.commit('setUser', authData)

      context.state.cognitoUser.authenticateUser(authDetails, {
        onSuccess: successCallback,
        onFailure: errorCallback,
      })
    },
    confirmRegistration (context, { code, resultCallback }) {
      context.state.cognitoUser.confirmRegistration(code, true, resultCallback)
    },
    signUp (context, { email, password , resultCallback }) {
      context.state.cognitoUserPool.signUp(email, password, null, null, resultCallback )
    },
    signOut (context, resultCallback) {
      context.state.cognitoUser.signOut(resultCallback)
    }
  },
  modules: {
  }
})
