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
          >
            <template
              v-if="!this.options.choices.some(e => e.value === null)"
              #first
            >
              <b-form-select-option :value="null" disabled
                >-- {{ $t("selectOption") }} --</b-form-select-option
              >
            </template>
          </b-form-select>
        </b-col>
        <b-col sm="3">
          {{ options.notes }}
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
/**
 * Component for CRF single select fields
 */
export default {
  name: "SingleSelectField",
  props: {
    /**
     * Options for singleSelectField including the choices
     * {
     *  defaultValue: null,
     *  label: "",
     *  notes: "",
     *  choices: [{value: 0, text: ""}]
     * }
     */
    options: {
      type: Object,
      required: true
    },
    /**
     * Current value of selected option
     */
    value: {}
  },
  computed: {
    localValue: {
      get() {
        return this.value
          ? this.value.value
          : this.options.defaultValue || null;
      },
      set(newValue) {
        this.$emit("changed", newValue);
      }
    }
  }
};
</script>
