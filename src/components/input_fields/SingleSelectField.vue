<template>
  <div>
    <b-container fluid>
      <b-row class="mt-1">
        <b-col sm="3">
          <label :for="options.name">{{ options.label }}</label>
        </b-col>
        <b-col sm="6">
          <b-form-select
            :id="options.name"
            v-model="localValue"
            :options="options.choices"
          ></b-form-select>
        </b-col>
        <b-col sm="3">
          {{ options.notes }} {{ localValue }} {{ value }}
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "SingleSelectField",
  props: ["options", "value"],
  created() {
    if(!this.options.choices.some(e => e.value === null)){
      this.options.choices.push({ value: null, text: 'Please select an option' });
    }
  },
  computed: {
    localValue: {
      get() {
        return this.value ? this.value.value : this.options.defaultValue},
      set(newValue) { console.log('jo', newValue);this.$emit('changed', newValue)}
    }
  },
};
</script>
