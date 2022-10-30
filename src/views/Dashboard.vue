<template>
  <v-container>
    <v-breadcrumbs :items="breadcrumbs" />
    <component :is="currentComponent" />
  </v-container>
</template>

<script>
import PlaylistList from "../components/PlaylistList.vue";
import VideoList from "../components/VideoList.vue";
export default {
  components: { PlaylistList, VideoList },
  computed: {
    breadcrumbs: function () {
      return this.$route.meta.breadCrumbs;
    },
    currentComponent: function () {
      switch (this.$route.name) {
        case "Playlists":
          return "PlaylistList";
        case "Videos":
          return "VideoList";
        default:
          // TODO: add a proper 404 component here
          return "PlaylistList";
      }
    },
  },
};
</script>

<style scoped>
.v-breadcrumbs {
  padding-left: 0 !important;
}
</style>
