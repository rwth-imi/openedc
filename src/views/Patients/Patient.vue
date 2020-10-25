<template>
<div class="mainPage">
  <h1>Patient: {{ patientId }}</h1>
  <b-row class="my-1">
    <b-col sm="2">
      <label for="input-small">Search:</label>
    </b-col>
    <b-col sm="10">
      <b-form-input v-model="search" size="sm" placeholder="Search CRF by name"></b-form-input>
    </b-col>
  </b-row>
  <b-table striped hover :items="filteredList" :fields="fields">
    <template v-slot:cell(crf)="data">
      {{ data.item.name }}
    </template>
    <template v-slot:cell(status)="data">
      {{ getStatus(data.item._id) }}
    </template>
    <template v-slot:cell(settings)="data">
      <b-button v-if="filled(data.item._id)" pill variant="outline-success" :to="{name:'CRFData', params: { patientId: patientId, crfId: data.item._id, new: true }}">New Record</b-button>
      <b-button v-if="filled(data.item._id)" pill variant="outline-success" :to="{name:'CRFData', params: { patientId: patientId, crfId: data.item._id, new: false }}">Edit</b-button>
      <b-button v-else pill variant="outline-success" :to="{name:'CRFData', params: { patientId: patientId, crfId: data.item._id, new: true }}">Fill out</b-button>
      <b-button pill variant="outline-success">Export</b-button>
      <b-button pill variant="outline-danger">Delete</b-button>
    </template>
  </b-table>
</div>
</template>

<script>
import {
  mapState
} from "vuex";
export default {
  name: "Patient",
  components: {},
  props: ["patientId"],
  data() {
    return {
      search: "",
      fields: [{
          key: "crf",
          label: "CRF",
          sortable: true
        },
        {
          key: "status",
          label: "Status",
          sortable: true
        },
        "Settings"
      ],
      crfData: []
    };
  },
  mounted() {
    this.$store.dispatch("crfs/GET_CRFS");
    this.$store.dispatch("patients/GET_PATIENT", this.patientId);
    this.$axios.get('/data/patient/' + this.patientId + '/crfs').then((payload) => {
      this.crfData = payload.data.payload
    })
  },
  methods: {
    getStatus(id) {
      if (this.crfData.some(elem => (elem.newestCRF === id || elem.crfId === id))) {
        return 'begonnen'
      } else {
        return 'nicht begonnen'
      }
    },
    filled(id) {
      return this.crfData.some(elem => (elem.newestCRF === id || elem.crfId === id))
    }
  },
  computed: {
    ...mapState("crfs", ["crfs"]),
    ...mapState("patients", ["patient"]),
    filteredList() {
      return this.crfs.filter(crf => {
        return crf.name.includes(this.search);
      });
    }
  }
};
</script>

<style scoped></style>
