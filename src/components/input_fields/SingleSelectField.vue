<template>
  <div>
    <b-container fluid>
      <b-row class="mt-1">
        <b-col sm="3">
          <label :for="options.name">{{ options.label }}</label>
        </b-col>
        <b-col sm="9">
          <b-form-select
            @change="changed()"          
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
  created() {
    if(!this.value) {
      this.localValue = this.options.defaultValue;
    } else {
      this.localValue = this.value;
    }
  },
  data() {
    return {
      localValue: null
    }
  },
  methods:{
    changed() {
      this.$emit('changed', this.localValue);
    },
  }
};
</script>
