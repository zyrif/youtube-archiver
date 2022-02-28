<template>
  <v-container>
    <v-breadcrumbs :items="breadcrumbs" />
    <v-row>
      <p class="text-h3 ma-2">Playlists</p>
    </v-row>
    <dashboard-list :items="playlists" />
  </v-container>
</template>

<script>
import DashboardList from '../components/DashboardList.vue';
export default {
  components: { DashboardList },
  mounted: function () {
    if (this.playlists.length < 1) {
      this.$axios
        .get('/playlists/')
        .then((response) => {
          if (response.status === 200) {
            if (Array.isArray(response.data)) {
              this.playlists = response.data
            } else {
              // TODO: Better error alerting
              console.error("Expected array from from /playlists/ api response data")
              console.log(response.data)
            }
          }
        })
        .catch((error) => {
          console.error('Error while fetching playlists');
          console.log(error);
        });
    }
  },
  data: () => ({
    playlists: [],
  }),
  computed: {
    breadcrumbs: function () {
      return this.$route.meta.breadCrumbs;
    },
  },
};
</script>

<style scoped>
.v-breadcrumbs {
  padding-left: 0 !important;
}
</style>