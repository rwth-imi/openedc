import Vue from "vue";

export default {
    namespaced: true,
    state: {
        config: {
            language: null
        }
    },
    mutations: {
        SET_CONFIG(state, config) {
            state.config = config;
        }
    },
    actions: {
        CREATE_CONFIG(context, config) {
            return Vue.axios.post('/config/', {config})
                .then(payload => {
                    context.commit("SET_CONFIG", payload.data.payload);
                })
                .catch(error => console.log(error));
        },
        SET_CONFIG(context, config) {
            return Vue.axios.put(`/config/${config._id}`, {config})
                .then(payload => {
                    context.commit("SET_CONFIG", payload.data.payload);
                })
                .catch(error => console.log(error));
        },
        GET_CONFIG(context) {
            return Vue.axios.get('/config/')
                .then(payload => {
                    if(payload.data.payload !== null) {
                        context.commit("SET_CONFIG", payload.data.payload);
                        return true;
                    }
                    return false;
                })
                .catch(error => console.log(error));
        }
    }
};
