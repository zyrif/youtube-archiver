<template>
  <div style="display: contents">
    <v-card class="mx-auto" outlined max-width="720px">
      <v-card-title v-if="resultCard"> Track A New Playlist </v-card-title>
      <v-card-text v-if="resultCard">
        <v-row class="ma-1" align="start">
          <v-chip
            class="ma-1"
            v-if="playlistUrl.protocol"
            :color="playlistUrl.protocol === 'https' ? 'success' : 'warning'"
            label
          >
            {{ playlistUrl.protocol }}
          </v-chip>
          <v-chip
            class="ma-1"
            v-if="playlistUrl.subdomain"
            :color="playlistUrl.subdomain === 'www' ? 'primary' : 'error'"
            label
          >
            {{ playlistUrl.subdomain }}
          </v-chip>
          <v-chip class="ma-1" v-if="playlistUrl.domain" color="error" label>
            {{ playlistUrl.domain }}
          </v-chip>
          <v-chip class="ma-1" v-if="playlistUrl.domain" label outlined>
            /playlist?list=
          </v-chip>
          <v-chip class="ma-1" label>
            {{ playlistUrl.listID }}
          </v-chip>
        </v-row>
        <v-skeleton-loader :loading="isLoading" type="heading" class="mt-6">
          <v-row class="mx-1" align="center" justify="start">
            <span class="text-h4">
              {{ playlistInfo.title }}
            </span>
          </v-row>
        </v-skeleton-loader>
        <v-skeleton-loader
          :loading="isLoading"
          type="text"
          max-width="100px"
          class="mt-4"
        >
          <v-row class="mx-1" align="center" justify="start">
            <p class="text-subtitle-1">
              {{ playlistInfo.channel }}
            </p>
          </v-row>
        </v-skeleton-loader>
        <v-skeleton-loader
          :loading="isLoading"
          type="text"
          max-width="150px"
          class="mt-3"
        >
          <v-row class="mx-1" align="center" justify="start">
            <span class="text-subtitle-2">
              {{ playlistInfo.numOfVideo }}
            </span>
            &nbsp; &nbsp;
            <span class="text-subtitle-2">
              {{ playlistInfo.numOfView }}
            </span>
          </v-row>
        </v-skeleton-loader>
        <v-skeleton-loader
          :loading="isLoading"
          type="text"
          max-width="170px"
          class="mt-1"
        >
          <v-row class="mx-1" align="center" justify="start">
            <p class="text-subtitle-2 mt-2">
              {{ playlistInfo.lastUpdated }}
            </p>
          </v-row>
        </v-skeleton-loader>
        <v-skeleton-loader
          :loading="isLoading"
          type="paragraph"
          max-width="500px"
          class="mt-4"
        >
          <v-row class="mx-1" align="end">
            <p class="text-body-1">
              {{ playlistInfo.description }}
            </p>
          </v-row>
        </v-skeleton-loader>
      </v-card-text>
      <v-card-actions v-if="resultCard">
        <v-row class="ma-1" align="center" justify="end">
          <v-btn text @click="resetHandler"> reset </v-btn>
          <v-btn text :disabled="isLoading" @click="trackHandler">
            track
          </v-btn>
        </v-row>
      </v-card-actions>
      <v-card-text v-else>
        <div class="v-label" id="div-hint-text">
          <span class="hint-hidden">{{ autocompleteText.hidden }}</span
          ><span>{{ autocompleteText.visible }}</span>
        </div>
        <v-text-field
          v-model="playlistUrl.raw"
          color="red"
          label="Youtube Playlist URL"
          placeholder="Paste the Youtube Playlist/Channel URL you want to track here"
          hint="Ex. youtube.com/playlist?list=<Playlist ID>"
          v-on:keydown.tab.prevent="doAutocomplete"
        ></v-text-field>
      </v-card-text>
    </v-card>
    <error-dialog ref="refSearchErrorDialog"></error-dialog>
  </div>
</template>

