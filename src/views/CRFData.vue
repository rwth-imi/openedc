<template>
  <div>
    <sidebar-menu
      id="sidebar"
      :menu="menu"
      @toggle-collapse="onToggleCollapse"
      :collapsed="collapsed"
      theme="white-theme"
    >
      <span slot="toggle-icon"
        ><font-awesome-icon :icon="['fas', 'arrows-alt-h']"
      /></span>
      <span slot="dropdown-icon"><font-awesome-icon icon="caret-down"/></span>
    </sidebar-menu>
    <div id="sidebarpage" :class="[{ collapsed: collapsed }]">
      <b-col sm="12" class="mainPage" v-if="show">
        <b-row class="actionBar">
          <b-col sm="3">
            <label :for="'recordSelect'">Record:</label>
          </b-col>
          <b-col sm="3">
            <b-form-select
                id="recordSelect"
                v-model="record"
                :options="records"
                class="mb-3"
                @change="changeRecord()"
            >
              <!-- This slot appears above the options from 'options' prop -->
              <template v-slot:first>
                <b-form-select-option :value="null" disabled
                >-- Please select a record --</b-form-select-option
                >
              </template>
              <!-- These options will appear after the ones from 'options' prop -->
              <b-form-select-option value="new">New</b-form-select-option>
            </b-form-select>
          </b-col>
          <b-col sm="6" class="actions">
            <b-button type="submit" variant="primary" @click="submit"
            >Save
            </b-button>
          </b-col>
        </b-row>

        <h1>CRF: {{ crf.name }}</h1>
        <div v-if="section === null">
          <div v-for="(sectionItem, section) in crf.sections" :key="section">
            <h2>Section: {{ sectionItem.title }}</h2>
            <hr class="section" />
            <div
              v-for="subsection in crf.sections[section].subsection"
              :key="subsection.name"
            >
              <div v-if="subsection.name !== ''">
                <hr class="subsection" />
                <h3>{{ subsection.name }}</h3>
              </div>
              <div v-for="(item, index) in subsection.items" :key="item.name">
                <component
                  :ref="item.name"
                  v-bind:is="item.type"
                  :options="item"
                  :value="data[item.name]"
                  @changed="changed(subsection, index, item.name, $event)"
                ></component>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div
            v-for="subsection in crf.sections[section].subsection"
            :key="subsection.name"
          >
            <div v-if="subsection.name !== ''">
              <hr />
              <h3>{{ subsection.name }}</h3>
            </div>
            <div v-for="(item, index) in subsection.items" :key="item.name">
              <component
                :ref="item.name"
                v-bind:is="item.type"
                :options="item"
                :value="data[item.name]"
                @changed="changed(subsection, index, item.name, $event)"
              ></component>
            </div>
          </div>
        </div>
      </b-col>
    </div>
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
        record: "test1"
      },
      new: true,
      crfData: [],
      collapsed: false,
      records: [],
      record: "new"
    };
  },
  computed: {
    ...mapState("crfs", ["crfs", "crf"]),
    menu() {
      const ret = [
        {
          header: true,
          title: "Patient",
          hiddenOnCollapse: true
        },
        {
          title: "Number: " + this.patientId,
          href: {
            name: "Patient",
            query: { patientId: this.patientId },
            params: { patientId: this.patientId }
          },
          icon: {
            element: "font-awesome-icon",
            attributes: {
              icon: "user-injured"
            }
          }
        },
        {
          header: true,
          title: "CRFs",
          hiddenOnCollapse: true
        }
      ];
      this.crfs.forEach(crfItem => {
        const child = [];
        crfItem.sections.forEach((sectionItem, index) => {
          child.push({
            title: sectionItem.title,
            href: {
              name: "CRFData",
              params: {
                patientId: this.patientId,
                crfId: crfItem._id,
                new: this.new,
                section: index,
                crfDataId: this.record
              },
              hash: `${sectionItem.name}`
            }
          });
        });
        const pushItem = {
          title: crfItem.name,
          href: {
            name: "CRFData",
            params: { patientId: this.patientId, crfId: crfItem._id, new: true }
          },
          icon: {
            element: "font-awesome-icon",
            attributes: {
              icon: "clipboard-list"
            }
          }
        };
        if (child.length > 0) {
          pushItem.child = child;
        }
        if (this.started(crfItem._id)) {
          pushItem.href.new = false;
        }
        ret.push(pushItem);
      });
      return ret;
    }
  },
  created() {
    this.patientId = this.$route.params.patientId;
    this.new = this.$route.params.new;
    this.fetchData(
      this.$route.params.crfId,
      this.patientId,
      this.$route.params.crfDataId
    ).then(() => {
      this.createDataSections();
      this.$store.dispatch("crfs/GET_CRFS");
      this.show = true;
    });
    this.$axios
      .get("/data/patient/" + this.patientId + "/crfs")
      .then(payload => {
        this.crfData = payload.data.payload;
      });
  },
  methods: {
    resetData() {
      this.data = {
        record: "test1"
      };
      this.record = "new";
    },
    fetchData(crfId, patientId, crfDataId) {
      return this.$store.dispatch("crfs/GET_CRF", crfId).then(() => {
        this.$axios
          .get(`/data/patient/${patientId}/crf/${crfId}/records`)
          .then(payload => {
            this.records = [];
            payload.data.payload.forEach(rec => {
              const date = this.$options.filters.formatDatetime(rec.date);
              this.records.push({
                value: rec.id,
                text: date
              });
            });
          });
        this.resetData();
        if (!this.new) {
          if (crfDataId) {
            this.record = crfDataId;
            this.$axios
              .get(`/data/patient/${patientId}/crfData/${crfDataId}`)
              .then(payload => {
                payload.data.payload.data.forEach(item => {
                  this.data[item.field] = {};
                  this.data[item.field].value = item.value;
                  this.data[item.field]._id = item._id;
                });
              });
          } else {
            this.$axios
              .get(`/data/patient/${patientId}/crf/${crfId}`)
              .then(payload => {
                this.record = payload.data.payload.crfDataId;
                payload.data.payload.data.forEach((item, i) => {
                  this.data[item.field] = {};
                  this.data[item.field].value = item.value;
                  this.data[item.field]._id = item._id;
                });
              })
              .catch(() => {
                this.new = true;
              });
          }
        }
      });
    },
    createDataSections() {
      this.section =
        this.$route.params.section >= 0 ? this.$route.params.section : null;
      this.crf.sections.forEach(section => {
        this.sections.push({
          name: section.name,
          title: section.title
        });
      });
    },
    onToggleCollapse(collapsed) {
      this.collapsed = collapsed;
    },
    started(id) {
      return this.crfData.some(
        elem => elem.newestCRF === id || elem.crfId === id
      );
    },
    changed(section, index, name, changedValue) {
      if (!this.data[name]) this.data[name] = {};
      this.data[name].value = changedValue;
      section.items[index].value = changedValue;
    },
    submit() {
      if (this.new) {
        this.$axios
          .post(
            `/data/patient/${this.patientId}/crf/${this.$route.params.crfId}/full`,
            { data: this.data }
          )
          .then(() => {
            console.log("saved!");
          });
      } else {
        this.$axios
          .put(
            `/data/patient/${this.patientId}/crf/${this.$route.params.crfDataId}/full`,
            { data: this.data }
          )
          .then(() => {
            console.log("updated!");
          });
      }
    },
    refetch(crfId, patientId, crfDataId) {
      this.show = false;
      return this.fetchData(crfId, patientId, crfDataId).then(() => {
        this.show = true;
      });
    },
    changeRecord() {
      if (this.record !== "new") {
        this.new = false;
        this.refetch(this.crf._id, this.patientId, this.record);
      } else {
        this.new = true;
        this.data = {
          record: "test1"
        };
      }
    }
  },
  watch: {
    $route(to, from) {
      let crfDataId = this.$route.params.crfDataId;
      if (to.params.crfId === from.params.crfId) {
        crfDataId = this.record;
      }
      this.show = false;
      this.section =
        this.$route.params.section >= 0 ? this.$route.params.section : null;
      this.patientId = this.$route.params.patientId;
      this.refetch(this.$route.params.crfId, this.patientId, crfDataId);
    }
  }
};
</script>

<style scoped>
hr.section {
  border: 1px solid;
}
h3 {
  text-align: left;
  margin: 10px;
}

#sidebarpage {
  padding-left: 350px;
  transition: 0.3s ease;
}

#sidebarpage.collapsed {
  padding-left: 50px;
}

#sidebar {
  margin-top: 58px;
}

.floatingChilds div {
  float: left;
}

.sidebarCRFs {
  border-right: #385723 1px solid;
  background-color: #e2f0d9;
  text-align: left;
}

.sidebarCRFs a {
  color: #385723 !important;
}

.mainPage {
  text-align: left;
}

.actionBar {
  background-color: #e3e3e3;
  color: black;
  font-size: 20px;
  padding: 20px 20px 15px 20px;
}

.actionBar .actions{
  text-align: right;
}

.actionBar .actions button {
  background-color: #385723;
  color: white;
  border-color: #385723;
}
</style>
