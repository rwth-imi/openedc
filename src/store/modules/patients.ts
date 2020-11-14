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
      state.patients.forEach(function(e, i, a) {
        if (e.patientId === patientId) {
          state.patients.splice(i, 1);
        }
      });
    }
  },

  actions: {
    GET_PATIENTS(context) {
      Vue.axios.get('/patient/')
        .then(payload => {
          context.commit("SET_PATIENTS", payload.data.payload);
        })
        .catch(error => console.log(error))
    },
    GET_PATIENTS_FULL(context) {
      Vue.axios.get('/patient/full')
          .then(payload => {
            context.commit("SET_PATIENTS", payload.data.payload);
          })
          .catch(error => console.log(error))
    },
    GET_PATIENT(context, patientId) {
      return Vue.axios.get('/patient/'+patientId)
        .then(payload => {
          context.commit("SET_PATIENT", payload.data.payload)
        })
        .catch(error => console.log(error))
    },
    PUT_PATIENT(context, patient) {
      return Vue.axios.put('/patient/' + patient.patientId, patient)
        .then(payload => {
            context.commit("SET_PATIENT", patient);
        })
        .catch(error => console.log(error))
    },
    POST_PATIENT(context, patient) {
      return Vue.axios.post('/patient/', patient)
        .then(payload => {
            context.commit("SET_PATIENT", patient);
        })
        .catch(error => console.log(error))
    },
    DESTROY_PATIENT(context, patientId) {
      return Vue.axios.delete('/patient/' + patientId)
        .then(payload => {
          context.commit('DELETE_PATIENT', patientId)
        })
        .catch(error => console.log(error))
    }
  }
};
