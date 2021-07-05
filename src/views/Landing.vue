<template>
  <v-container fill-height>
    <v-row align="self-center" dense>
      <v-col><search /></v-col>
    </v-row>
  </v-container>
</template>

<script>
import Search from '@/components/Search.vue';

export default {
  components: {
    Search,
  },
};
</script>