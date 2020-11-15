<template>
  <b-row class="actionBar">
    <b-col sm="3">
      <div v-if="multipleRecords">
        <label :for="'recordSelect'">Record:</label>
      </div>
    </b-col>
    <b-col sm="3">
      <div v-if="multipleRecords">
        <b-form-select
          id="recordSelect"
          v-model="localRecord"
          :options="records"
          class="mb-3"
          @change="changeRecord()"
        >
          <!-- This slot appears above the options from 'options' prop -->
          <template v-slot:first>
            <b-form-select-option :value="null" disabled
              >-- Please select a record --</b-form-select-option
            >
          </template>
          <!-- These options will appear after the ones from 'options' prop -->
          <b-form-select-option :value="{ id: 'new', crfId: crfId }"
            >New</b-form-select-option
          >
        </b-form-select>
      </div>
    </b-col>
    <b-col sm="6" class="actions">
      <b-button type="submit" variant="primary" @click="submit">Save</b-button>
      <b-button v-if="back" variant="danger" @click="onBack">Back</b-button>
    </b-col>
  </b-row>
</template>
<script>
export default {
  name: "ActionBar",
  props: ["multipleRecords", "record", "records", "crfId", "back"],
  data() {
    return {
      localRecord: null
    };
  },
  created() {
    this.localRecord = this.record;
  },
  methods: {
    submit() {
      this.$emit("submitted");
    },
    changeRecord() {
      this.$emit("changedRecord", this.localRecord);
    },
    onBack() {
      this.$emit("onBack");
    }
  }
};
</script>
<style scoped>
.actionBar {
  background-color: #e3e3e3;
  color: black;
  font-size: 20px;
  padding: 20px 20px 15px 20px;
}

.actionBar .actions {
  text-align: right;
}

.actionBar .actions button {
  background-color: #385723;
  color: white;
  border-color: #385723;
}

.actionBar .actions button.btn-danger {
  background-color: #dc3545;
  color: white;
  border-color: #dc3545;
}
</style>
