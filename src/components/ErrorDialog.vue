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
        <div v-if="options.actionable" style="display: contents">
          <v-btn color="grey darken-1" text v-on:click="no()">
            {{ options.cancelBtnText }}
          </v-btn>
          <v-btn color="blue darken-1" text v-on:click="yes()">
            {{ options.actionBtnText }}
          </v-btn>
        </div>
        <div v-else style="display: contents">
          <v-btn color="blue darken-1" text v-on:click="no()">
            {{ options.defaultBtnText }}
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ErrorDialog',
  props: {
    actionable: {
      type: Boolean,
      default: false,
    },
    actionBtnText: {
      type: String,
      default: 'Retry',
    },
  },
  data() {
    return {
      dialog: false,

      options: {
        width: 400,
        zIndex: 200,
        errorTitle: 'Avast!',
        errorMsg: 'An error has occured',
        defaultBtnText: 'Okay',
        actionable: this.actionable,
        actionBtnText: this.actionBtnText,
        cancelBtnText: 'Cancel',
      },

      resolve: null,
      reject: null,
    };
  },
  methods: {
    open(options) {
      this.dialog = true;
      this.options = Object.assign(this.options, options);

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
