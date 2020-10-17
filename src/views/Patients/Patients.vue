<template>
  <div class="mainPage">
    <h1>Patients</h1>
    <div class="" align="right">
      <b-button pill variant="success" to="/patients/register">Add</b-button>
    </div>
    <b-row class="my-1">
      <b-col sm="2">
        <label for="input-small">Search:</label>
      </b-col>
      <b-col sm="10">
        <b-form-input
          v-model="search"
          size="sm"
          placeholder="Search Patient by id"
        ></b-form-input>
      </b-col>
    </b-row>
    <b-table striped hover :items="filteredList" :fields="fields">
      <template v-slot:cell(patientId)="data">
        <router-link
          :to="{ name: 'Patient', query: { patientId: data.value } }"
          >{{ data.value }}</router-link
        >
      </template>
      <template v-slot:cell(birth)="data">
        {{ data.value }}
      </template>
      <template v-slot:cell(crfs)="data">
        <div v-for="index in data.value" :key="index">
          <router-link
            :to="{
              name: 'CRF',
              params: {
                crfId: getCRFId(index),
                section: 0,
                patientId: data.item.patientId
              }
            }"
            >{{ getCRFName(index) }}</router-link
          >
          <b-icon-pencil></b-icon-pencil>
          <b-icon-plus-circle></b-icon-plus-circle>
        </div>
        <b-icon-plus-circle></b-icon-plus-circle>
      </template>
      <template v-slot:cell(settings)="">
        <b-button pill variant="outline-success">Edit</b-button>
        <b-button pill variant="outline-success">Fill out</b-button>
        <b-button pill variant="outline-success">Export</b-button>
        <b-button pill variant="outline-danger">Delete</b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Patients",
  components: {},
  mounted() {
    this.$store.dispatch("patients/GET_PATIENTS");
  },
  computed: {
    ...mapState("patients", ["patients"]),
    filteredList() {
      return this.patients.filter(patient => {
        return patient.patientId.includes(this.search.toLowerCase())
      })
    }
  },
  data() {
    return {
      search: "",
      fields: [
        {
          key: "patientId",
          label: "No.",
          sortable: true
        },
        {
          key: "sex",
          label: "Gender",
          sortable: true
        },
        {
          key: "birth",
          label: "Day of Birth",
          sortable: true
        },
        {
          key: "crfs",
          label: "Filled CRFs"
        },
        "Settings"
      ],
      crfs: [
        {
          name: "First CRF",
          countFilled: 2,
          createdAt: new Date(),
          id: 0
        },
        {
          name: "Second CRF",
          countFilled: 4,
          createdAt: new Date(),
          id: 1
        }
      ]
    };
  },
  methods: {
    getCRFName(index) {
      return this.crfs[index].name;
    },
    getCRFId(index) {
      return this.crfs[index].id;
    }
  },
};
</script>

<style scoped></style>
