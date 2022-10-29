const state = () => ({
  // array holding user's playlists sans videos
  playlists: [],

  // map/dict of videos keyed by playlist_id
  videos: {}
})

const getters = {
  playlistsNotEmpty(state) {
    return state.playlists.length > 0
  },
  getPlaylists(state) {
    return state.playlists
  },
  getVideos(state) {
    return (id) => state.videos[id] || []
  }
}

const mutations = {
  setPlaylists(state, playlists) {
    if (!Array.isArray(playlists)) {
      throw new Error("Value is not an array")
    }
    state.playlists = playlists
  },
  clearPlaylists(state) {
    state.playlists = []
  },
  setVideos(state, payload) {
    const id = payload['id']
    const videos = payload['videos']

    if (!(typeof id === 'string' || id instanceof String)) {
      throw new Error("ID is not a string")
    }
    if (!Array.isArray(videos)) {
      throw new Error("Value is not an array")
    }

    state.videos[id] = videos
  },
  clearVideos(state, id) {
    delete state.videos[id]
  }
}

const actions = {
  fetchPlaylists({ getters, commit, dispatch }, payload = { force: false }) {
    const axios = this._vm.$axios
    return new Promise((resolve, reject) => {
      if (getters.playlistsNotEmpty && !payload.force) {
        resolve(getters.getPlaylists)
      } else {
        const httpCall = () => {
          axios
            .get('/playlists/')
            .then((response) => {
              if (response.status === 200) {
                commit('setPlaylists', response.data)
                resolve(getters.getPlaylists)
              } else {
                reject(response)
              }
            })
            .catch((error) => {
              reject(error)
            })
        }

        if (getters.isLoggedIn()) {
          httpCall()
        } else {
          dispatch('setOrRefreshToken')
            .then(() => {
              httpCall()
            })
            .catch((error) => {
              reject(error)
            })
        }
      }
    })
  },
  fetchVideos(context, id) {
    const axios = this._vm.$axios

    return new Promise((resolve, reject) => {
      const videos = context.getters.getVideos(id)
      if (videos.length > 0) {
        resolve(videos)
      } else {
        const httpCall = () => {
          axios
            .get(`/playlists/${id}`)
            .then((response) => {
              if (response.status === 200) {
                context.commit('setVideos', { id: id, videos: response.data['video_list'] })
                setTimeout(() => {
                  context.commit('clearVideos', id)
                }, 30 * 60 * 1000);

                resolve(context.getters.getVideos(id))
              } else {
                reject(response)
              }
            })
            .catch((error) => {
              reject(error)
            })
        }

        if (context.getters.isLoggedIn()) {
          httpCall()
        } else {
          context.dispatch('setOrRefreshToken')
            .then((cognitoUser) => {
              console.debug('Called setOrRefreshToken')
              console.debug(cognitoUser)
              httpCall()
            })
            .catch((error) => {
              console.debug('setOrRefreshToken encountered error')
              reject(error)
            })
        }
      }
    })

  },
  deletePlaylist(context, id) {
    const axios = this._vm.$axios
    return new Promise((resolve, reject) => {
      context.dispatch('setOrRefreshToken')
        .then(() => {
          axios
            .delete(`/playlists/${id}`)
            .then((response) => {
              if (response.status === 204) {
                context.dispatch('fetchPlaylists', { force: true })
                resolve(true)
              } else {
                console.debug(response)
                reject(response)
              }
            })
            .catch((error) => {
              reject(error)
            })
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}

export default {
  namespaced: false, // TODO: set this to true after fixing mapping functions
  state,
  getters,
  mutations,
  actions,
}