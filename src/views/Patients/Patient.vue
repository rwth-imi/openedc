<template>
  <div class="mainPage">
    <h1>{{ $t("Patient") }}: {{ patientId }}</h1>
    <b-row class="my-1">
      <b-col sm="2">
        <label for="input-small">{{ $t("Search")}}:</label>
      </b-col>
      <b-col sm="10">
        <b-form-input
          v-model="search"
          size="sm"
          :placeholder="$t('searchBy', { what: $t('crf'), by: $t('name')})"
        ></b-form-input>
      </b-col>
    </b-row>
    <b-table striped hover :items="filteredList" :fields="fields">
      <template v-slot:cell(crf)="data">
        {{ data.item.name }}
      </template>
      <template v-slot:cell(status)="data">
        {{ getStatus(data.item.formsId, data.item._id) }}
      </template>
      <template v-slot:cell(settings)="data">
        <div class="settings">
          <b-button
            v-if="filled(data.item.formsId, data.item._id)"
            pill
            variant="outline-success"
            :to="{
              name: 'CRFData',
              params: { patientId: patientId, crfId: data.item._id, new: false }
            }"
            >{{ $t("Edit")}}</b-button
          >
          <b-button
            pill
            variant="outline-success"
            :to="{
              name: 'CRFData',
              params: { patientId: patientId, crfId: data.item._id, new: true }
            }"
            >{{ $t("New Record")}}</b-button
          >
          <b-button pill variant="outline-success">{{ $t("Export")}}</b-button>
          <b-button pill variant="outline-danger">{{ $t("Delete")}}</b-button>
        </div>
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Patient",
  components: {},
  data() {
    return {
      search: "",
      fields: [
        {
          key: "crf",
          label: this.$t("crf"),
          sortable: true
        },
        {
          key: "status",
          label: this.$t("Status"),
          sortable: true
        },
        this.$t("Settings")
      ],
      crfData: [],
      patientId: null
    };
  },
  created() {
    if(!this.patientId && this.$route.params.patientId) this.patientId = this.$route.params.patientId;
    this.$store.dispatch("crfs/GET_CRFS");
    this.$store.dispatch("patients/GET_PATIENT", this.patientId);
    this.$axios
      .get("/data/patient/" + this.patientId + "/crfs")
      .then(payload => {
        this.crfData = payload.data.payload;
      });
  },
  methods: {
    getStatus(formsId, id) {
      const filtered = this.crfData.filter(elem => elem.formsId === formsId);
      if (filtered.length > 0) {
        return filtered.length + " " + this.$t("filled");
      } else {
        return this.$t("notStarted");
      }
    },
    filled(formsId, id) {
      console.log('filled', this.crfData, formsId, id)
      return this.crfData.some(
        elem => elem.formsId === formsId || elem.crfId === id //TODO nach || nur abwärtskompatibilität
      );
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
