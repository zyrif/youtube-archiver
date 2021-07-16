<template>
  <v-card
    class="ma-2"
    :class="hover ? 'red elevation-2' : 'grey lighten-2 elevation-0'"
    :ripple="false"
    width="100%"
    @click="$emit('playlist-selected', item.id)"
  >
    <v-card-title>{{ item.title }} </v-card-title>
    <v-card-text>
      <v-row class="mx-1" align="center" justify="start">
        <p class="text-subtitle-2">
          {{ item.channel }}
        </p>
      </v-row>
      <v-row class="mx-1" align="center" justify="start">
        <p class="text-subtitle-2">
          Available Videos:
          {{ item.numOfVideos }}
        </p>
      </v-row>
      <v-row class="mx-1" align="center" justify="start">
        <p class="text-subtitle-2">
          Tracked Videos:
          {{ item.numOfVideosTracked }}
        </p>
      </v-row>
      <v-row class="mx-1" align="end" justify="end">
        <p class="text-subtitle-2">
          {{ item.lastChecked }}
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