<template>
  <div>
    <b-container fluid>
      <b-row class="mt-1">
        <b-col sm="3">
          <label :for="options.name">{{ options.label }}</label>
        </b-col>
        <b-col sm="5">
          <b-form-group>
            <b-form-radio-group
              :id="options.name"
              v-model="localValue"
              :options="options.choices"
              name="radio-options"
              @change.native="changeRadio()"
              stacked
            ></b-form-radio-group>
          </b-form-group>
        </b-col>
        <b-col sm="1">
          <b-button type="reset" variant="danger" @click="resetRadio()">{{ $t("Reset") }}</b-button>
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
  props: ["options", "value"],
  data() {
    return {
      localValue: null
    }
  },
  created() {
    this.localValue = this.value ? this.value.value : this.options.defaultValue;
  },
  methods: {
    resetRadio() {
      this.localValue = false;
      this.$emit('changed', this.localValue)
    },
    changeRadio(value) {
      this.$emit('changed', this.localValue)
    }
  },
  watch: {
    value: function () {
      if(this.value && (this.value.value || this.value.value === 0)) {
        this.localValue = this.value.value;
      } else {
        this.localValue = this.options.defaultValue;
      }
    }
  }
};
</script>
