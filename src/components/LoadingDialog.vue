<template>
  <v-dialog v-model="dialog" hide-overlay persistent width="300">
    <v-card color="red" dark>
      <v-card-text>
        <br />
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  computed: {
    dialog: function () {
      return this.$store.getters.isLoadingDialogVisible;
    },
  },
};
</script>

<style></style>
