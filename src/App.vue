<template>
  <v-app>
    <v-app-bar app elevation="0">
      <div class="text-h4" style="cursor: pointer" @click="titleHandler">
        <v-icon left class="pb-1" color="red">fas fa-play</v-icon>
        <span class="red--text">Tube</span>Tracker
      </div>
      <v-spacer />
      <v-btn
        v-if="!isLoggedIn()"
        :loading="isLoginButtonLoading"
        text
        @click.stop="showLoginDialog = true"
      >
        <v-icon left>fas fa-sign-in-alt</v-icon>
        Log In
      </v-btn>
      <div v-else style="display: contents">
        <span style="cursor: pointer" @click="profileHandler()">
          {{ userEmail }}
        </span>
        <v-btn :loading="isLoginButtonLoading" text @click="logoutHandler()">
          <v-icon left>fas fa-sign-out-alt</v-icon>
          Log Out
        </v-btn>
      </div>
    </v-app-bar>

    <v-main>
      <router-view />
      <v-dialog v-model="showLoginDialog" max-width="460px">
        <login-dialog @closeLoginDialog="showLoginDialog = false" />
      </v-dialog>
      <error-dialog ref="refErrorDialog"></error-dialog>
      <loading-dialog></loading-dialog>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import LoginDialog from './components/LoginCard.vue';
import ErrorDialog from './components/ErrorDialog.vue';
import LoadingDialog from './components/LoadingDialog.vue';

export default {
  name: 'App',

  components: {
    LoginDialog,
    ErrorDialog,
    LoadingDialog,
  },

  created: function () {
    this.setLoginButtonLoadingState({ value: true });
    this.restoreLastUserSession()
      .catch((error) => {
        console.debug(error);
        if (this.$route.name !== 'Home') {
          this.$router.replace('/');
        }
      })
      .finally(() => {
        this.setLoginButtonLoadingState({ value: false });
      });
  },

  mounted: function () {
    this.setErrorDialogRef({ value: this.$refs.refErrorDialog });
  },

  computed: {
    showLoginDialog: {
      get: function () {
        return this.$store.getters.isLoginDialogVisible;
      },
      set: function (value) {
        this.$store.commit('setLoginDialogVisibility', { value });
      },
    },
    ...mapGetters([
      'isLoggedIn',
      'userEmail',
      'isLoginButtonLoading',
      'getErrorDialogRef',
    ]),
  },

  methods: {
    titleHandler: function () {
      this.$router.push('/');
    },
    profileHandler: function () {
      this.$router.push('/playlists');
    },
    logoutHandler: function () {
      this.setLoginButtonLoadingState({ value: true });
      this.signOut((error) => {
        this.setLoginButtonLoadingState({ value: false });
        if (!error) {
          if (this.$route.name !== 'Home') {
            this.$router.replace('/');
          }
          return;
        }
        this.$refs.refErrorDialog.open({
          errorTitle: 'Failed to log you out properly!',
          errorMsg: `Reason: ${error.message}`,
        });
      });
    },
    ...mapMutations(['setLoginButtonLoadingState', 'setErrorDialogRef']),
    ...mapActions(['restoreLastUserSession', 'signOut']),
  },
};
</script>
