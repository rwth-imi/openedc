import Vue from "vue";
import i18n from "../../i18n";

const supportedLanguages = ["en", "de"];

export default {
  namespaced: true,
  state: {
    language: localStorage.getItem("language")
  },
  getters: {
    languages(state) {
      const ret : object[] = [];
      supportedLanguages.forEach(element => {
        if (!element.startsWith("_")) {
          ret.push({
            title: i18n.t("languages." + element),
            value: element
          });
        }
      });
      return ret;
    }
  },
  mutations: {
    SET_LANGUAGE(state, lang) {
      localStorage.setItem("language", lang);
      state.language = lang;
    }
  },
  actions: {
    setLanguage({ commit }, languages) {
      if (typeof languages === "string") {
        commit("SET_LANGUAGE", languages);
      } else {
        const language = supportedLanguages.find(sl =>
          languages.find(l =>
            l.split(new RegExp(sl, "gi")).length - 1 > 0 ? sl : null
          )
        );
        commit("SET_LANGUAGE", language);
      }
    }
  }
};
