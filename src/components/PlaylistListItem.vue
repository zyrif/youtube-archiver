<template>
  <v-card
    class="ma-2"
    :class="hover ? 'red elevation-2' : 'grey lighten-2 elevation-0'"
    :ripple="false"
    width="100%"
    @click="$emit('playlist-selected', item['playlist_id'])"
  >
    <v-card-title>{{ item['title'] }} </v-card-title>
    <v-card-text>
      <v-row class="mx-1" align="center" justify="start">
        <p class="text-subtitle-2">
          {{ item['uploader'] }}
        </p>
      </v-row>
      <v-row class="mx-1" align="center" justify="start">
        <p class="text-subtitle-2">
          Available Videos:
          {{ item['num_of_videos'] }}
        </p>
      </v-row>
      <v-row class="mx-1" align="center" justify="start">
        <p class="text-subtitle-2">
          Tracked Videos:
          {{ item['num_of_videos'] }}
        </p>
      </v-row>
      <v-row class="mx-1" align="center" justify="start">
        <p class="text-subtitle-2">
          Total Views:
          {{ item['views'] }}
        </p>
      </v-row>
      <v-row class="mx-1" align="end" justify="start">
        <p class="text-subtitle-2">
          Last Updated:
          {{ item['last_updated'] }}
        </p>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ['hover', 'item'],
  computed: {
    numOfVideosDeleted: function () {
      return this.numOfVideosTracked - this.numOfVideos;
    },
  },
};
</script>

<style>
</style>