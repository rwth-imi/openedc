<template>
  <div>
    <b-row>
      <b-col sm="10" class="mainPage">

        <h1>CRF: {{ crf.name }}</h1>
        <div
          v-for="subsection in crf.sections[section].subsection"
          :key="subsection.name"
        >
          <div v-if="subsection.name !== ''">
            <hr />
            <h3>{{ subsection.name }}</h3>
          </div>
          <div v-for="item in subsection.items" :key="item.name">
            <component v-bind:is="item.type" :options="item" :value="null"></component>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import FileUploadField from "@/components/input_fields/FileUploadField.vue";
import Checkboxes from "@/components/input_fields/Checkboxes.vue";
import TextField from "@/components/input_fields/TextField.vue";
import SingleSelectField from "@/components/input_fields/SingleSelectField.vue";
import RadioButtons from "@/components/input_fields/RadioButtons.vue";
import TextArea from "@/components/input_fields/TextArea.vue";
export default {
  name: "CRFs",
  components: {
    FileUploadField,
    Checkboxes,
    TextField,
    SingleSelectField,
    RadioButtons,
    TextArea
  },
  data() {
    return {
      section: 0,
      sections: [],
      patientId: null,
      date: "Wed Sep 30 2020",
      dates: ["Wed Sep 30 2020", "Thu Sep 17 2020", "Tue Sep 1 2020"]
    };
  },
  computed: {
    ...mapState("crfs", ["crf"])
  },
  created() {
    this.fetchData(this.$route.params.crfId)
     .then(() => {
       this.section = this.$route.params.section;
       this.createDataSections();
     });
  },
  methods: {
    fetchData(crfId) {
      return this.$store.dispatch("crfs/GET_CRF", crfId);
    },
    createDataSections() {
      this.crf.sections.forEach(section => {
        this.sections.push({
          name: section.name,
          title: section.title
        });
      });
    }
  },
  watch: {
    $route(to, from) {
      this.section = this.$route.params.section;
    }
  }
};
</script>

<style scoped>
h3 {
  text-align: left;
  margin: 10px;
}
</style>
