<template>
<div class="mainPage">
  <h1>Create CRF</h1>
  <div>
    <b-card bg-variant="light">
      <b-form-group label-cols-lg="3" label="Create CRF" label-size="lg" label-class="font-weight-bold pt-0" class="mb-0">
        <!-- <b-form-group label-cols-sm="3" label="Name:" label-align-sm="right" label-for="nested-name">
          <b-form-input id="nested-name"></b-form-input>
        </b-form-group>

        <b-form-group label-cols-sm="3" label="language:" label-align-sm="right" label-for="nested-lang">
          <b-form-input id="nested-lang"></b-form-input>
        </b-form-group>

        <b-form-group label-cols-sm="3" label="Description:" label-align-sm="right" label-for="nested-description">
          <b-form-textarea id="nested-description"></b-form-textarea>
        </b-form-group>

        <b-form-group label-cols-sm="3" label="Version:" label-align-sm="right" label-for="nested-version">
          <b-form-input id="nested-version"></b-form-input>
        </b-form-group>

        <b-form-group label-cols-sm="3" label="Version Description:" label-align-sm="right" label-for="nested-version-description">
          <b-form-input id="nested-version-description"></b-form-input>
        </b-form-group> -->

        <b-form-group label-cols-sm="3" label="Upload File:" label-align-sm="right" label-for="nested-file">
          <b-form-file
            v-model="file1"
            :state="Boolean(file1)"
            placeholder="Choose a file or drop it here..."
            drop-placeholder="Drop file here..."
          ></b-form-file>
        </b-form-group>
      </b-form-group>
    </b-card>
  </div>
</div>
</template>

<script>
export default {
  name: "CRFs",
  components: {
  },
  data() {
    return {
      file1: [],
    }
  }
}
</script>

<style scoped>

</style>
