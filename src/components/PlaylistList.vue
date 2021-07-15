<template>
  <playlist-list-pagination :items="videos">
    <template v-slot:default="{ item }">
      <v-hover v-slot="{ hover }">
        <playlist-list-item :hover="hover" :item="item" />
      </v-hover>
    </template>
  </playlist-list-pagination>
</template>

<script>
import PlaylistListItem from './PlaylistListItem.vue';
import PlaylistListPagination from './Pagination.vue';
export default {
  components: { PlaylistListItem, PlaylistListPagination },
  props: ['videos'],
};
</script>

<style>
</style>