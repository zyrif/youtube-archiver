<template>
  <v-container>
    <v-breadcrumbs :items="breadcrumbs" />
    <v-row>
      <p class="text-h3 ma-2">Videos</p>
    </v-row>
    <playlist-list :videos="videos" />
  </v-container>
</template>

<script>
import PlaylistList from '../components/PlaylistList.vue';
export default {
  components: { PlaylistList },
  data: () => ({
    videos: [
      {
        title: 'Levitating Barbecue! Electromagnetic Induction',
        channel: 'Veritasium',
        dateUploaded: 'Oct 9, 2012',
        duration: '3:45',
        views: '2294421',
        likes: '35932',
        dislikes: '280',
        videoID: 'txmKr69jGBk',
      },
      {
        title: 'What\'s In A Candle Flame?',
        channel: 'Veritasium',
        dateUploaded: 'Sep 12, 2012',
        duration: '3:45',
        views: '2294421',
        likes: '35932',
        dislikes: '280',
        videoID: 'txmKr69jGBk',
      },
      {
        title: 'Make Plasma With Grapes In The Microwave!',
        channel: 'Veritasium',
        dateUploaded: 'Oct 9, 2012',
        duration: '3:45',
        views: '2294421',
        likes: '35932',
        dislikes: '280',
        videoID: 'txmKr69jGBk',
      },
      {
        title: 'Making SOLID Nitrogen!',
        channel: 'Veritasium',
        dateUploaded: 'Oct 9, 2012',
        duration: '3:45',
        views: '2294421',
        likes: '35932',
        dislikes: '280',
        videoID: 'txmKr69jGBk',
      },
      {
        title: 'Imploding Drum',
        channel: 'Veritasium',
        dateUploaded: 'Oct 9, 2012',
        duration: '3:45',
        views: '2294421',
        likes: '35932',
        dislikes: '280',
        videoID: 'txmKr69jGBk',
      },
      {
        title: 'Fire Syringe',
        channel: 'Veritasium',
        dateUploaded: 'Oct 9, 2012',
        duration: '3:45',
        views: '2294421',
        likes: '35932',
        dislikes: '280',
        videoID: 'txmKr69jGBk',
      },
      {
        title: 'Chain Drop Experiment',
        channel: 'Veritasium',
        dateUploaded: 'Oct 9, 2012',
        duration: '3:45',
        views: '2294421',
        likes: '35932',
        dislikes: '280',
        videoID: 'txmKr69jGBk',
      },
      {
        title: 'Chain Drop Answer 2',
        channel: 'Veritasium',
        dateUploaded: 'Oct 9, 2012',
        duration: '3:45',
        views: '2294421',
        likes: '35932',
        dislikes: '280',
        videoID: 'txmKr69jGBk',
      },
      {
        title: 'Supercooled Water - Explained!',
        channel: 'Veritasium',
        dateUploaded: 'Oct 9, 2012',
        duration: '3:45',
        views: '2294421',
        likes: '35932',
        dislikes: '280',
        videoID: 'txmKr69jGBk',
      },
      {
        title: 'Persistence Of Vision',
        channel: 'Veritasium',
        dateUploaded: 'Oct 9, 2012',
        duration: '3:45',
        views: '2294421',
        likes: '35932',
        dislikes: '280',
        videoID: 'txmKr69jGBk',
      },
      {
        title: 'Can You Solve This Shadow Illusion?',
        channel: 'Veritasium',
        dateUploaded: 'Oct 9, 2012',
        duration: '3:45',
        views: '2294421',
        likes: '35932',
        dislikes: '280',
        videoID: 'txmKr69jGBk',
      },
      {
        title: 'Why Is Ice Slippery?',
        channel: 'Veritasium',
        dateUploaded: 'Oct 9, 2012',
        duration: '3:45',
        views: '2294421',
        likes: '35932',
        dislikes: '280',
        videoID: 'txmKr69jGBk',
      },
      {
        title: 'Does Pressure Melt Ice?',
        channel: 'Veritasium',
        dateUploaded: 'Oct 9, 2012',
        duration: '3:45',
        views: '2294421',
        likes: '35932',
        dislikes: '280',
        videoID: 'txmKr69jGBk',
      },
      {
        title: 'Ice Cutting Experiment',
        channel: 'Veritasium',
        dateUploaded: 'Oct 9, 2012',
        duration: '3:45',
        views: '2294421',
        likes: '35932',
        dislikes: '280',
        videoID: 'txmKr69jGBk',
      },
      {
        title: 'Misconceptions About Heat',
        channel: 'Veritasium',
        dateUploaded: 'Oct 9, 2012',
        duration: '3:45',
        views: '2294421',
        likes: '35932',
        dislikes: '280',
        videoID: 'txmKr69jGBk',
      },
      {
        title: 'Galileo the Scientific Parrot',
        channel: 'Veritasium',
        dateUploaded: 'Oct 9, 2012',
        duration: '3:45',
        views: '2294421',
        likes: '35932',
        dislikes: '280',
        videoID: 'txmKr69jGBk',
      },
    ],
  }),
  computed: {
    breadcrumbs: function () {
      return this.$route.meta.breadCrumbs;
    }
  }
};
</script>

<style scoped>
.v-breadcrumbs {
  padding-left: 0 !important;
}
.v-breadcrumbs {
  padding-left: 0 !important;
}
</style>