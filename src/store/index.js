import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import UiStates from "./modules/UiStates";
import data from "./modules/data";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    UiStates,
    data,
  },
});
