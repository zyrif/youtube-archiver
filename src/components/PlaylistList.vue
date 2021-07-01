<template>
  <v-row>
    <v-hover v-for="item in videos" :key="item.dateUploaded" v-slot="{ hover }">
      <playlist-list-item :hover="hover" :item="item" />
    </v-hover>
  </v-row>
</template>

<script>
import PlaylistListItem from './PlaylistListItem.vue';
export default {
  components: { PlaylistListItem },
  props: ['videos'],
};
</script>

<style>
</style>