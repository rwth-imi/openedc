<template>
  <div>
    <b-container fluid>
      <b-row class="my-1">
        <b-col sm="3">
          <label :for="options.name">{{ options.label }}:</label>
        </b-col>
        <b-col sm="6">
          <b-form-group>
            <b-form-checkbox-group
              :id="options.name"
              v-model="localValue"
              :options="options.choices"
              @change.native="changeCheck"
            ></b-form-checkbox-group>
          </b-form-group>
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
  name: "Checkboxes",
  props: ["options", "value"],
  data() {
    return {
      localValue: []
    };
  },
  created() {
    if (this.value && (this.value.value || this.value.value === 0)) {
      this.setLocalValue(this.value.value);
    } else {
      if(!this.options.defaultValue) {
        this.options.defaultValue = [];
      }
      this.setLocalValue(this.options.defaultValue);
    }
  },
  methods: {
    changeCheck(value) {
      this.$emit("changed", this.localValue);
    },
    setLocalValue(value) {
      if(!Array.isArray(value) && typeof value === "number") {
        value = [value];
      }
      this.localValue = value;
    }
  },
  watch: {
    value: function() {
      if (this.value && (this.value.value || this.value.value === 0)) {
        this.setLocalValue(this.value.value);
      } else {
        this.setLocalValue(this.options.defaultValue);
      }
    }
  }
};
</script>
