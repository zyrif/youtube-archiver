<template>
  <v-card class="elevation-2" min-width="360px" max-width="460px">
    <v-toolbar color="grey lighten-2" flat>
      <v-toolbar-title>
        {{ isSigningUp ? 'Sign Up' : 'Log In' }}
      </v-toolbar-title>
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
import axios from 'axios';
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
          ) || 'Email must be valid',
        password: (value) =>
          (value.length >= 6 && value.length <= 32) ||
          'Password must be at least 6 characters and at most 32 characters',
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
    ...mapGetters(['authToken']),
  },
  methods: {
    doAuthAction() {
      if (
        (!this.isSigningUp && this.email && this.password) ||
        (this.isSigningUp &&
          this.email &&
          this.password &&
          this.passwordConfirm)
      ) {
        this.btnIsLoading = true;

        axios
          .post(this.apiAuthTokenUrl, {
            email: this.email,
            password: this.password,
          })
          .then((response) => {
            if (response.status === 200) {
              this.btnIsLoading = false;
              this.setAuthToken({ token: response.data.token });
              this.setLoginState({ state: true });
              // console.log(this.$store.state.isLoggedIn)
              this.$router.replace('/');
            }
          })
          .catch((error) => {
            if (!error.status && error.message === 'Network Error') {
              this.btnIsLoading = false;
              this.btnMessage = 'NETWORK OR API ERROR';
            } else if (error.response && error.response.status === 400) {
              this.btnIsLoading = false;
              this.btnMessage = 'INVALID CREDENTIALS';
            } else if (
              error.response &&
              error.response.status > 400 &&
              error.response.status <= 599
            ) {
              this.btnIsLoading = false;
              this.btnMessage = 'API ERROR';
            } else {
              this.btnIsLoading = false;
              this.btnMessage = 'ERROR';

              // TODO: Remove debug info
              console.info(error.message);
            }
          });
      } else {
        let fields = ['email', 'password'];
        if (this.isSigningUp) fields.push('password-confirm');
        fields.forEach(value => {
          this.$refs[value].validate(true);
        })
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
    ...mapMutations(['setAuthToken']),
  },
};
</script>

<style scoped>
.v-dialog > .v-card > .v-card__text {
  padding: 20px 24px 12px;
}
</style>