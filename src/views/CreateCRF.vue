<template>
<div class="mainPage">
  <h1>Create CRF</h1>
  <div>
    <b-card bg-variant="light">
      <b-form @submit="onSubmit" @reset="onReset" v-if="show">
        <b-form-group label-cols-lg="3" label="Create CRF" label-size="lg" label-class="font-weight-bold pt-0" class="mb-0">
          <b-form-group label-cols-sm="3" label="Upload File:" label-align-sm="right" label-for="nested-file">
            <b-form-file v-model="form.file" :state="Boolean(form.file)" placeholder="Choose a file or drop it here..." drop-placeholder="Drop file here..." name="filename"></b-form-file>
            <div class="mt-3">Selected file: {{ form.file ? form.file.name : '' }}</div>
          </b-form-group>
        </b-form-group>
        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
    </b-card>
  </div>
</div>
</template>

<script>
export default {
  name: "CRFs",
  components: {},
  data() {
    return {
      form: {
        file: []
      },
      show: true
    };
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      const formData = new FormData();
      formData.append("filename", "TestCRF-" + Date.now() + ".json")
      formData.append("file", this.form.file);
      this.axios.post('crf/upload/', formData)
        .then((data) => {
          console.log('response', data)
        })
    },
    onReset(evt) {
      evt.preventDefault();
      // Reset our form values
      this.form.file = [];
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    }
  }
};
</script>

<style scoped></style>
