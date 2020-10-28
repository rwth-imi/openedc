<template>
  <div class="mainPage">
    <h1>Edit Patient</h1>
    <div>
      <b-card bg-variant="light">
        <b-form @submit="onSubmit" @reset="onReset">
          <b-form-group
              label-cols-lg="3"
              label="Edit Patient"
              label-size="lg"
              label-class="font-weight-bold pt-0"
              class="mb-0"
          >
            <b-form-group
                label-cols-sm="3"
                label="Patient ID:"
                label-align-sm="right"
                label-for="nested-patientId"
            >
              <b-form-input id="nested-patientId" v-model="localPatient.patientId"></b-form-input>
            </b-form-group>

            <b-form-group
                label-cols-sm="3"
                label="Gender:"
                label-align-sm="right"
                label-for="nested-sex"
            >
              <b-form-radio-group
                  id="radio-sex"
                  v-model="localPatient.sex"
                  name="radio-sub-component"
              >
                <b-form-radio value="male">Male</b-form-radio>
                <b-form-radio value="female">Female</b-form-radio>
                <b-form-radio value="none" disabled>None</b-form-radio>
              </b-form-radio-group>
            </b-form-group>
            <b-form-group
                label-cols-sm="3"
                label="Date of Birth:"
                label-align-sm="right"
                label-for="birth-datepicker"
            >
              <b-form-datepicker id="birth-datepicker" v-model="localPatient.birth" class="mb-2"></b-form-datepicker>
            </b-form-group>

          </b-form-group>
          <b-button type="submit" variant="primary">Submit</b-button>
          <b-button type="reset" variant="danger">Reset</b-button>
        </b-form>
      </b-card>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "PatientEdit",
  components: {},
  data() {
    return {
      localPatient: {
        sex: "none",
        birth: null
      }
    };
  },
  computed: {
    ...mapState("patients", ["patient"])
  },
  mounted() {
    this.localPatient = this.patient;
    this.$store.dispatch("patients/GET_PATIENT", this.$route.params.patientId);
  },
  watch: {
    patient: "setLocalPatient"
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      this.axios.put('patient/'+this.patient._id, {
        "patient": this.localPatient
      })
          .then((data) => {
            console.log('response', data)
            this.$router.push({name: 'Patients'})
          })
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
    setLocalPatient() {
      this.localPatient = this.patient;
    }
  }
};
</script>

<style scoped></style>
