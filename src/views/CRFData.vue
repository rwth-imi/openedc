<template>
  <div>
    <b-row>
      <b-col sm="2" class="sidebarCRFs">
        <SidebarCRFs :crf="crf"></SidebarCRFs>
      </b-col>
      <b-col sm="10" class="mainPage"
      v-if="show">
        <b-button type="submit" variant="primary" @click="submit">Submit</b-button>
        <PatientDisplay
          :patientId="patientId"
          :date="data.record"
          :dates="dates"
        ></PatientDisplay>

        <h1>CRF: {{ crf.name }}</h1>
        <div
          v-for="subsection in crf.sections[section].subsection"
          :key="subsection.name"
        >
          <div v-if="subsection.name != ''">
            <hr />
            <h3>{{ subsection.name }}</h3>
          </div>
          <div v-for="(item, index) in subsection.items" :key="item.name">
            <component :ref="item.name" v-bind:is="item.type" :options="item" :value="data[item.name]" @changed="changed(subsection, index, item.name, $event)"></component>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import SidebarCRFs from "@/components/SidebarCRFs.vue";
import PatientDisplay from "@/components/PatientDisplay.vue";
import FileUploadField from "@/components/input_fields/FileUploadField.vue";
import Checkboxes from "@/components/input_fields/Checkboxes.vue";
import TextField from "@/components/input_fields/TextField.vue";
import SingleSelectField from "@/components/input_fields/SingleSelectField.vue";
import RadioButtons from "@/components/input_fields/RadioButtons.vue";
import TextArea from "@/components/input_fields/TextArea.vue";
export default {
  name: "CRFData",
  components: {
    SidebarCRFs,
    PatientDisplay,
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
      dates: ["Wed Sep 30 2020", "Thu Sep 17 2020", "Tue Sep 1 2020"],
      show: false,
      data: {
        "record": 'test',
        "study_id": 'test' // TODO: No Idwa why, but this has to be included!
      },
      new: true
    };
  },
  computed: {
    ...mapState("crfs", ["crf"])
  },
  created() {
    this.patientId = this.$route.params.patientId;
    this.fetchData(this.$route.params.crfId, this.patientId).then(() =>{
      this.createDataSections();
      this.show = true;
    })
  },
  methods: {
    fetchData(crfId, patientId) {
      return this.$store.dispatch("crfs/GET_CRF", crfId).then(() => {
        if(this.$route.params.new) {
          this.new = true;
        } else {
          this.new = false;
          //this.$store.dispatch("crfs/GET_DATA", crfId, number, )
          this.$axios.get(`/data/patient/${this.patientId}/crf/${this.$route.params.crfId}`).then((payload) => {
            // TODO: aktualisiere data in child components
            payload.data.payload.data.forEach((item, i) => {
              this.data[item.field] = {};
              this.data[item.field].value = item.value;
              this.data[item.field]._id = item._id;
            });
          })
        }
      });
    },
    createDataSections() {
      this.crf.sections.forEach(section => {
        this.sections.push({
          name: section.name,
          title: section.title
        });
      });
    },
    changed(section, index, name, changedValue) {
      if(!this.data[name]) this.data[name] = {}
      this.data[name].value = changedValue;
      section.items[index].value = changedValue;
    },
    submit() {
      if(this.new) {
        this.$axios.post(`/data/patient/${this.patientId}/crf/${this.$route.params.crfId}/full`, { data: this.data }).then(() => {
          console.log('saved!')
        })
      } else {
        this.$axios.put(`/data/patient/${this.patientId}/crf/${this.$route.params.crfId}/full`, { data: this.data }).then(() => {
          console.log('updated!')
        })
      }

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

.sidebarCRFs {
  border-right: #385723 1px solid;
  background-color: #e2f0d9;
  text-align: left;
}

.sidebarCRFs a {
  color: #385723 !;
}
</style>
