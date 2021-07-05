<template>
  <v-container fill-height>
    <v-row align="center" dense>
      <v-col><search /></v-col>
    </v-row>
  </v-container>
</template>

<script>
import Search from '@/components/SearchCard.vue';

export default {
  components: {
    Search,
  },
};
</script>