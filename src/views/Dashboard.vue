<template>
  <v-container>
    <v-row>
      <p class="text-h3 ma-2">Playlists:</p>
    </v-row>
    <v-row>
      <v-hover
        v-for="item in playlists"
        :key="item.lastChecked"
        v-slot="{ hover }"
      >
        <v-card
          v-ripple
          class="elevation-4 ma-2"
          :class="hover ? 'red' : 'white'"
          width="100%"
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
      </v-hover>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    playlists: [
      {
        title: 'Inertia',
        channel: 'Veritasium',
        numOfVideos: 8,
        numOfVideosTracked: 8,
        lastChecked: new Date('2021-06-21'),
      },
      {
        title: 'Misconceptions',
        channel: 'Veritasium',
        numOfVideos: 33,
        numOfVideosTracked: 33,
        lastChecked: new Date('2021-06-21'),
      },
      {
        title: 'Favourites',
        channel: 'Veritasium',
        numOfVideos: 26,
        numOfVideosTracked: 26,
        lastChecked: new Date('2021-06-21'),
      },
      {
        title: 'Radiation',
        channel: 'Veritasium',
        numOfVideos: 5,
        numOfVideosTracked: 5,
        lastChecked: new Date('2021-06-21'),
      },
      {
        title: 'Science Experiments!',
        channel: 'Veritasium',
        numOfVideos: 19,
        numOfVideosTracked: 19,
        lastChecked: new Date('2021-06-21'),
      },
    ],
  }),
  computed: {
    numOfVideosDeleted: function () {
      return this.numOfVideosTracked - this.numOfVideos;
    },
  },
};
</script>

<style>
</style>