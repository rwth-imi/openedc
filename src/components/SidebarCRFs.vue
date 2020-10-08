<template lang="html">
  <div>
    <b-nav vertical class="mainPage">
      <div v-for="(crfItem, i) in crfs" :key="'crf_' + i">
        <b-nav-item v-bind:class="[crf.name == crfItem.name ? 'active' : '']">{{
          crfItem.name
        }}</b-nav-item>
        <b-nav-item
          v-for="(sectionItem, index) in crfItem.sections"
          :key="sectionItem.name"
          v-bind:class="[section == index ? 'active' : '', 'subitem']"
          >{{ sectionItem.name }}</b-nav-item
        >
      </div>
      <b-nav-item
        v-for="crfItem in crfs"
        :key="crfItem.name"
        v-bind:class="[crf.name == crfItem.name ? 'active' : '']"
        >{{ crfItem.name }}</b-nav-item
      >
    </b-nav>
  </div>
</template>

<script>
export default {
  name: "SidebarCRFs",
  props: ["crf"],
  data() {
    return {
      crfs: [
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
                        { value: 0, text: "Female" },
                        { value: 1, text: "Male" }
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
                        { value: 0, text: "Hispanic or Latino" },
                        { value: 1, text: "NOT Hispanic or Latino" },
                        { value: 2, text: "Unknown / Not Reported" }
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
      ],
      section: 0
    };
  },
  created() {
    if (this.$route.params.section) {
      this.section = this.$route.params.section;
    }
  }
};
</script>

<style lang="css" scoped>
.subitem {
  padding: 0 0 0 20px;
}
</style>
