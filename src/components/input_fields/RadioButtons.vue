<template>
  <div>
    <b-container fluid>
      <b-row class="mt-1">
        <b-col sm="3">
          <label for="textarea-default">{{ options.label }}</label>
        </b-col>
        <b-col sm="9">
          <b-form-group>
            <b-form-radio-group
              :id="options.name"
              v-model="localValue"
              :options="options.choices"
              name="radio-options"
            ></b-form-radio-group>
          </b-form-group>

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
