const state = () => ({
  // array holding user's playlists sans videos
  playlists: [],

  // map/dict of videos keyed by playlist_id
  videos: {},
});

const getters = {
  playlistsNotEmpty(state) {
    return state.playlists.length > 0;
  },
  getPlaylists(state) {
    return state.playlists;
  },
  getVideos(state) {
    return (id) => state.videos[id] || [];
  },
};

const mutations = {
  setPlaylists(state, data = { items: [] }) {
    if (!Array.isArray(data.items)) {
      state.playlists = [];
    } else {
      state.playlists = data.items;
    }
  },
  clearPlaylists(state) {
    state.playlists = [];
  },
  setVideos(
    state,
    payload = { items: [], additional_data: { playlist_id: "" } }
  ) {
    const id = payload["additional_data"]["playlist_id"];
    const videos = payload["items"];

    if (id === "") {
      throw new Error(
        "Could not recognize the response format from server. The app is possibly outdated."
      );
    }

    state.videos[id] = videos;
  },
  clearVideos(state, id) {
    delete state.videos[id];
  },
};

const actions = {
  fetchPlaylists({ getters, commit, dispatch }, payload = { force: false }) {
    const axios = this._vm.$axios;
    return new Promise((resolve, reject) => {
      if (getters.playlistsNotEmpty && !payload.force) {
        resolve(getters.getPlaylists);
      } else {
        const httpCall = () => {
          axios
            .get("/playlists/")
            .then((response) => {
              if (response.status === 200) {
                commit("setPlaylists", response.data);
                resolve(getters.getPlaylists);
              } else {
                reject(response);
              }
            })
            .catch((error) => {
              reject(error);
            });
        };

        if (getters.isLoggedIn()) {
          httpCall();
        } else {
          dispatch("setOrRefreshToken")
            .then(() => {
              httpCall();
            })
            .catch((error) => {
              reject(error);
            });
        }
      }
    });
  },
  fetchVideos(context, id) {
    const axios = this._vm.$axios;

    return new Promise((resolve, reject) => {
      const videos = context.getters.getVideos(id);
      if (videos.length > 0) {
        resolve(videos);
      } else {
        const httpCall = () => {
          axios
            .get(`/playlists/${id}`)
            .then((response) => {
              if (response.status === 200) {
                context.commit("setVideos", response.data);
                setTimeout(() => {
                  context.commit("clearVideos", id);
                }, 30 * 60 * 1000);

                resolve(context.getters.getVideos(id));
              } else {
                reject(response);
              }
            })
            .catch((error) => {
              reject(error);
            });
        };

        if (context.getters.isLoggedIn()) {
          httpCall();
        } else {
          context
            .dispatch("setOrRefreshToken")
            .then((cognitoUser) => {
              console.debug("Called setOrRefreshToken");
              console.debug(cognitoUser);
              httpCall();
            })
            .catch((error) => {
              console.debug("setOrRefreshToken encountered error");
              reject(error);
            });
        }
      }
    });
  },
  deletePlaylist(context, id) {
    const axios = this._vm.$axios;
    return new Promise((resolve, reject) => {
      context
        .dispatch("setOrRefreshToken")
        .then(() => {
          axios
            .delete(`/playlists/${id}`)
            .then((response) => {
              if (response.status === 204) {
                context.dispatch("fetchPlaylists", { force: true });
                resolve(true);
              } else {
                console.debug(response);
                reject(response);
              }
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};

export default {
  namespaced: false, // TODO: set this to true after fixing mapping functions
  state,
  getters,
  mutations,
  actions,
};
