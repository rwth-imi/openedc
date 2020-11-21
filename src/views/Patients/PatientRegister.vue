<template>
  <div class="mainPage">
    <h1 v-if="patientId">{{ $t("EditPatient") }}</h1>
    <h1 v-else>{{ $t("Register Patient")}}</h1>
    <b-col sm="12" class="mainPage" v-if="show">
      <CRF
        :crf-id="crf._id"
        :data="data"
        :section="section"
        :sections="sections"
      ></CRF>
      <ActionBar
        :record="null"
        :records="[]"
        :crf-id="crf.newestVersion || crf._id"
        :multiple-records="crf.multipleRecords"
        @submitted="onSubmit"
        :back="true"
        @onBack="onBack"
      ></ActionBar>
    </b-col>
  </div>
</template>

<script>
import ActionBar from "@/components/ActionBar";
import CRF from "@/components/CRF";
import { mapState } from "vuex";

export default {
  name: "PatientRegister",
  components: {
    ActionBar,
    CRF
  },
  data() {
    return {
      section: 0,
      sections: [],
      data: {},
      patientId: null,
      show: false,
      new: false
    };
  },
  computed: {
    ...mapState("crfs", ["crf"])
  },
  created() {
    this.patientId = this.$route.params.patientId;
    // fetches the patient CRF
    this.$store.dispatch("crfs/GET_CRF_PATIENT").then(status => {
      if (status.success) {
        this.show = true;
        if (this.patientId !== null && this.patientId !== undefined) {
          this.$axios
            .get(`/patient/${this.patientId}/full`)
            .then(payload => {
              this.data = payload.data.payload;
            })
            .catch(err => {
              if (err.response.status === 404) {
                this.new = true;
                console.log("no patient record found create new one");
              }
            });
        }
      } else {
        // If status code = 404 the patient CRF is not avaiable
        // therefore patients can be created without data.
        if (status.errorCode === 404) {
          this.$axios.post("patient/").then(() => {
            this.$router.push({ name: "Patients" });
          });
        }
      }
    });
  },
  methods: {
    onSubmit() {
      // three possibities:
      // 1. No patientID => create new patient
      // 2. patientID, but no data before (Patient CRF uploaded later) then, create new record for patient
      // 3. patientID and record: update existing data
      if (this.patientId !== null && this.patientId !== undefined) {
        if (this.new) {
          this.$axios
            .post(`/data/patient/${this.patientId}/crf/${this.crf._id}/full`, {
              data: this.data,
              formsId: this.crf.formsId
            })
            .then(() => {
              this.$router.push({ name: "Patients" });
            });
        } else {
          this.$axios
            .put(
              `/data/patient/${this.patientId}/crf/${this.data.recordId}/full`,
              {
                data: this.data,
                formsId: this.crf.formsId,
                migrate: true
              }
            )
            .then(() => {
              this.$router.push({ name: "Patients" });
            });
        }
      } else {
        this.$axios.post("patient/").then(({ data }) => {
          this.$axios
            .post(
              `/data/patient/${data.payload._id}/crf/${this.crf._id}/full`,
              { data: this.data, formsId: this.crf.formsId }
            )
            .then(() => {
              this.$router.push({ name: "Patients" });
            });
        });
      }
    },
    onReset(evt) {
      evt.preventDefault();
      // Reset our form values
      this.form.file = [];
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
    onBack() {
      this.$router.push({ name: "Patients" });
    }
  }
};
</script>

<style scoped></style>
