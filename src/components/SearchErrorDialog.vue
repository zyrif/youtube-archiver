<template>
  <v-dialog
    v-model="dialog"
    persistent
    v-bind:width="options.width"
    v-bind:style="{ zIndex: options.zIndex }"
  >
    <v-card>
      <v-card-title class="text-h5">
        {{ options.errorTitle }}
      </v-card-title>
      <v-card-text>
        {{ options.errorMsg }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="grey darken-1" text v-on:click="no()"> Cancel </v-btn>
        <v-btn color="blue darken-1" text v-on:click="yes()"> Retry </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ErrorDialog',
  data() {
    return {
      dialog: false,
      options: {
        width: 400,
        zIndex: 200,
      },

      resolve: null,
      reject: null,
    };
  },
  methods: {
    open(options) {
      this.dialog = true;
      this.options = Object.assign(this.options, options);
      if (!('errorTitle' in this.options)) {
        this.options["errorTitle"] = 'Generic Error';
      }
      if (!('errorMsg' in this.options)) {
        this.options["errorMsg"] = 'An error occured';
      }
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    yes() {
      this.resolve(true);
      this.dialog = false;
    },
    no() {
      this.resolve(false);
      this.dialog = false;
    },
  },
};
</script>
