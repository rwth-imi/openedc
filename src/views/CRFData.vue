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
        <ActionBar
          :record="record"
          :records="records"
          :crf-id="crf.newestVersion || crf._id"
          :multiple-records="crf.multipleRecords"
          @submitted="submit"
          @changedRecord="changeRecord"
        ></ActionBar>
        <h1>CRF: {{ crf.name }}</h1>
        <CRF
          :crf-id="crf._id"
          :data="data"
          :section="section"
          :sections="sections"
        ></CRF>
      </b-col>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ActionBar from "@/components/ActionBar";
import CRF from "@/components/CRF";

export default {
  name: "CRFData",
  components: {
    ActionBar,
    CRF
  },
  data() {
    return {
      section: 0,
      sections: [],
      patientId: null,
      date: "Wed Sep 30 2020",
      dates: ["Wed Sep 30 2020", "Thu Sep 17 2020", "Tue Sep 1 2020"],
      show: false,
      new: true,
      crfData: [],
      collapsed: false,
      records: [],
      record: {
        id: "new",
        crfId: null
      }
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
                crfRecordId: this.record.id
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
    if (this.record.id === "new" && this.record.crfId === null) {
      this.record.crfId = this.$route.params.crfId;
    }

    this.fetchData(
        this.$route.params.crfId,
        this.patientId,
        this.$route.params.crfRecordId
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
      this.record = {
        id: "new",
        crfId: this.$route.params.crfId
      };
    },
    fetchData(crfId, patientId, crfRecordId) {
      return this.$store.dispatch("crfs/GET_CRF", crfId).then(() => {
        this.$axios
          .get(`/data/patient/${patientId}/crf/${crfId}/records`)
          .then(payload => {
            this.records = [];
            payload.data.payload.forEach(rec => {
              const date = this.$options.filters.formatDatetime(rec.date);
              this.records.push({
                value: {
                  id: rec.id,
                  crfId: rec.crfId
                },
                text: date
              });
            });
          });
        this.resetData();
        if (!this.new) {
          if (crfRecordId) {
            this.record.id = crfRecordId;
            this.record.crfId = crfId;
            this.$axios
              .get(`/data/patient/${patientId}/crfData/${crfRecordId}`)
              .then(payload => {
                const tmpData = {};
                payload.data.payload.data.forEach(item => {
                  tmpData[item.field] = {};
                  tmpData[item.field].value = item.value;
                  tmpData[item.field]._id = item._id;
                });
                this.data = tmpData;
              });
          } else {
            return this.$axios
              .get(`/data/patient/${patientId}/crf/${crfId}`)
              .then(payload => {
                this.record.id = payload.data.payload.crfRecordId;
                if (payload.data.payload.crfId !== crfId) {
                  return this.$store
                    .dispatch("crfs/GET_CRF", payload.data.payload.crfId)
                    .then(() => {
                      this.record.crfId = payload.data.payload.crfId;
                      const tmpData = {};
                      payload.data.payload.data.forEach(item => {
                        tmpData[item.field] = {};
                        tmpData[item.field].value = item.value;
                        tmpData[item.field]._id = item._id;
                      });
                      this.data = tmpData;
                    });
                } else {
                  this.record.crfId = payload.data.payload.crfId;
                  const tmpData = {};
                  payload.data.payload.data.forEach(item => {
                    tmpData[item.field] = {};
                    tmpData[item.field].value = item.value;
                    tmpData[item.field]._id = item._id;
                  });
                  this.data = tmpData;
                }
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

    submit() {
      if (this.new) {
        this.$axios
          .post(
            `/data/patient/${this.patientId}/crf/${this.$route.params.crfId}/full`,
            { data: this.data, formsId: this.crf.formsId }
          )
          .then(() => {
            console.log("saved!");
          });
      } else {
        this.$axios
          .put(`/data/patient/${this.patientId}/crf/${this.record.id}/full`, {
            data: this.data
          })
          .then(() => {
            console.log("updated!");
          });
      }
    },
    refetch(crfId, patientId, crfRecordId) {
      this.show = false;
      return this.fetchData(crfId, patientId, crfRecordId).then(() => {
        this.show = true;
      });
    },
    changeRecord(record) {
      this.record = record;
      if (this.record.id !== "new") {
        this.new = false;
        this.refetch(this.record.crfId, this.patientId, this.record.id);
      } else {
        this.new = true;
        this.data = {
          record: "test1"
        };
        return this.$store.dispatch(
          "crfs/GET_CRF_NEWEST",
          this.record.crfId,
          false
        );
      }
    }
  },
  watch: {
    $route(to, from) {
      let crfRecordId = this.$route.params.crfRecordId;
      if (to.params.crfId === from.params.crfId) {
        crfRecordId = this.record.id;
      }
      this.show = false;
      this.section =
        this.$route.params.section >= 0 ? this.$route.params.section : null;
      this.patientId = this.$route.params.patientId;
      this.refetch(this.$route.params.crfId, this.patientId, crfRecordId);
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

.mainPage {
  text-align: left;
}
</style>
