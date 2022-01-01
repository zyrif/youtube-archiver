<template>
  <v-card class="elevation-2" min-width="360px" max-width="460px">
    <v-toolbar color="grey lighten-2" flat>
      <v-toolbar-title>
        {{ isSigningUp ? 'Sign Up' : 'Log In' }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn text @click="toggleForm">
        {{ isSigningUp ? 'Log In' : 'Sign Up' }}
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-form>
        <v-text-field
          ref="email"
          v-model="email"
          :rules="[rules.required, rules.email]"
          label="Email"
          type="email"
          outlined
        />

        <v-text-field
          ref="password"
          v-model="password"
          :rules="[rules.required, rules.password]"
          label="Password"
          type="password"
          outlined
          v-on:keydown="clickLoginBtn"
        />

        <v-text-field
          v-if="isSigningUp"
          ref="password-confirm"
          v-model="passwordConfirm"
          :rules="[rules.required, rules.password]"
          label="Confirm Password"
          type="password"
          outlined
          v-on:keydown="clickSignupBtn"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        ref="actionBtn"
        class="mb-2 white--text"
        depressed
        block
        large
        v-bind="btnOptions"
        v-on:click="doAuthAction"
      >
        {{ btnMessage }}
      </v-btn>
      <v-spacer />
    </v-card-actions>
  </v-card>
</template>

<script>
// import axios from 'axios';
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';

import { mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return {
      isSigningUp: false,

      email: '',
      password: '',
      passwordConfirm: '',

      btnEnabled: true,
      btnIsLoading: false,
      btnDefaultColor: 'red',
      btnErrorMessage: '',

      rules: {
        required: (value) => !!value || 'Value Required',
        email: (value) =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            value
          ) || 'Must be a valid email address',
        password: (value) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\^$*.[\]{}()?\-"!@#%&/\\,><':;|_~`+=])[A-Za-z\d^$*.[\]{}()?\-"!@#%&/\\,><':;|_~`+=]{8,}$/.test(
            value
          ) ||
          'Must have at least 8 characters including at least 1 number, 1 special character, 1 lowercase letter and 1 uppercase letter',
        confirmPassword: (value) => (value === this.password) || 'Passwords don\'t match'
      },
    };
  },
  computed: {
    btnColor: {
      get() {
        return this.btnErrorMessage === '' ? this.btnDefaultColor : 'error';
      },
    },
    btnMessage: {
      get() {
        if (this.btnErrorMessage === '') {
          return this.isSigningUp ? 'Sign Up' : 'Log In';
        } else {
          return this.btnErrorMessage;
        }
      },
      set(value) {
        this.btnErrorMessage = value;
        setTimeout(() => {
          this.btnErrorMessage = '';
        }, 5000);
      },
    },
    btnOptions() {
      const options = {
        loading: this.btnIsLoading,
        disabled: !this.btnEnabled,
        color: this.btnColor,
        outlined: this.btnColor === this.btnDefaultColor,
      };
      return options;
    },

    // map vuex getters
    ...mapGetters(['user']),
  },
  mounted: function () {
    //
  },
  methods: {
    toggleForm() {
      this.isSigningUp = !this.isSigningUp;
    },
    doAuthAction() {
      if (!this.isSigningUp && this.email && this.password) {
        // console.error('login is unimplemented');
        this.btnIsLoading = true;

        let poolData = {
          UserPoolId: 'us-east-1_zw36Y5Lit',
          ClientId: '5o54dn7u30p0mmstn4orljlip5',
        };
        let userPool = new CognitoUserPool(poolData);
        let cognitoUser = new CognitoUser({
          Username: this.email,
          Pool: userPool,
        });

        let authDetails = new AuthenticationDetails({
          Username: this.email,
          Password: this.password
        })

        cognitoUser.authenticateUser(authDetails, {
          onSuccess: result => {
            console.log("SUCCESS!");
            console.debug(result);
          },
          onFailure: error => {
            console.log("ERROR!");
            console.log(error);
          }
        });

        this.btnIsLoading = false;

      } else if (
        this.isSigningUp &&
        this.email &&
        this.password &&
        this.passwordConfirm
      ) {
        this.btnIsLoading = true;

        let poolData = {
          UserPoolId: 'us-east-1_zw36Y5Lit',
          ClientId: '5o54dn7u30p0mmstn4orljlip5',
        };

        let userPool = new CognitoUserPool(poolData);

        userPool.signUp(this.email, this.password, null, null, (err, res) => {
          if (err) {
            console.log('callback error: ' + err);
          }
          let user = res.user;
          this.setUser({ user: user });
          console.log('username: ' + user.getUsername());
          this.btnIsLoading = false;
        });
        // axios
        //   .post(this.apiAuthTokenUrl, {
        //     email: this.email,
        //     password: this.password,
        //   })
        //   .then((response) => {
        //     if (response.status === 200) {
        //       this.btnIsLoading = false;
        //       this.setAuthToken({ token: response.data.token });
        //       this.setLoginState({ state: true });
        //       // console.log(this.$store.state.isLoggedIn)
        //       this.$router.replace('/');
        //     }
        //   })
        //   .catch((error) => {
        //     if (!error.status && error.message === 'Network Error') {
        //       this.btnIsLoading = false;
        //       this.btnMessage = 'NETWORK OR API ERROR';
        //     } else if (error.response && error.response.status === 400) {
        //       this.btnIsLoading = false;
        //       this.btnMessage = 'INVALID CREDENTIALS';
        //     } else if (
        //       error.response &&
        //       error.response.status > 400 &&
        //       error.response.status <= 599
        //     ) {
        //       this.btnIsLoading = false;
        //       this.btnMessage = 'API ERROR';
        //     } else {
        //       this.btnIsLoading = false;
        //       this.btnMessage = 'ERROR';

        //       // TODO: Remove debug info
        //       console.info(error.message);
        //     }
        //   });
      } else {
        let fields = ['email', 'password'];
        if (this.isSigningUp) fields.push('password-confirm');
        fields.forEach((value) => {
          this.$refs[value].validate(true);
        });
      }
    },
    clickLoginBtn(keyevent) {
      if (!this.isSigningUp && keyevent.key === 'Enter') {
        this.$refs.actionBtn.$el.click();
      }
    },
    clickSignupBtn(keyevent) {
      if (this.isSigningUp && keyevent.key === 'Enter') {
        this.$refs.actionBtn.$el.click();
      }
    },

    // map vuex Mutations
    ...mapMutations(['setUser']),
  },
};
</script>

<style scoped>
.v-dialog > .v-card > .v-card__text {
  padding: 20px 24px 12px;
}
</style>