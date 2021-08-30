<template>
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
      <v-row class="mx-1" align="center" justify="start">
        <p class="text-h4">
          {{ playlistInfo.title }}
        </p>
      </v-row>
      <v-row class="mx-1" align="center" justify="start">
        <p class="text-subtitle-1 py-0">
          {{ playlistInfo.channel }}
        </p>
      </v-row>
      <v-row class="mx-1" align="center" justify="start">
        <span class="text-subtitle-2">
          {{ playlistInfo.numOfVideo }} Videos
        </span>
        <span class="text-subtitle-2">
          {{ playlistInfo.numOfView }} Views
        </span>
      </v-row>
      <v-row class="mx-1" align="end">
        <p class="text-body-1 pt-2">
          {{ playlistInfo.description }}
        </p>
      </v-row>
    </v-card-text>
    <v-card-actions v-if="resultCard">
      <v-row class="ma-1" align="center" justify="end">
        <v-btn text @click="resetHandler"> reset </v-btn>
        <v-btn text @click="trackHandler"> track </v-btn>
      </v-row>
    </v-card-actions>
    <v-card-text v-else>
      <div class="v-label" id="divAutocompleteHint">
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
</template>

<script>
import { debounce } from '../utils/helpers';
export default {
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

    playlistInfo: {
      title: 'Misconceptions',
      channel: 'Veritasium',
      numOfVideo: 33,
      numOfView: 2614286,
      dateLastUpdated: new Date('2021-06-01'),
      description:
        "Misconceptions about science are common. Sometimes these alternative ideas make a lot of sense, which is why it's so hard to change our ideas about the natural world.",
    },
  }),
  computed: {
    keywords: function () {
      return [
        {
          key: 'http',
          value: 'http://',
          mutuallyExclusive: 'https',
          positions: this.getHintPositions({
            initialPosition: 1,
            value: 'http://',
            hintsBefore: [],
          }),
        },
        {
          key: 'https',
          value: 'https://',
          mutuallyExclusive: 'http',
          positions: this.getHintPositions({
            initialPosition: 1,
            value: 'https://',
            hintsBefore: [],
          }),
        },
        {
          key: 'www',
          value: 'www.',
          mutuallyExclusive: 'm',
          positions: this.getHintPositions({
            initialPosition: 1,
            value: 'www.',
            hintsBefore: ['http://', 'https://'],
          }),
        },
        {
          key: 'm',
          value: 'm.',
          mutuallyExclusive: 'www',
          positions: this.getHintPositions({
            initialPosition: 1,
            value: 'm.',
            hintsBefore: ['http://', 'https://'],
          }),
        },
        {
          key: 'youtube',
          value: 'youtube.com',
          mutuallyExclusive: '',
          positions: this.getHintPositions({
            initialPosition: 1,
            value: 'youtube.com',
            hintsBefore: ['http://', 'https://', 'www.', 'm.'],
          }),
        },
        {
          key: 'path',
          value: '/playlist?list=',
          mutuallyExclusive: '',
          positions: this.getHintPositions({
            initialPosition: 11,
            value: '/playlist?list=',
            hintsBefore: ['http://', 'https://', 'www.', 'm.', 'youtube.com'],
          }),
        },
      ];
    },
    debouncedSetAutocompleteHint: function () {
      return debounce(this.setAutocompleteHint, 250);
    },
  },
  methods: {
    trackHandler: function () {
      this.$router.push('/playlists');
    },
    resetHandler: function () {
      this.playlistUrl.raw = '';
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
    getHintPositions: function (obj) {
      // this function is used to calculate where the hint will activate based on url field length
      let positions = [...Array(obj.value.length).keys()].map(
        (i) => i + obj.initialPosition
      );

      let lastHintOffset = 0;
      for (let i = 0; i < obj.hintsBefore.length; ++i) {
        // url can have either http or https, not both
        // TODO: Make this NOT hardcoded
        if (i > 0) {
          if (
            obj.hintsBefore[i] === 'https://' &&
            obj.hintsBefore[i - 1] === 'http://'
          ) {
            lastHintOffset -= obj.hintsBefore[i - 1].length;
          } else if (
            obj.hintsBefore[i] === 'm.' &&
            obj.hintsBefore[i - 1] === 'www.'
          ) {
            lastHintOffset -= obj.hintsBefore[i - 1].length;
          }
        }

        let newPositions = [...Array(obj.value.length).keys()].map(
          (j) =>
            j + obj.initialPosition + obj.hintsBefore[i].length + lastHintOffset
        );
        // only push unique positions
        newPositions.forEach((element) => {
          if (!positions.includes(element)) positions.push(element);
        });

        lastHintOffset += obj.hintsBefore[i].length;
      }

      // BUG: positions for /playlist?list= are wrong
      return positions;
    },
    setAutocompleteHint: function (value) {
      let trimmed = value;
      this.keywords.forEach((element) => {
        let diff = trimmed;
        trimmed = trimmed.replace(element.value, '');

        if (diff.length !== trimmed.length) {
          this.usedHints.push(element.key);
          
          if (element.mutuallyExclusive !== '') {
            this.usedHints.push(element.mutuallyExclusive);
          }
        }
      });

      // trimmed = ;

      if (trimmed.length < 1) {
        return;
      }

      for (let i = 0; i < this.keywords.length; ++i) {
        let element = this.keywords[i];
        if (
          !this.usedHints.includes(element.key) &&
          trimmed.length <= element.value.length &&
          element.value.match(new RegExp(`^${trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)) !== null &&
          element.positions.includes(value.length)
        ) {
          this.autocompleteText.hidden = value;
          this.autocompleteText.visible = element.value.replace(
            trimmed,
            ''
          );
          return;
        }
      }
    },
    doAutocomplete: function () {
      if (this.autocompleteText.visible.length > 0) {
        this.playlistUrl.raw += this.autocompleteText.visible;
      }
    },
    clearAutocomplete: function () {
      this.autocompleteText.hidden = this.autocompleteText.visible = '';
      this.usedHints = [];
    },
  },
  watch: {
    'playlistUrl.raw': function (url) {
      this.clearAutocomplete();

      // cancel previous debounced action (if any) and do a new one
      this.debouncedSetAutocompleteHint.cancel();
      this.debouncedSetAutocompleteHint(url);

      this.checkPlaylistUrl(url);
    },
  },
};
</script>

<style scoped>
#divAutocompleteHint {
  transform: translateX(0px) translateY(27px);
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