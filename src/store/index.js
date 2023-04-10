import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const state = {
  theme: "chalk",
};

const mutations = {
  changeTheme(state) {
    state.theme === "chalk"
      ? (state.theme = "vintage")
      : (state.theme = "chalk");
  },
};

const actions = {};

export default new Vuex.Store({
  state,
  mutations,
  actions,
});
