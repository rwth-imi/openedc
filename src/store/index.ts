import Vue from "vue";
import Vuex from "vuex";

import language from "./modules/language";
import patients from "./modules/patients";
import crfs from "./modules/crfs";
import config from "./modules/config";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    language,
    patients,
    crfs,
    config
  }
});
