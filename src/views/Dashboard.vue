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
  data: () => ({
    playlists: [
      {
        id: 'PLAB27A3C12C31E663',
        title: 'Inertia',
        channel: 'Veritasium',
        numOfVideos: 8,
        numOfVideosTracked: 8,
        lastChecked: new Date('2021-06-21'),
      },
      {
        id: 'PL772556F1EFC4D01C',
        title: 'Misconceptions',
        channel: 'Veritasium',
        numOfVideos: 33,
        numOfVideosTracked: 33,
        lastChecked: new Date('2021-06-21'),
      },
      {
        id: 'FLHnyfMqiRRG1u-2MsSQLbXA',
        title: 'Favourites',
        channel: 'Veritasium',
        numOfVideos: 26,
        numOfVideosTracked: 26,
        lastChecked: new Date('2021-06-21'),
      },
      {
        id: 'PL67A3EFF8267A8DF9',
        title: 'Radiation',
        channel: 'Veritasium',
        numOfVideos: 5,
        numOfVideosTracked: 5,
        lastChecked: new Date('2021-06-21'),
      },
      {
        id: 'PLAC555EC7D3D0F4AA',
        title: 'Science Experiments!',
        channel: 'Veritasium',
        numOfVideos: 19,
        numOfVideosTracked: 19,
        lastChecked: new Date('2021-06-21'),
      },
    ],
  }),
  computed: {
    breadcrumbs: function () {
      return this.$route.meta.breadCrumbs;
    }
  }
};
</script>

<style scoped>
.v-breadcrumbs {
  padding-left: 0 !important;
}
</style>