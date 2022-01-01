<template>
  <v-dialog
    v-model="dialog"
    persistent=""
    v-bind:width="options.width"
    v-bind:style="{ zIndex: options.zindex }"
  >
    <v-card>
      <v-card-title class="text-h5"> {{ options.title }} </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="code"
          :label="options.label" 
          :hint="options.hint"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="grey darken-1" text v-on:click="cancel()"> Cancel </v-btn>
        <v-btn color="blue darken-1" text v-on:click="submit()"> Submit </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'InputDialog',
  data() {
    return {
      dialog: false,
      options: {
        width: 400,
        zIndex: 200,
      },

      code: '',

      resolve: null,
      reject: null,
    };
  },
  methods: {
    open(options) {
      this.dialog = true;
      this.options = Object.assign(this.options, options);

      if (!('title' in this.options)) {
        this.options['title'] = 'Enter the value';
      }

      if (!('label' in this.options)) {
        this.options['label'] = 'Value';
      }

      if (!('hint' in this.options)) {
        this.options['hint'] = '';
      }

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    submit() {
      this.resolve(this.code);
      this.dialog = false;
    },
    cancel() {
      this.resolve(false);
      this.dialog = false;
    },
  },
};
</script>