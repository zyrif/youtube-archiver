<template>
  <v-row>
    <v-hover v-for="item in items" :key="item.id" v-slot="{ hover }">
      <dashboard-list-item
        :hover="hover"
        :item="item"
        @playlist-selected="gotoPlaylist($event)"
      />
    </v-hover>
  </v-row>
</template>

<script>
import DashboardListItem from './DashboardListItem.vue';
export default {
  components: { DashboardListItem },
  props: ['items'],
  methods: {
    gotoPlaylist: function (id) {
      this.$router.push(`/playlist/${id}`);
    },
  },
};
</script>

<style>
</style>