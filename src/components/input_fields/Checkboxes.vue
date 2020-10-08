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
              :id="options.name"
              v-model="selected"
              :options="options.choices"
            ></b-form-checkbox-group>
          </b-form-group>

          <div>Selected: <strong>{{ selected }}</strong></div>
        </b-col>
      </b-row>
    </b-container>

  </div>
</template>

<script>
  export default {
    name: 'Checkboxes',
    props: ['options'],
    data() {
      return {
        selected: [], // Must be an array reference!

      }
    }
  }
</script>
