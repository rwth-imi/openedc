<template>
<div class="mainPage">
  <h1>Patients</h1>
  <div class="" align="right">
    <b-button pill variant="success" to="/register">Add</b-button>
  </div>
  <b-row class="my-1">
    <b-col sm="2">
      <label for="input-small">Search:</label>
    </b-col>
    <b-col sm="10">
      <b-form-input v-model="search" size="sm" placeholder="Search Patient by number"></b-form-input>
    </b-col>
  </b-row>
  <b-table striped hover :items="filteredList" :fields="fields">
    <template v-slot:cell(patientNumber)="data">
      <router-link :to="{ name: 'Patient', query: {patientNumber: data.value} }">{{ data.value }}</router-link>
    </template>
    <template v-slot:cell(birthday)="data">
      {{ data.value.toDateString() }}
    </template>
    <template v-slot:cell(crfs)="data">
      <div v-for="index in data.value" :key="index">
        <router-link :to="{ name: 'CRF', params: {crfId: getCRFId(index), section: 0, patientNumber: data.item.patientNumber} }">{{ getCRFName(index) }}</router-link>
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
export default {
  name: "Patients",
  components: {},
  data() {
    return {
      search: "",
      fields: [{
          key: 'patientNumber',
          label: 'No.',
          sortable: true
        },
        {
          key: 'sex',
          label: 'Gender',
          sortable: true
        },
        {
          key: 'birthday',
          label: 'Day of Birth',
          sortable: true,
        },
        {
          key: 'crfs',
          label: 'Filled CRFs'
        },
        'Settings'
      ],
      patients: [{
          patientNumber: "398961",
          sex: 'female',
          birthday: new Date(),
          crfs: [0,1]
        },
        {
          patientNumber: "594910",
          sex: 'male',
          birthday: new Date(),
          crfs: [0]
        }, {
          patientNumber: "394563",
          sex: 'female',
          birthday: new Date(),
          crfs: [1]
        }, {
          patientNumber: "323464",
          sex: 'male',
          birthday: new Date(),
          crfs: []
        }, {
          patientNumber: "640302",
          sex: 'female',
          birthday: new Date(),
          crfs: [0,1]
        }, {
          patientNumber: "398962",
          sex: 'female',
          birthday: new Date(),
          crfs: []
        },
      ],
      crfs: [{
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
      }]
    }
  },
  methods: {
    getCRFName(index) {
      return this.crfs[index].name
    },
    getCRFId(index) {
      return this.crfs[index].id
    }
  },
  computed: {
    filteredList() {
      return this.patients.filter(patient => {
        return patient.patientNumber.includes(this.search)
      })
    }
  }
}
</script>

<style scoped>

</style>
