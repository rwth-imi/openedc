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
    SET_CRF(state, crf, include) {
      if(include) {
        let inserted = false;
        state.crfs.forEach(function(e, i, a) {
          if (e._id === crf._id) {
            Vue.set(a, i, crf); // reactivity
            inserted = true;
          }
        });
        if (!inserted) {
          state.crfs.push(crf);
        }
      }
      state.crf = crf;
    },
    DELETE_CRF(state, formsId) {
      state.crfs.forEach(function(e, i) {
        if (e.formsId === formsId) {
          state.crfs.splice(i, 1);
        }
      });
    }
  },

  actions: {
    GET_CRFS(context, patient = false) {
      return Vue.axios.get('/crf/', {
        params: {
          patient: patient
        }
      })
        .then(payload => {
          context.commit("SET_CRFS", payload.data.payload);
        })
        .catch(error => console.log(error))
    },
    GET_CRF(context, crfId, include = true) {
      return Vue.axios.get('/crf/' + crfId)
        .then(payload => {
          context.commit("SET_CRF", payload.data.payload, include)
        })
        .catch(error => console.log(error))
    },
    GET_CRF_VERSION(context, crfId, version, include = true) {
      return Vue.axios.get('/crf/' + crfId + "/" + version)
        .then(payload => {
          context.commit("SET_CRF", payload.data.payload, include)
        })
        .catch(error => console.log(error))
    },
    GET_CRF_NEWEST(context, crfId, include = true) {
      return Vue.axios.get('/crf/' + crfId + "/newest")
          .then(payload => {
            context.commit("SET_CRF", payload.data.payload, include)
          })
          .catch(error => console.log(error))
    },
    GET_CRF_PATIENT(context) {
      return Vue.axios.get('/crf/patient')
          .then(payload => {
            context.commit("SET_CRF", payload.data.payload, false)
          })
          .catch(error => console.log(error))
    },
    PUT_CRF(context, crf) {
      return Vue.axios.put('/crf/' + crf.formsId, crf)
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
    DESTROY_CRF(context, formsId) {
      return Vue.axios.delete('/crf/' + formsId)
        .then(payload => {
          context.commit('DELETE_CRF', formsId)
        })
        .catch(error => console.log(error))
    }
  }
};
