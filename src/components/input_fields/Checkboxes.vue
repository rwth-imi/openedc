<template>
  <div>
    <b-container fluid>
      <b-row class="my-1">
        <b-col sm="3">
          <label :for="options.name">{{ options.label }}:</label>
        </b-col>
        <b-col sm="9">
          <b-form-group>
            <b-form-checkbox-group
              @change="changed()"           
              :id="options.name"
              v-model="localValue"
              :options="options.choices"
            ></b-form-checkbox-group>
          </b-form-group>

          <div>
            Selected: <strong>{{ localValue }}</strong>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "Checkboxes",
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
