<template>
  <v-row>
    <slot v-for="item in getPaginatedItems" :item="item"></slot>
    <v-col v-if="itemsNotEmpty" class="text-center" cols="12">
      <v-btn fab small @click="prevPage()">
        <v-icon> fas fa-angle-left </v-icon>
      </v-btn>
      <span class="px-4"> {{ page }} of {{ totalPages }} </span>
      <v-btn fab small @click="nextPage()">
        <v-icon> fas fa-angle-right </v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { drop } from "lodash";
export default {
  props: { items: Array },
  data: () => ({
    page: 1,
    pageSize: 4,
  }),
  computed: {
    itemsNotEmpty: function () {
      return this.items.length > 0;
    },
    totalPages: function () {
      return !this.items.length
        ? 1
        : Math.ceil(this.items.length / this.pageSize);
    },
    getPaginatedItems: function () {
      let offset = (this.page - 1) * this.pageSize;
      return drop(this.items, offset).slice(0, this.pageSize);
    },
  },
  methods: {
    nextPage: function () {
      if (this.page + 1 <= this.totalPages) {
        this.page += 1;
      }
    },
    prevPage: function () {
      if (this.page - 1 >= 1) {
        this.page -= 1;
      }
    },
  },
};
</script>

<style></style>
