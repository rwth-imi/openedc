import Vue from "vue";
declare module 'vue/types/vue' {
  interface VueConstructor {
    axios: any;
  }
}
export default {
  namespaced: true,

  state: {
    crfs: [],
    crf: {}
  },

  mutations: {
    SET_CRFS(state, crfs) {
      state.crfs = crfs;
    },
    SET_CRF(state, crf) {
      // test if game is already in games
      let inserted = false;
      state.crfs.forEach(function(e, i, a) {
        if (e.crfId === crf._id) {
          Vue.set(a, i, crf); // reactivity
          inserted = true;
        }
      });
      if (!inserted) {
        state.crfs.push(crf);
      }
      state.crf = crf;
    },
    DELETE_CRF(state, crfId) {
      state.crfs.forEach(function(e, i, a) {
        if (e.crfId === crfId) {
          state.crfs.splice(i, 1);
        }
      });
    }
  },

  actions: {
    GET_CRFS(context) {
      return Vue.axios.get('/crf/')
        .then(payload => {
          context.commit("SET_CRFS", payload.data.payload);
        })
        .catch(error => console.log(error))
    },
    GET_CRF(context, crfId) {
      return Vue.axios.get('/crf/' + crfId)
        .then(payload => {
          context.commit("SET_CRF", payload.data.payload)
        })
        .catch(error => console.log(error))
    },
    GET_CRF_VERSION(context, crfId, version) {
      return Vue.axios.get('/crf/' + crfId + "/" + version)
        .then(payload => {
          context.commit("SET_CRF", payload.data.payload)
        })
        .catch(error => console.log(error))
    },
    PUT_CRF(context, crf) {
      return Vue.axios.put('/crf/' + crf._id, crf)
        .then(payload => {
          context.commit("SET_CRF", payload.data.payload);
        })
        .catch(error => console.log(error))
    },
    POST_CRF(context, crf) {
      return Vue.axios.post('/crf/', crf)
        .then(payload => {
          context.commit("SET_CRF", payload.data.payload);
        })
        .catch(error => console.log(error))
    },
    DESTROY_CRF(context, crfId) {
      return Vue.axios.delete('/crf/' + crfId)
        .then(payload => {
          context.commit('DELETE_CRF', crfId)
        })
        .catch(error => console.log(error))
    }
  }
};
