<template>
  <v-card
    class="ma-2 grey lighten-2 elevation-0"
    width="100%"
  >
    <v-card-title>{{ item.title }}</v-card-title>
    <v-card-text>
      <v-row class="mx-1" align="center" justify="start">
        <p class="text-subtitle-2">{{ item.uploader }}</p>
      </v-row>
      <v-row class="mx-1" align="center" justify="start">
        <p class="text-subtitle-2">{{ item.dateUploaded }}</p>
      </v-row>
      <v-row class="mx-1" align="center" justify="start">
        <p class="text-subtitle-2">{{ item.length | timeFromSeconds }}</p>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  filters: {
    timeFromSeconds: function (value) {
      if (!value) return '';
      let date = new Date(parseInt(value) * 1000);
      let returnStr = '';
      if (date.getUTCHours > 0)
        returnStr = returnStr + date.getUTCHours() + ':';
      returnStr =
        returnStr +
        date.getMinutes().toString().padStart(2, '0') +
        ':' +
        date.getSeconds().toString().padStart(2, '0');
      return returnStr;
    },
  },
  props: ['hover', 'item'],
};
</script>

<style>
</style>