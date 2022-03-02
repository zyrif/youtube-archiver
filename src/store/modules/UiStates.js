const state = () => ({
    showLoginDialog: false,
    showLoadingDialog: false,
})

const getters = {
    isLoginDialogVisible(state) {
        return state.showLoginDialog
    },
    isLoadingDialogVisible(state) {
        return state.showLoadingDialog
    },
}

const mutations = {
    setLoginDialogVisibility(state, { value }) {
        state.showLoginDialog = value
    },
    setLoadingDialogVisibility(state, { value }) {
        state.showLoadingDialog = value
    },
}

export default {
    namespaced: false, // TODO: set this to true after fixing mapping functions
    state,
    getters,
    mutations,
}