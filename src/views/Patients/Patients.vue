<template>
  <div class="mainPage">
    <h1>{{ $t("Patients") }}</h1>
    <div class="" align="right">
      <b-button pill variant="success" to="/patients/register">{{
        $t("Add")
      }}</b-button>
    </div>
    <b-row class="my-1">
      <b-col sm="2">
        <label for="search">{{ $t("Search") }}:</label>
      </b-col>
      <b-col sm="10">
        <b-form-input
          id="search"
          v-model="search"
          size="sm"
          :placeholder="$t('searchBy', { what: $t('Patient'), by: $t('id') })"
        ></b-form-input>
      </b-col>
    </b-row>
    <b-table striped hover :items="filteredList" :fields="fields">
      <template v-slot:cell(settings)="data">
        <b-button
          pill
          variant="outline-success"
          :to="{
            name: 'Patient',
            params: { patientId: data.item._id }
          }"
          >{{ $t("Select") }}</b-button
        >
        <b-button
          pill
          variant="outline-success"
          :to="{
            name: 'PatientRegister',
            params: { patientId: data.item._id }
          }"
          >{{ $t("Edit") }}</b-button
        >
<!--        <b-button pill variant="outline-success">{{ $t("Export") }}</b-button>-->
        <b-button
          pill
          variant="outline-danger"
          @click="deletePatient(data.item._id)"
          >{{ $t("Delete") }}</b-button
        >
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
    this.$store.dispatch("patients/GET_PATIENTS_FULL");
    this.$store.dispatch("crfs/GET_CRF_PATIENT");
  },
  computed: {
    ...mapState("patients", ["patients"]),
    ...mapState("crfs", ["crf"]),
    /**
     * filters list of patients for search field.
     * @returns {any[]}
     */
    filteredList() {
      if (this.patients) {
        return this.patients.filter(patient => {
          let found = false;
          Object.entries(patient).forEach(field => {
            if (
              (field[1] + "").toLowerCase().includes(this.search.toLowerCase())
            ) {
              found = true;
            }
          });
          return found;
        });
      } else {
        return [];
      }
    },
    /**
     * fields for display table
     * @returns {[]|({label: string, sortable: boolean, key: string}|string|VueI18n.LocaleMessages)[]}
     */
    fields() {
      const dataFields = [];
      if (!this.crf || !this.crf.sections || this.crf.name !== "Patient")
        return [
          { key: "_id", label: "ID", sortable: true },
          { key: "settings", label: this.$t("Settings") }
        ];
      this.crf.sections.forEach(section => {
        section.subsection.forEach(subsection => {
          subsection.items.forEach(item => {
            if (item.summary) {
              dataFields.push({
                key: item.name,
                label: item.label,
                sortable: true
              });
            }
          });
        });
      });
      dataFields.push({ key: "settings", label: this.$t("Settings") });
      return dataFields;
    }
  },
  data() {
    return {
      search: ""
    };
  },
  methods: {
    deletePatient(patientId) {
      this.$store.dispatch("patients/DESTROY_PATIENT", patientId);
    }
  }
};
</script>

<style scoped></style>
