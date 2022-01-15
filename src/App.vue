<template>
  <v-app>
    <v-app-bar app elevation="0">
      <div class="text-h4" style="cursor: pointer" @click="titleHandler">
        <v-icon left class="pb-1" color="red">fas fa-play</v-icon>
        <span class="red--text">Tube</span>Tracker
      </div>
      <v-spacer />
      <v-btn v-if="!isLoggedIn" text @click.stop="showLoginDialog = true">
        <v-icon left>fas fa-sign-in-alt</v-icon>
        Log In
      </v-btn>
      <div v-else style="display: contents">
        <span> {{ userEmail }} </span>
        <v-btn text @click="logoutHandler()">
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
      <error-dialog ref="refAuthErrorDialog"></error-dialog>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import LoginDialog from './components/LoginCard.vue';
import ErrorDialog from './components/ErrorDialog.vue';

export default {
  name: 'App',

  components: {
    LoginDialog,
    ErrorDialog,
  },

  created: function () {
    this.restoreLastUserSession();
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
    ...mapGetters(['isLoggedIn', 'userEmail']),
  },

  methods: {
    titleHandler: function () {
      this.$router.push('/');
    },
    logoutHandler: function () {
      this.signOut((error) => {
        if (!error) {
          return;
        }
        this.$refs.refAuthErrorDialog.open({
          errorTitle: 'Failed to log you out properly!',
          errorMsg: `Reason: ${error.message}`,
        });
      });
    },
    ...mapActions(['restoreLastUserSession', 'signOut']),
  },
};
</script>
