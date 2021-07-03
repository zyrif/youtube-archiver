<template>
  <v-app>
    <v-app-bar app elevation="0">
      <div class="text-h4" @click="titleHandler">
        <v-icon left class="pb-1" color="red">fas fa-play</v-icon>
        <span class="red--text">Tube</span>Tracker
      </div>
      <v-spacer />
      <v-btn text @click.stop="showLoginDialog = true">
        <v-icon left>fas fa-sign-in-alt</v-icon>
        Log In
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
      <v-dialog v-model="showLoginDialog">
        <login />
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import Login from './components/LoginForm.vue';

export default {
  name: 'App',

  components: {
    Login,
  },

  data: () => ({
    showLoginDialog: false,
  }),

  methods: {
    titleHandler: function () {
      this.$router.push('/');
    },
  },
};
</script>
