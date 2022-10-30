<template>
  <div style="display: contents">
    <v-row>
      <p class="text-h3 ma-2">Playlists</p>
    </v-row>
    <v-row>
      <v-hover v-for="item in playlists" :key="item['id']" v-slot="{ hover }">
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
import PlaylistListItem from "./PlaylistListItem.vue";
export default {
  components: { PlaylistListItem },

  mounted: function () {
    this.populateList();
  },

  computed: {
    playlists: function () {
      return this.$store.getters["getPlaylists"];
    },
  },

  methods: {
    gotoPlaylist: function (id) {
      this.$router.push(`/playlist/${id}`);
    },

    populateList: function () {
      this.$store.commit("setLoadingDialogVisibility", { value: true });
      this.$store
        .dispatch("fetchPlaylists")
        .catch((error) => {
          const networkError = error.message === "Network Error";
          this.$store.getters.getErrorDialogRef
            .open({
              errorTitle: error.toJSON ? error.toJSON().name : error.name,
              errorMsg: error.toJSON ? error.toJSON().message : error.message,
              defaultBtnText: networkError ? "Retry" : "Okay",
            })
            .then(() => {
              networkError ? this.populateList() : this.$router.replace("/");
            });
        })
        .finally(() => {
          this.$store.commit("setLoadingDialogVisibility", { value: false });
        });
    },
  },
};
</script>

<style></style>
