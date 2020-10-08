<template>
  <div>
    <b-container fluid>
      <b-row class="mt-1">
        <b-col sm="3">
          <label :for="options.name">{{ options.label }}</label>
        </b-col>
        <b-col sm="9">
          <b-form-select
            :id="options.name"
            v-model="selected"
            :options="options.choices"
          ></b-form-select>
          <div class="mt-3">
            Selected: <strong>{{ selected }}</strong>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "SingleSelectField",
  props: ["options"],
  data() {
    return {
      selected: null
    };
  }
};
</script>
