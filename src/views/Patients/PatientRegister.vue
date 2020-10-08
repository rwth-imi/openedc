<template>
  <div class="mainPage">
    <h1>Create CRF</h1>
    <div>
      <b-card bg-variant="light">
        <b-form-group
          label-cols-lg="3"
          label="Create CRF"
          label-size="lg"
          label-class="font-weight-bold pt-0"
          class="mb-0"
        >
          <b-form-group
            label-cols-sm="3"
            label="Firstname:"
            label-align-sm="right"
            label-for="nested-firstname"
          >
            <b-form-input id="nested-firstname"></b-form-input>
          </b-form-group>

          <b-form-group
            label-cols-sm="3"
            label="Lastname:"
            label-align-sm="right"
            label-for="nested-lastname"
          >
            <b-form-input id="nested-lastname"></b-form-input>
          </b-form-group>

          <b-form-group
            label-cols-sm="3"
            label="Gender:"
            label-align-sm="right"
            label-for="nested-sex"
          >
            <b-form-radio-group
              id="radio-sex"
              v-model="sex"
              name="radio-sub-component"
            >
              <b-form-radio value="male">Male</b-form-radio>
              <b-form-radio value="female">Female</b-form-radio>
              <b-form-radio value="none" disabled>None</b-form-radio>
            </b-form-radio-group>
          </b-form-group>

          <b-form-group
            label-cols-sm="3"
            label="Description:"
            label-align-sm="right"
            label-for="nested-description"
          >
            <b-form-textarea id="nested-description"></b-form-textarea>
          </b-form-group>

          <b-form-group
            label-cols-sm="3"
            label="Version:"
            label-align-sm="right"
            label-for="nested-version"
          >
            <b-form-input id="nested-version"></b-form-input>
          </b-form-group>

          <b-form-group
            label-cols-sm="3"
            label="Version Description:"
            label-align-sm="right"
            label-for="nested-version-description"
          >
            <b-form-input id="nested-version-description"></b-form-input>
          </b-form-group>
        </b-form-group>
      </b-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "PatientRegister",
  components: {},
  data() {
    return {};
  }
};
</script>

<style scoped></style>
