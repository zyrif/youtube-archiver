const state = () => ({
    showLoginDialog: false,
})

const getters = {
    isLoginDialogVisible(state) {
        return state.showLoginDialog
    }
}

const mutations = {
    setLoginDialogVisibility(state, {value}) {
        state.showLoginDialog = value
    }
}

export default {
    namespaced: false, // TODO: set this to true after fixing mapping functions
    state,
    getters,
    mutations,
}