<script>
import ErrorDialog from '../components/SearchErrorDialog.vue';
import axios from 'axios';
import { debounce } from '../utils/helpers';
export default {
  components: { ErrorDialog },
  data: () => ({
    resultCard: false,

    playlistUrl: {
      raw: '',
      protocol: '',
      subdomain: '',
      domain: '',
      listID: '',
    },

    autocompleteText: {
      hidden: '',
      visible: '',
    },

    usedHints: [],
    hintPositions: {},

    playlistInfo: {
      title: '',
      channel: '',
      numOfVideo: '',
      numOfView: '',
      lastUpdated: '',
      description: '',
    },
  }),
  computed: {
    isLoading: function () {
      return this.playlistInfo.title === '';
    },
    keywords: function () {
      return {
        http: {
          key: 'http',
          value: 'http://',
          mutuallyExclusive: 'https',
          initialPosition: 1,
          predecessors: [],
        },
        https: {
          key: 'https',
          value: 'https://',
          mutuallyExclusive: 'http',
          initialPosition: 1,
          predecessors: [],
        },
        www: {
          key: 'www',
          value: 'www.',
          mutuallyExclusive: 'm',
          initialPosition: 1,
          predecessors: ['http', 'https'],
        },
        m: {
          key: 'm',
          value: 'm.',
          mutuallyExclusive: 'www',
          initialPosition: 1,
          predecessors: ['http', 'https'],
        },
        youtube: {
          key: 'youtube',
          value: 'youtube.com',
          mutuallyExclusive: '',
          initialPosition: 1,
          predecessors: ['http', 'https', 'www', 'm'],
        },
        path: {
          key: 'path',
          value: '/playlist?list=',
          mutuallyExclusive: '',
          initialPosition: 11,
          predecessors: ['http', 'https', 'www', 'm', 'youtube'],
        },
      };
    },
    debouncedSetAutocompleteHint: function () {
      return debounce(this.setAutocompleteHint, 250);
    },
  },
  mounted: function () {
    for (const keyword in this.keywords) {
      const hint = this.keywords[keyword];
      Object.assign(this.hintPositions, {
        [hint.key]: [...this.getHintPositions(hint)],
      });
    }
  },
  methods: {
    trackHandler: function () {
      this.$router.push('/playlists');
    },
    resetHandler: function () {
      // TODO: also cancel any pending axios request
      this.playlistUrl.raw = '';
      this.playlistInfo.title = '';
      this.resultCard = false;
    },
    checkPlaylistUrl: function (url) {
      let re =
        /\b(?<protocol>[https]{4,5})?(?::\/\/)?\b(?<subdomain>www|m)?(?:.)?\b(?<domain>youtube\.com)?\b(?:\/playlist\?list=)?\b(?<playlistid>[-a-zA-Z0-9()_]{18,34})\b/;
      if (re.test(url)) {
        let matches = re.exec(url);

        this.setPlaylistUrl({
          protocol: matches.groups.protocol,
          subdomain: matches.groups.subdomain,
          domain: matches.groups.domain,
          listID: matches.groups.playlistid,
        });

        this.resultCard = true;
        this.fetchResult();
      }
    },
    setPlaylistUrl: function (values) {
      if (!values.listID) {
        // TODO: Show an alert to the user for invalid ID
        throw new TypeError('Playlist ID must be a valid value');
      }

      this.playlistUrl.protocol = values.protocol ? values.protocol : 'https';
      this.playlistUrl.subdomain = values.subdomain ? values.subdomain : 'www';
      this.playlistUrl.domain = values.domain ? values.domain : 'youtube.com';
      this.playlistUrl.listID = values.listID;
    },
    getHintPositions: function (hint) {
      // this function is used to calculate where the hint will activate based on url field length
      let positions = [...Array(hint.value.length).keys()].map(
        (i) => i + hint.initialPosition
      );

      let lastHintOffset = 0;
      for (let i = 0; i < hint.predecessors.length; ++i) {
        let predecessor = this.keywords[hint.predecessors[i]];
        if (i > 0) {
          if (
            predecessor.mutuallyExclusive !== '' &&
            hint.predecessors[i - 1] === predecessor.mutuallyExclusive
          ) {
            let mutuallyExclusive =
              this.keywords[predecessor.mutuallyExclusive];
            lastHintOffset -= mutuallyExclusive.value.length;
          }
        }

        let newPositions = [...Array(hint.value.length).keys()].map(
          (j) =>
            j + hint.initialPosition + predecessor.value.length + lastHintOffset
        );
        // only push unique positions
        newPositions.forEach((element) => {
          if (!positions.includes(element)) {
            positions.push(element);
          }
        });

        lastHintOffset += predecessor.value.length;
      }

      return positions;
    },
    setAutocompleteHint: function (value) {
      let trimmed = value;
      for (const keyword in this.keywords) {
        const element = this.keywords[keyword];
        let diff = trimmed;
        trimmed = trimmed.replace(element.value, '');

        if (diff.length !== trimmed.length) {
          this.usedHints.push(element.key);
          if (element.mutuallyExclusive !== '') {
            this.usedHints.push(element.mutuallyExclusive);
          }
        }
      }

      if (trimmed.length < 1) {
        return;
      }

      for (const keyword in this.keywords) {
        const element = this.keywords[keyword];
        if (
          !this.usedHints.includes(element.key) &&
          trimmed.length <= element.value.length &&
          element.value.match(
            new RegExp(`^${trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)
          ) !== null &&
          this.hintPositions[element.key].includes(value.length)
        ) {
          this.autocompleteText.hidden = value;
          this.autocompleteText.visible = element.value.replace(trimmed, '');
          return;
        }
      }
    },
    doAutocomplete: function () {
      if (this.autocompleteText.visible.length > 0) {
        this.playlistUrl.raw += this.autocompleteText.visible;
      }
    },
    resetAutocomplete: function () {
      this.autocompleteText.hidden = this.autocompleteText.visible = '';
      this.usedHints = [];
    },
    fetchResult: function () {
      let url = 'https://api.tectronus.com/yttracker/pl-metadata';
      axios
        .get(url, {
          params: {
            id: this.playlistUrl.listID,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            this.playlistInfo.title = response.data['title'];
            this.playlistInfo.description = response.data['description'];
            this.playlistInfo.numOfVideo = response.data['num_of_videos'];
            this.playlistInfo.numOfView = response.data['views'];
            this.playlistInfo.lastUpdated = response.data['last_updated'];
            this.playlistInfo.channel = response.data['uploader'];
          }
        })
        .catch((error) => {
          let e;
          if (!error.status && error.message === 'Network Error') {
            // TODO: Remove debug message
            console.log(JSON.stringify(error, null, 4));
            e = {
              errorTitle: 'Network Error Occured',
              errorMsg: 'Either Internet Is Unavailable Or The API Server Is Down.',
            };
          } else if (
            error.response.status >= 400 &&
            error.response.status <= 499
          ) {
            // TODO: Remove debug message
            console.debug(JSON.stringify(error, null, 4));
            e = {
              errorTitle: 'Error!',
              errorMsg: error.response.data.errorMessage,
            };
          } else if (
            error.response.status >= 500 &&
            error.response.status <= 599
          ) {
            // TODO: Remove debug message
            console.debug(JSON.stringify(error.response, null, 4));
            e = {
              errorTitle: 'API Error',
              errorMsg: error.response.data.errorMessage,
            };
          } else {
            // TODO: Remove debug message
            console.debug(JSON.stringify(error, null, 4));
            e = {
              errorTitle: 'Unknown Error',
              errorMsg: 'An Unexpected Error Occured',
            };
          }

          this.$refs.refSearchErrorDialog
            .open(e)
            .then((result) => {
              if (result) {
                this.fetchResult();
              } else {
                this.resetHandler();
              }
            });
        });
    },
  },
  watch: {
    'playlistUrl.raw': function (url) {
      this.resetAutocomplete();

      // cancel previous debounced action (if any) and do a new one
      this.debouncedSetAutocompleteHint.cancel();
      this.debouncedSetAutocompleteHint(url);

      this.checkPlaylistUrl(url);
    },
  },
};
</script>

<style scoped>
#div-hint-text {
  transform: translateX(0px) translateY(28px);
  min-height: 16px;
}

.hint-hidden {
  color: rgba(255, 255, 255, 0);
  letter-spacing: 0;
}

.v-text-field {
  padding-top: 0;
}
</style>
