import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from "amazon-cognito-identity-js";

const state = () => ({
  // TODO: Move IDs into environment variables
  cognitoUserPool: new CognitoUserPool({
    UserPoolId: "us-east-1_KSHRWs8Ld",
    ClientId: "160p7sjc02ol4en64lq84tkucr",
  }),
  cognitoUser: null,
});

const getters = {
  isLoggedIn(state) {
    // Retuning a function to bypass vuex's getter caching
    // Otherwise returns true evne if .isValid() is false
    return () => {
      if (!state.cognitoUser) {
        return false;
      }

      const session = state.cognitoUser.getSignInUserSession();
      if (!(session && session.isValid())) {
        return false;
      }

      return true;
    };
  },
  idToken(state, getters) {
    return getters.isLoggedIn()
      ? state.cognitoUser.getSignInUserSession().getIdToken().getJwtToken()
      : "";
  },
  accessToken(state, getters) {
    return getters.isLoggedIn()
      ? state.cognitoUser.getSignInUserSession().getAccessToken().getJwtToken()
      : "";
  },
  userEmail(state, getters) {
    return getters.isLoggedIn()
      ? state.cognitoUser.getSignInUserSession().getIdToken().payload.email
      : "N/A";
  },
};

const mutations = {
  setCognitoUser(state, cognitoUser) {
    if (!(cognitoUser instanceof CognitoUser)) {
      throw new Error("Vuex Auth: Invalid Argument passed to setCognitoUser()");
    }
    state.cognitoUser = cognitoUser;
  },
  clearCognitoUser(state) {
    state.cognitoUser = null;
  },
};

const actions = {
  restoreLastUserSession(context) {
    return new Promise((resolve, reject) => {
      // As this action is mainly intended to handle cold starts and page reloads
      // we probably don't need to restore session if cognitoUser is already present
      // since it'll be null in abovementioned situations
      if (context.state.cognitoUser !== null) {
        return resolve(context.state.cognitoUser);
      }

      const cognitoUser = context.state.cognitoUserPool.getCurrentUser();
      if (cognitoUser === null) {
        return reject(
          new Error("Failed to get last logged in user. Please Reauthenticate.")
        );
      }

      context.commit("setCognitoUser", cognitoUser);

      context
        .dispatch("setOrRefreshToken")
        .then((cognitoUser) => {
          resolve(cognitoUser);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  setOrRefreshToken(context) {
    // this action is intended to be called when Access Token is either not set
    // or has expired and needs to be regenerated, so on session restore and
    // maybe before calling protected API methods
    return new Promise((resolve, reject) => {
      // If cognitoUser happens to be null, set it first
      if (context.state.cognitoUser === null) {
        const cognitoUser = context.state.cognitoUserPool.getCurrentUser();
        if (cognitoUser === null) {
          console.error(
            "cognitoUser must not be null. Probably failed to get last logged in user. Authenticate first."
          );
          return reject(
            new Error(
              "Failed to generate access token. Please re-authenticate."
            )
          );
        }
        context.commit("setCognitoUser", cognitoUser);
      }

      context.state.cognitoUser.getSession((error, session) => {
        if (error) {
          context.commit("clearCognitoUser");
          reject(error);
        } else {
          this._vm.$axios.defaults.headers.common["Authorization"] = session
            .getAccessToken()
            .getJwtToken();
          resolve(context.state.cognitoUser);
        }
      });
    });
  },
  authenticateUser(context, { authData, successCallback, errorCallback }) {
    let authDetails = new AuthenticationDetails({
      Username: authData.email,
      Password: authData.password,
    });

    context.commit(
      "setCognitoUser",
      new CognitoUser({
        Username: authData.email,
        Pool: context.state.cognitoUserPool,
      })
    );

    context.state.cognitoUser.authenticateUser(authDetails, {
      onSuccess: (result) => {
        this._vm.$axios.defaults.headers.common["Authorization"] = result
          .getAccessToken()
          .getJwtToken();
        successCallback(result);
      },
      onFailure: errorCallback,
    });
  },
  confirmRegistration(context, { code, resultCallback }) {
    context.state.cognitoUser.confirmRegistration(code, true, resultCallback);
  },
  resendConfirmationCode(context, resultCallback) {
    context.state.cognitoUser.resendConfirmationCode(resultCallback);
  },
  forgotPassword(context, { email, successCallback, errorCallback }) {
    context.commit(
      "setCognitoUser",
      new CognitoUser({
        Username: email,
        Pool: context.state.cognitoUserPool,
      })
    );

    context.state.cognitoUser.forgotPassword({
      onSuccess: successCallback,
      onFailure: errorCallback,
    });
  },
  confirmPassword(
    context,
    { email, code, newPassword, successCallback, errorCallback }
  ) {
    context.commit(
      "setCognitoUser",
      new CognitoUser({
        Username: email,
        Pool: context.state.cognitoUserPool,
      })
    );

    context.state.cognitoUser.confirmPassword(code, newPassword, {
      onSuccess: successCallback,
      onFailure: errorCallback,
    });
  },
  signUp(context, { email, password, resultCallback }) {
    context.state.cognitoUserPool.signUp(
      email,
      password,
      null,
      null,
      resultCallback
    );
  },
  signOut(context, resultCallback) {
    context.state.cognitoUser.signOut((error) => {
      this._vm.$axios.defaults.headers.common["Authorization"] = "";
      resultCallback(error);
    });
  },
};

export default {
  namespaced: false, // TODO: set this to true after fixing mapping functions
  state,
  getters,
  mutations,
  actions,
};
