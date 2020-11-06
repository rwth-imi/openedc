<template>
  <div class="mainPage">
    <h1>Register Patient</h1>
    <div>
      <b-card bg-variant="light">
        <b-form @submit="onSubmit" @reset="onReset">
          <b-form-group
            label-cols-lg="3"
            label="Register Patient"
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
              <b-form-input
                id="nested-patientId"
                v-model="patient.patientId"
              ></b-form-input>
            </b-form-group>

            <b-form-group
              label-cols-sm="3"
              label="Gender:"
              label-align-sm="right"
              label-for="nested-sex"
            >
              <b-form-radio-group
                id="radio-sex"
                v-model="patient.sex"
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
              <b-form-datepicker
                id="birth-datepicker"
                v-model="patient.birth"
                class="mb-2"
              ></b-form-datepicker>
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
export default {
  name: "PatientRegister",
  components: {},
  data() {
    return {
      patient: {
        sex: "none",
        birth: null
      }
    };
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      this.axios
        .post("patient/", {
          patient: this.patient
        })
        .then(data => {
          console.log("response", data);
          this.$router.push({ name: "Patients" });
        });
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
    }
  }
};
</script>

<style scoped></style>
