<template>
  <v-card
    class="ma-2"
    :class="hover ? 'red elevation-2' : 'grey lighten-2 elevation-0'"
    :ripple="false"
    width="100%"
    @click="$emit('playlist-selected', item['id'])"
  >
    <v-card-title>
      {{ item["title"] }}
      <v-spacer />
      <v-btn icon :loading="isDeleteBtnLoading" @click.stop="deleteHandler"
        ><v-icon small> fas fa-trash </v-icon></v-btn
      >
    </v-card-title>
    <v-card-text>
      <v-row class="mx-1" align="center" justify="start">
        <p class="text-subtitle-2">
          {{ item["uploader"] }}
        </p>
      </v-row>
      <v-row class="mx-1" align="center" justify="start">
        <p class="text-subtitle-2">
          Available Videos:
          {{ item["num_of_videos"] }}
        </p>
      </v-row>
      <v-row class="mx-1" align="center" justify="start">
        <p class="text-subtitle-2">
          Tracked Videos:
          {{ item["num_of_videos"] }}
        </p>
      </v-row>
      <v-row class="mx-1" align="center" justify="start">
        <p class="text-subtitle-2">
          Total Views:
          {{ item["views"] }}
        </p>
      </v-row>
      <v-row class="mx-1" align="end" justify="start">
        <p class="text-subtitle-2">
          Last Updated:
          {{ item["last_updated"] }}
        </p>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ["hover", "item"],

  data: function () {
    return {
      isDeleteBtnLoading: false,
    };
  },

  computed: {
    numOfVideosDeleted: function () {
      return this.numOfVideosTracked - this.numOfVideos;
    },
  },

  methods: {
    deleteHandler: function () {
      this.isDeleteBtnLoading = true;
      this.$store
        .dispatch("deletePlaylist", this.item["id"])
        .then(() => {
          console.log("successfully deleted");
        })
        .catch((error) => {
          console.log("error occured");
          console.log(error);
        })
        .finally(() => {
          this.isDeleteBtnLoading = false;
        });
    },
  },
};
</script>

<style></style>
