<template>
  <div>
    <b-container fluid>
      <b-row class="my-1">
        <b-col sm="3">
          <label :for="options.name">{{ options.label }}:</label>
        </b-col>
        <b-col sm="6">
          <b-form-input
            v-model="localValue"
            :id="options.name"
            :type="options.validationType"
            :placeholder="options.defaultValue"
          ></b-form-input>
        </b-col>
        <b-col sm="3">
          {{ options.notes }}
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "TextField",
  props: {
    /**
     * Options for text field
     * {
     *  defaultValue: "",
     *  label: "",
     *  notes: "",
     * }
     */
    options: {
      type: Object,
      required: true
    },
    /**
     * Current value of text field
     */
    value: {}
  },
  computed: {
    localValue: {
      get() {
        return this.value ? this.value.value : this.options.defaultValue;
      },
      set(newValue) {
        this.$emit("changed", newValue);
      }
    }
  }
};
</script>
