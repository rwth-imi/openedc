<template>
  <div>
    <b-container fluid>
      <b-row class="mt-1">
        <b-col sm="3">
          <label for="textarea-default">{{ options.label }}</label>
        </b-col>
        <b-col sm="9">
          <b-form-textarea
            @change="changed()"          
            v-model="localValue"
            :id="options.name"
            :placeholder="options.defaultValue"
          ></b-form-textarea>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
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
