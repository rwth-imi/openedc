<template>
<div>
  <b-container fluid>
    <b-row class="my-1">
      <b-col sm="3">
        <label :for="options.name">{{ options.label }}:</label>
      </b-col>
      <b-col sm="9">
        <b-form-input v-model="value" :id="options.name" :type="options.validationType" :placeholder="options.defaultValue"></b-form-input>
      </b-col>
    </b-row>
  </b-container>
</div>
</template>

<script>
export default {
  name: 'TextField',
  props: ['options'],
  created() {
    console.log('options', this.options)
  },
  data() {
    return {
      value: this.options.placeholder
    }
  }
}
</script>
