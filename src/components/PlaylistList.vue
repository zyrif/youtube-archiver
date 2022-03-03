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
    this.populateList();
  },
  data: () => ({
    playlists: [],
    retry: false,
  }),
  methods: {
    gotoPlaylist: function (id) {
      this.$router.push(`/playlist/${id}`);
    },
    populateList: function () {
      this.$store.commit('setLoadingDialogVisibility', { value: true });
      this.$store
        .dispatch('fetchPlaylists')
        .then((items) => {
          this.playlists = items;
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 401) {
              this.retryOnce();
            }
          } else {
            this.$store.getters.getErrorDialogRef
              .open({
                errorTitle: error.toJSON().name,
                errorMsg: error.toJSON().message,
                defaultBtnText: 'Retry',
              })
              .then(() => {
                this.populateList();
              });
          }
          console.debug(error);
        })
        .finally(() => {
          this.$store.commit('setLoadingDialogVisibility', { value: false });
        });
    },
    retryOnce: function () {
      if (this.retry) {
        this.$store.getters.getErrorDialogRef.open({
          errorTitle: 'Auth token has expired',
          errorMsg: 'Please re-authenticate',
        });
        return;
      }

      this.$store
        .dispatch('restoreLastUserSession')
        .then(() => {
          this.populateList();
        })
        .finally(() => {
          this.retry = true;
        });
    },
  },
};
</script>

<style>
</style>