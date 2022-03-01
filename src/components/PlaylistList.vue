<template>
  <div style="display: contents;">
    <v-row>
      <p class="text-h3 ma-2">Playlists</p>
    </v-row>
    <v-row>
      <v-hover v-for="item in playlists" :key="item['playlist_id']" v-slot="{ hover }">
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
  methods: {
    gotoPlaylist: function (id) {
      this.$router.push(`/playlist/${id}`);
    },
  },
};
</script>

<style>
</style>