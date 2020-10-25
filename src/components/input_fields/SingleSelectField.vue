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
            v-model="localValue"
            :options="options.choices"
          ></b-form-select>
          <div class="mt-3">
            Selected: <strong>{{ localValue }}</strong>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "SingleSelectField",
  props: ["options", "value"],
  computed: {
    localValue: {
      get() {
        return this.value ? this.value.value : this.options.defaultValue},
      set(newValue) { this.$emit('changed', newValue)}
    }
  },
};
</script>
