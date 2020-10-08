<template lang="html">
  <div>
    <b-card no-body class="text-center">
    <div class="bg-secondary text-light">
      <b-row>
        <b-col sm="3">
          <label>Patient: </label>
        </b-col>
        <b-col sm="9" style="text-align: left">
          {{ patientNumber }}
        </b-col>
      </b-row>

      <b-row>
        <b-col sm="3">
          <label :for="date-select">Date:</label>
        </b-col>
        <b-col sm="9">
          <b-form-select id="date-select" v-model="date" :options="dates" class="mb-3">
            <!-- This slot appears above the options from 'options' prop -->
            <template v-slot:first>
              <b-form-select-option :value="null" disabled>-- Please select a date --</b-form-select-option>
            </template>
            <template v-slot:first>
              <b-form-select-option :value="null" disabled>-- Please select a date --</b-form-select-option>
            </template>
            <!-- These options will appear after the ones from 'options' prop -->
            <b-form-select-option value="new">New</b-form-select-option>
          </b-form-select>
        </b-col>
      </b-row>
    </div>
  </b-card>
  </div>
</template>

<script>
export default {
  name: 'PatientDisplay',
  props: ['patientNumber', 'date', 'dates']
}
</script>

<style lang="css" scoped>
</style>
