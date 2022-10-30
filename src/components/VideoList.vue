<template>
  <div style="display: contents">
    <v-row>
      <p class="text-h3 ma-2">Videos</p>
    </v-row>
    <video-list-pagination :items="videos">
      <template v-slot:default="{ item }">
        <v-hover v-slot="{ hover }">
          <video-list-item :hover="hover" :item="item" />
        </v-hover>
      </template>
    </video-list-pagination>
  </div>
</template>

<script>
import VideoListItem from "./VideoListItem.vue";
import VideoListPagination from "./Pagination.vue";
export default {
  components: { VideoListItem, VideoListPagination },
  mounted: function () {
    this.populateList();
  },
  data: () => ({
    videos: [],
  }),
  methods: {
    populateList: function () {
      this.$store.commit("setLoadingDialogVisibility", { value: true });
      this.$store
        .dispatch("fetchVideos", this.$route.params.id)
        .then((videos) => {
          this.videos = videos;
        })
        .catch((error) => {
          this.$store.getters.getErrorDialogRef
            .open({
              errorTitle: error.toJSON ? error.toJSON().name : error.name,
              errorMsg: error.toJSON ? error.toJSON().message : error.message,
            })
            .then(() => {
              this.$router.replace("/");
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
