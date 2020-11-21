import Vue from "vue";
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
      /**
       * Sets the current CRF. If included = false, the given CRF will not be added to the CRFs Array
       * @param state
       * @param payload Object of form
       * {
       *     include: Boolean,
       *     crf: Object
       * }
       * @constructor
       */
    SET_CRF(state, payload) {
      if(payload.include) {
        let inserted = false;
        state.crfs.forEach(function(e, i, a) {
          if (e._id === payload.crf._id) {
            Vue.set(a, i, payload.crf); // reactivity
            inserted = true;
          }
        });
        if (!inserted) {
          state.crfs.push(payload.crf);
        }
      }
      state.crf = payload.crf;
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
      /**
       * Fetches all current CRFS, if patient = false the Patient CRF will not be fetched.
       * @param context
       * @param patient if patient = false the Patient CRF will not be fetched
       * @constructor
       */
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
    /**
     * Fetches a CRF
     * @param context
     * @param payload
     * {
     *     crfId: String
     *     include: Boolean
     * }
     * @constructor
     */
    GET_CRF(context, payload = {
        crfId: null,
        include: true
    }) {
      return Vue.axios.get('/crf/' + payload.crfId)
          .then(payload2 => {
            context.commit("SET_CRF", {
              crf: payload2.data.payload,
              include: payload.include
            })
          })
          .catch(error => console.log(error))
    },
      /**
       * Gets a specific version of CRF
       * @param context
       * @param payload
       * {
       *     crfId: String,
       *     version: Number,
       *     include: Boolean
       * }
       * @constructor
       */
    GET_CRF_VERSION(context, payload = {
        crfId: null,
     version: null,
        include: true}) {
      return Vue.axios.get('/crf/' + payload.crfId + "/" + payload.version)
          .then(payload2 => {
            context.commit("SET_CRF", {
              crf: payload2.data.payload,
              include: payload.include
            })
          })
          .catch(error => console.log(error))
    },
      /**
       * Fetches the newest version of the specified CRF
        * @param context
       * @param payload
       * {
       *     crfId: String,
       *     include: Boolean
       * }
       * @constructor
       */
    GET_CRF_NEWEST(context, payload = {
        crfId: null,
        include: true
    }) {
      return Vue.axios.get('/crf/' + payload.crfId + "/newest")
          .then(payload2 => {
            context.commit("SET_CRF", {
              crf: payload2.data.payload,
              include: payload.include
            })
          })
          .catch(error => console.log(error))
    },
      /**
       * Fetches the patient CRF
       * @param context
       * @constructor
       */
    GET_CRF_PATIENT(context) {
      return Vue.axios.get('/crf/patient')
          .then(payload => {
            context.commit("SET_CRF", {
              crf: payload.data.payload,
              include: false
            })
            return {
              success: true
            }
          })
          .catch(error => {
            return {
              success: false,
              errorCode: error.response.status,
              error: error
            };
          })
    },
      /**
       * Sends update for a CRF
       * @param context
       * @param crf
       * @constructor
       */
    PUT_CRF(context, crf) {
      return Vue.axios.put('/crf/' + crf.formsId, crf)
          .then(payload => {
            context.commit("SET_CRF", payload.data.payload);
          })
          .catch(error => console.log(error))
    },
      /**
       * Sends create command for CRF
       * @param context
       * @param crf
       * @constructor
       */
    POST_CRF(context, crf) {
      return Vue.axios.post('/crf/', crf)
          .then(payload => {
            context.commit("SET_CRF", payload.data.payload);
          })
          .catch(error => console.log(error))
    },
      /**
       * Sends delete command for form
       * @param context
       * @param formsId
       * @constructor
       */
    DESTROY_CRF(context, formsId) {
      return Vue.axios.delete('/crf/' + formsId)
          .then(() => {
            context.commit('DELETE_CRF', formsId)
          })
          .catch(error => console.log(error))
    }
  }
};


