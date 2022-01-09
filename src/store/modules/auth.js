import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js'

const state = () => ({
  // TODO: Move IDs into environment variables
  cognitoUserPool: new CognitoUserPool({
    UserPoolId: 'us-east-1_FyylEMoPZ',
    ClientId: '6f22i7vfekvlut67n7t2b94suj'
  }),
  cognitoUser: null,
})

const getters = {
  isLoggedIn(state, getters) {
    return getters.accessToken !== '' ? true : false
  },
  idToken(state) {
    if (!state.cognitoUser || !state.cognitoUser.getSignInUserSession()) {
      return ''
    }
    return state.cognitoUser.getSignInUserSession().getIdToken().getJwtToken()
  },
  accessToken(state) {
    if (!state.cognitoUser || !state.cognitoUser.getSignInUserSession()) {
      return ''
    }
    return state.cognitoUser.getSignInUserSession().getAccessToken().getJwtToken()
  },
}

const mutations = {
  setUser(state, { email }) {
    state.cognitoUser = new CognitoUser({
      Username: email,
      Pool: state.cognitoUserPool,
    })
  },
}

const actions = {
  authenticateUser(context, { authData, successCallback, errorCallback }) {
    let authDetails = new AuthenticationDetails({
      Username: authData.email,
      Password: authData.password,
    })

    context.commit('setUser', authData)

    context.state.cognitoUser.authenticateUser(authDetails, {
      onSuccess: (result) => {
        this._vm.$axios.defaults.headers.common['Authorization'] = result.getIdToken().getJwtToken()
        successCallback(result)
      },
      onFailure: errorCallback,
    })
  },
  confirmRegistration(context, { code, resultCallback }) {
    context.state.cognitoUser.confirmRegistration(code, true, resultCallback)
  },
  signUp(context, { email, password, resultCallback }) {
    context.state.cognitoUserPool.signUp(email, password, null, null, resultCallback)
  },
  signOut(context, resultCallback) {
    context.state.cognitoUser.signOut((error) => {
      this._vm.$axios.defaults.headers.common['Authorization'] = ''
      resultCallback(error)
    })
  }
}

export default {
  namespaced: false, // TODO: set this to true after fixing mapping functions
  state,
  getters,
  mutations,
  actions,
}