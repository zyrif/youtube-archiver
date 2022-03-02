<template>
  <div style="display: contents">
    <v-row>
      <p class="text-h3 ma-2">Playlists</p>
    </v-row>
    <v-row>
      <v-hover
        v-for="item in playlists"
        :key="item['playlist_id']"
        v-slot="{ hover }"
      >
        <playlist-list-item
          :hover="hover"
          :item="item"
          @playlist-selected="gotoPlaylist($event)"
        />
      </v-hover>
    </v-row>
  </div>
</template>

<script>
import PlaylistListItem from './PlaylistListItem.vue';
export default {
  components: { PlaylistListItem },
  mounted: function () {
    this.$store.commit('setLoadingDialogVisibility', { value: true });
    this.$store
      .dispatch('fetchPlaylists')
      .then((items) => {
        this.playlists = items;
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        this.$store.commit('setLoadingDialogVisibility', { value: false });
      });
  },
  data: () => ({
    playlists: [],
  }),
  methods: {
    gotoPlaylist: function (id) {
      this.$router.push(`/playlist/${id}`);
    },
  },
};
</script>

<style>
</style>