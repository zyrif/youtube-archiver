<template>
  <v-container fill-height>
    <v-row align="self-end" dense>
      <search> </search>
    </v-row>
    <v-row align="self-start" dense>
      <v-spacer></v-spacer>
      <v-col style="text-align: center"> </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</template>

<script>
import Search from "@/components/Search.vue";

export default {
  components: {
    Search,
  },
};
</script>