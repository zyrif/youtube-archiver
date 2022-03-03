const state = () => ({
    showLoginDialog: false,
    showLoadingDialog: false,
    loginButtonLoadingState: false,
    errorDialogRef: null,
})

const getters = {
    isLoginDialogVisible(state) {
        return state.showLoginDialog
    },
    isLoadingDialogVisible(state) {
        return state.showLoadingDialog
    },
    isLoginButtonLoading(state) {
        return state.loginButtonLoadingState
    },
    getErrorDialogRef(state) {
        if (!state.errorDialogRef) {
            throw new Error("errorDialogRef has not been set yet")
        }
        return state.errorDialogRef
    },
}

const mutations = {
    setLoginDialogVisibility(state, { value }) {
        state.showLoginDialog = value
    },
    setLoadingDialogVisibility(state, { value }) {
        state.showLoadingDialog = value
    },
    setLoginButtonLoadingState(state, { value }) {
        state.loginButtonLoadingState = value
    },
    setErrorDialogRef(state, { value }) {
        state.errorDialogRef = value
    },
}

export default {
    namespaced: false, // TODO: set this to true after fixing mapping functions
    state,
    getters,
    mutations,
}