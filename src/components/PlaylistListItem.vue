<template>
  <v-card
    v-ripple
    class="elevation-4 ma-2"
    :class="hover ? 'grey' : 'white'"
    width="100%"
  >
    <v-card-title>{{ item.title }}</v-card-title>
    <v-card-text>
      <v-row class="mx-1" align="center" justify="start">
        <p class="text-subtitle-2">{{ item.channel }}</p>
      </v-row>
      <v-row class="mx-1" align="center" justify="start">
        <p class="text-subtitle-2">{{ item.dateUploaded }}</p>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ['hover', 'item'],
};
</script>

<style>
</style>