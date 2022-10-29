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
          v-model="value"
          :label="options.label" 
          :hint="options.hint"
          :type="options.type"
        />
      </v-card-text>
      <v-card-actions>
        <slot name="left-card-actions"></slot>
        <v-spacer />
        <slot name="right-card-actions">
          <v-btn color="grey darken-1" text v-on:click="cancel()"> Cancel </v-btn>
          <v-btn color="blue darken-1" text v-on:click="submit()"> Submit </v-btn>
        </slot>
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

      value: '',

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

      if (!('type' in this.options)) {
        this.options['type'] = 'text';
      }

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    submit() {
      this.resolve(this.value);
      this.value = '';
      this.dialog = false;
    },
    cancel() {
      this.resolve(false);
      this.value = '';
      this.dialog = false;
    },
  },
};
</script>