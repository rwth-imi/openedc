<template>
  <div>
    <b-row>
      <b-col sm="2" class="sidebarCRFs">
        <SidebarCRFs :crf="crf"></SidebarCRFs>
      </b-col>
      <b-col sm="10" class="mainPage">
        <PatientDisplay
          :patientNumber="patientNumber"
          :date="date"
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
          <div v-for="item in subsection.items" :key="item.name">
            <component v-bind:is="item.type" :options="item"></component>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import SidebarCRFs from "@/components/SidebarCRFs.vue";
import PatientDisplay from "@/components/PatientDisplay.vue";
import FileUploadField from "@/components/input_fields/FileUploadField.vue";
import Checkboxes from "@/components/input_fields/Checkboxes.vue";
import TextField from "@/components/input_fields/TextField.vue";
import SingleSelectField from "@/components/input_fields/SingleSelectField.vue";
import RadioButtons from "@/components/input_fields/RadioButtons.vue";
import TextArea from "@/components/input_fields/TextArea.vue";
export default {
  name: "CRFs",
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
      crf: {},
      section: 0,
      sections: [],
      patientNumber: null,
      date: "Wed Sep 30 2020",
      dates: ["Wed Sep 30 2020", "Thu Sep 17 2020", "Tue Sep 1 2020"]
    };
  },
  created() {
    console.log("route", this.$route);
    this.fetchData(this.$route.params.crfId);
    console.log(this.crf);
    this.section = this.$route.params.section;
    console.log(this.crf.sections[0]);
    this.createDataSections();
    this.patientNumber = this.$route.params.patientNumber;
    // TODO: get Data of patient
  },
  methods: {
    fetchData(crfId) {
      console.log("fetchData");
      const crfs = [
        {
          name: "First CRF",
          language: "en",
          description: "This is my first survey",
          version: 1,
          versionDescription: "First version",
          sections: [
            {
              name: "demographics",
              title: "Demographics",
              description: "",
              subsection: [
                {
                  name: "",
                  items: [
                    {
                      name: "study_id",
                      type: "TextField",
                      label: "Study ID",
                      notes: "",
                      unit: "",
                      validationType: "text",
                      validationMin: null,
                      validationMax: null,
                      validationErrorMessage: "",
                      choices: null, // or null (or function)
                      branchingLogic: null, // or null
                      required: true,
                      defaultValue: "1"
                    }
                  ],
                  repeatMax: 1,
                  repeatMin: 1
                },
                {
                  name: "Demographic Characteristics",
                  items: [
                    {
                      name: "date_enrolled",
                      type: "TextField",
                      label: "Date subject signed consent",
                      notes: "",
                      unit: "YYYY-MM-DD",
                      validationType: "date",
                      validationMin: null,
                      validationMax: null,
                      validationErrorMessage: "",
                      choices: null,
                      branchingLogic: null,
                      required: false,
                      defaultValue: ""
                    },
                    {
                      name: "first_name",
                      type: "TextField",
                      label: "First Name",
                      notes: "",
                      unit: "",
                      validationType: "text",
                      validationMin: null,
                      validationMax: null,
                      validationErrorMessage: "",
                      choices: null,
                      branchingLogic: null,
                      required: false,
                      defaultValue: ""
                    },
                    {
                      name: "last_name",
                      type: "TextField",
                      label: "Last Name",
                      notes: "",
                      unit: "",
                      validationType: "text",
                      validationMin: null,
                      validationMax: null,
                      validationErrorMessage: "",
                      choices: null,
                      branchingLogic: null,
                      required: false,
                      defaultValue: ""
                    }
                  ],
                  repeatMax: 1,
                  repeatMin: 1
                },
                {
                  name: "Contact information",
                  items: [
                    {
                      name: "adress",
                      type: "TextArea",
                      label: "Street, City, State, ZIP",
                      notes: "",
                      unit: "",
                      validationType: "",
                      validationMin: null,
                      validationMax: null,
                      validationErrorMessage: "",
                      choices: null,
                      branchingLogic: null,
                      required: null,
                      defaultValue: "",
                      index: 0
                    },
                    {
                      name: "telephone",
                      type: "TextField",
                      label: "Phone number",
                      notes: "Include Area Code",
                      unit: "",
                      validationType: "tel",
                      validationMin: null,
                      validationMax: null,
                      validationErrorMessage: "",
                      choices: null,
                      branchingLogic: null,
                      required: null,
                      defaultValue: "",
                      index: 0
                    },
                    {
                      name: "email",
                      type: "TextField",
                      label: "E-mail",
                      notes: "",
                      unit: "",
                      validationType: "email",
                      validationMin: null,
                      validationMax: null,
                      validationErrorMessage: "",
                      choices: null,
                      branchingLogic: null,
                      required: null,
                      defaultValue: "",
                      index: 0
                    },
                    {
                      name: "sex",
                      type: "SingleSelectField",
                      label: "Gender",
                      notes: "",
                      unit: "",
                      validationType: "",
                      validationMin: null,
                      validationMax: null,
                      validationErrorMessage: "",
                      choices: [
                        {
                          value: 0,
                          text: "Female"
                        },
                        {
                          value: 1,
                          text: "Male"
                        }
                      ],
                      branchingLogic: null,
                      required: null,
                      defaultValue: "",
                      index: 0
                    },
                    {
                      name: "ethnicity",
                      type: "RadioButtons",
                      label: "Ethnicity",
                      notes: "",
                      unit: "",
                      validationType: "",
                      validationMin: null,
                      validationMax: null,
                      validationErrorMessage: "",
                      choices: [
                        {
                          value: 0,
                          text: "Hispanic or Latino"
                        },
                        {
                          value: 1,
                          text: "NOT Hispanic or Latino"
                        },
                        {
                          value: 2,
                          text: "Unknown / Not Reported"
                        }
                      ],
                      branchingLogic: null,
                      required: null,
                      defaultValue: "",
                      index: 0
                    }
                  ],
                  repeatMax: 1,
                  repeatMin: 1
                }
              ]
            },
            {
              name: "basics",
              title: "Basics",
              description: "Basic information",
              subsection: [
                {
                  name: "",
                  items: [
                    {
                      name: "first_name",
                      type: "TextField",
                      label: "First Name",
                      notes: "",
                      unit: "",
                      validationType: "text",
                      validationMin: null,
                      validationMax: null,
                      validationErrorMessage: "",
                      choices: [], // or null (or function)
                      branchingLogic: null, // or null
                      required: true,
                      defaultValue: "Rabea"
                    }
                  ],
                  repeatMax: 1,
                  repeatMin: 1
                }
              ]
            }
          ]
        },
        {
          name: "Second CRF",
          language: "en",
          description: "This is my first survey",
          version: 1,
          versionDescription: "First version",
          sections: [
            {
              name: "basic",
              title: "Basic",
              description: "",
              subsection: [
                {
                  name: "Visit Information",
                  items: [
                    {
                      name: "PEDAT",
                      type: "TextField",
                      label: "Date of Physical Exam",
                      notes: "",
                      unit: "YYYY-MM-DD",
                      validationType: "date",
                      validationMin: null,
                      validationMax: null,
                      validationErrorMessage: "",
                      choices: null, // or null (or function)
                      branchingLogic: null, // or null
                      required: null,
                      defaultValue: null
                    },
                    {
                      name: "PETIM",
                      type: "TextField",
                      label: "Time of Physical Exam",
                      notes: "",
                      unit: "HH:MM",
                      validationType: "text",
                      validationMin: null,
                      validationMax: null,
                      validationErrorMessage:
                        "Please enter the time in the 24 hour format (HH:MM)",
                      choices: null, // or null (or function)
                      branchingLogic: null, // or null
                      required: null,
                      defaultValue: null
                    }
                  ],
                  repeatMax: 1,
                  repeatMin: 1
                }
              ]
            },
            {
              name: "body_system",
              title: "Body System",
              description: "Information regarding the body system",
              subsection: [
                {
                  name: "",
                  items: [
                    {
                      name: "APPEARANCE",
                      type: "Checkboxes",
                      label: "Appearance",
                      notes: "",
                      unit: "",
                      validationType: "",
                      validationMin: null,
                      validationMax: null,
                      validationErrorMessage: "",
                      choices: [
                        {
                          value: 1,
                          text: "Normal"
                        },
                        {
                          value: 2,
                          text: "Abnormal"
                        },
                        {
                          value: 99,
                          text: "Not Examined"
                        }
                      ],
                      branchingLogic: null,
                      required: true,
                      defaultValue: 99
                    },
                    {
                      name: "APPEARANCE_COMMENTS",
                      type: "TextField",
                      label: "Appearance Comments",
                      notes: "(Required if Abnormal)",
                      unit: "",
                      validationType: "text",
                      validationMin: null,
                      validationMax: null,
                      validationErrorMessage: "",
                      choices: null,
                      branchingLogic: {
                        APPEARANCE: 2
                      },
                      required: true,
                      defaultValue: ""
                    }
                  ],
                  repeatMax: 1,
                  repeatMin: 1
                }
              ]
            }
          ]
        }
      ];
      this.crf = crfs[crfId];
      console.log("jo", this.crf, crfId);
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

.sidebarCRFs {
  border-right: #385723 1px solid;
  background-color: #e2f0d9;
  text-align: left;
}

.sidebarCRFs a {
  color: #385723 !;
}
</style>
