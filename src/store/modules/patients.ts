import Vue from "vue";
declare module 'vue/types/vue' {
  interface VueConstructor {
    axios: any;
  }
}
export default {
  namespaced: true,

  state: {
    patients: [],
    patient: {}
  },

  mutations: {
    SET_PATIENTS(state, patients) {
      state.patients = patients;
    },
    SET_PATIENT(state, patient) {
      // test if game is already in games
      let inserted = false;
      state.patients.forEach(function(e, i, a) {
        if (e.patientId === patient.patientId) {
          Vue.set(a, i, patient); // reactivity
          inserted = true;
        }
      });
      if (!inserted) {
        state.patients.push(patient);
      }
      state.patient = patient;
    },
    DELETE_PATIENT(state, patientId) {
      state.patients.forEach(function(e, i) {
        if (e.patientId === patientId) {
          state.patients.splice(i, 1);
        }
      });
    }
  },

  actions: {
    /**
     * Fetches all patients
     * @param context
     * @constructor
     */
    GET_PATIENTS(context) {
      Vue.axios.get('/patient/')
        .then(payload => {
          context.commit("SET_PATIENTS", payload.data.payload);
        })
        .catch(error => console.log(error))
    },
    /**
     * Fetches all patients including their data of patient crf
     * @param context
     * @constructor
     */
    GET_PATIENTS_FULL(context) {
      Vue.axios.get('/patient/full')
          .then(payload => {
            context.commit("SET_PATIENTS", payload.data.payload);
          })
          .catch(error => console.log(error))
    },
    /**
     * Fetches a specific patient
     * @param context
     * @param patientId
     * @constructor
     */
    GET_PATIENT(context, patientId) {
      return Vue.axios.get('/patient/'+patientId)
        .then(payload => {
          context.commit("SET_PATIENT", payload.data.payload)
        })
        .catch(error => console.log(error))
    },
    /**
     * Sends update command
     * @param context
     * @param patient
     * @constructor
     */
    PUT_PATIENT(context, patient) {
      return Vue.axios.put('/patient/' + patient.patientId, patient)
        .then(() => {
            context.commit("SET_PATIENT", patient);
        })
        .catch(error => console.log(error))
    },
    /**
     * Sends create command
     * @param context
     * @param patient
     * @constructor
     */
    POST_PATIENT(context, patient) {
      return Vue.axios.post('/patient/', patient)
        .then(() => {
            context.commit("SET_PATIENT", patient);
        })
        .catch(error => console.log(error))
    },
    /**
     * sends delete command
     * @param context
     * @param patientId
     * @constructor
     */
    DESTROY_PATIENT(context, patientId) {
      return Vue.axios.delete('/patient/' + patientId)
        .then(() => {
          context.commit('DELETE_PATIENT', patientId)
        })
        .catch(error => console.log(error))
    }
  }
};
