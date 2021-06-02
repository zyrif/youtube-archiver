<template>
  <v-container fill-height>
    <v-row align="self-end" dense>
      <v-col>
        <v-card class="mx-auto" v-if="resultCard" outlined max-width="720px">
          <v-card-title> Track A New Playlist </v-card-title>
          <v-card-text>
            <v-row class="ma-1" align="start">
              <v-chip
                class="ma-1"
                v-if="playlistUrl.protocol"
                :color="
                  playlistUrl.protocol === 'https' ? 'success' : 'warning'
                "
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
              <v-chip
                class="ma-1"
                v-if="playlistUrl.domain"
                color="error"
                label
              >
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
          <v-card-actions>
            <v-row class="ma-1" align="center" justify="end">
              <v-btn text> track </v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
        <v-card v-else class="mx-auto" outlined max-width="720px">
          <v-card-text>
            <div class="v-label" id="divAutocompleteHint">
              <span class="hint-hidden">{{ autocompleteText.hidden }}</span
              ><span>{{ autocompleteText.visible }}</span>
            </div>
            <v-text-field
              v-model="playlistUrl.raw"
              label="Youtube Playlist URL"
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row align="self-start" dense>
      <v-spacer></v-spacer>
      <v-col style="text-align: center"> </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    resultCard: false,
    playlistUrl: {
      raw: "",
      protocol: "",
      subdomain: "",
      domain: "",
      listID: "",
    },
    autocompleteText: {
      hidden: "",
      visible: "https://www.youtube.com/playlist?list=",
    },

    playlistInfo: {
      title: "Misconceptions",
      channel: "Veritasium",
      numOfVideo: 33,
      numOfView: 2614286,
      dateLastUpdated: new Date("2021-06-01"),
      description:
        "Misconceptions about science are common. Sometimes these alternative ideas make a lot of sense, which is why it's so hard to change our ideas about the natural world.",
    },
  }),
  methods: {
    setPlaylistUrl: function (values) {
      if (!values.listID)
        throw new TypeError("Playlist ID must be a valid value");

      this.playlistUrl.protocol = values.protocol ? values.protocol : "https";
      this.playlistUrl.subdomain = values.subdomain ? values.subdomain : "www";
      this.playlistUrl.domain = values.domain ? values.domain : "youtube.com";
      this.playlistUrl.listID = values.listID;
    },
    setAutocompleteHint: function (value) {
      this.autocompleteText.hidden = value;
      this.autocompleteText.visible = "https://www.youtube.com/playlist?list=".replace(value, "");
    }
  },
  watch: {
    "playlistUrl.raw": function (url) {
      this.setAutocompleteHint(url);

      let re = /\b(?<protocol>[https]{4,5})?(?::\/\/)?\b(?<subdomain>www|m)?(?:.)?\b(?<domain>youtube\.com)?\b(?:\/playlist\?list=)?\b(?<playlistid>[-a-zA-Z0-9()_]{18,34})\b/;
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
  },
};
</script>

<style>
#divAutocompleteHint {
  transform: translateX(0px) translateY(40px);
}

.hint-hidden {
  color: rgba(255, 255, 255, 0);

}
</style>