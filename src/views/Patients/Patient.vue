<template>
  <div class="mainPage">
    <h1>Patient: {{ patientId }}</h1>
    <b-row class="my-1">
      <b-col sm="2">
        <label for="input-small">Search:</label>
      </b-col>
      <b-col sm="10">
        <b-form-input
          v-model="search"
          size="sm"
          placeholder="Search CRF by name"
        ></b-form-input>
      </b-col>
    </b-row>
    <b-table striped hover :items="filteredList" :fields="fields">
      <template v-slot:cell(crf)="data">
        {{ data.item.name }}
      </template>
      <template v-slot:cell(status)="data">
        {{ getStatus(data.item.id) }}
      </template>
      <template v-slot:cell(settings)="data">
        <b-button v-if="filled(data.item.id)" pill variant="outline-success"
          >Edit</b-button
        >
        <b-button v-else pill variant="outline-success">Fill out</b-button>
        <b-button pill variant="outline-success">Export</b-button>
        <b-button pill variant="outline-danger">Delete</b-button>
      </template>
    </b-table>
    <p class="h1 mb-2"><b-icon icon="plus-circle"></b-icon></p>
  </div>
</template>

<script>
export default {
  name: "Patient",
  components: {},
  props: ["patientId"],
  data() {
    return {
      search: "",
      fields: [
        {
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
      ],
      filledCrfs: [0]
    };
  },
  methods: {
    getStatus(id) {
      return this.filledCrfs.includes(id) ? "filled" : "not started";
    },
    filled(id) {
      return this.filledCrfs.includes(id);
    }
  },
  computed: {
    filteredList() {
      return this.crfs.filter(crf => {
        return crf.name.includes(this.search);
      });
    }
  }
};
</script>

<style scoped></style>
