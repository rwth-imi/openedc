<template>
<div>
  <b-container fluid>
    <b-row class="my-1">
      <b-col sm="3">
        <label :for="options.name">{{ options.label }}:</label>
      </b-col>
      <b-col sm="9">
        <b-form-input @change="changed()" v-model="localValue" :id="options.name" :type="options.validationType" :placeholder="options.defaultValue"></b-form-input>
      </b-col>
    </b-row>
  </b-container>
</div>
</template>

<script>
export default {
  name: "TextField",
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
