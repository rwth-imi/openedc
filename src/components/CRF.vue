<template>
  <div v-if="section === null">
    <div v-for="(sectionItem, section) in crf.sections" :key="section">
      <h2>{{ $t("section") }}: {{ sectionItem.title }}</h2>
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
            :value="localData[item.name]"
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
          :value="localData[item.name]"
          @changed="changed(subsection, index, item.name, $event)"
        ></component>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Component for displaying CRF
 */
import { mapState } from "vuex";
import Checkboxes from "@/components/input_fields/Checkboxes.vue";
import TextField from "@/components/input_fields/TextField.vue";
import SingleSelectField from "@/components/input_fields/SingleSelectField.vue";
import RadioButtons from "@/components/input_fields/RadioButtons.vue";
import TextArea from "@/components/input_fields/TextArea.vue";
export default {
  name: "CRF",
  components: {
    Checkboxes,
    TextField,
    SingleSelectField,
    RadioButtons,
    TextArea
  },
  props: {
    /**
     * data object of current content of CRF
     * {
     *   fieldName: {
     *     _id: String,
     *     value: Any
     *   }
     * }
     */
    data: Object,
    section: Number,
    /**
     * {
     *   name: String,
     *   title: String
     * }
     */
    sections: Array,
    crfId: String
  },
  data() {
    return {
      localData: {
        record: "test1"
      }
    };
  },
  computed: {
    ...mapState("crfs", ["crf"])
  },
  created() {
    this.localData = this.data;
  },
  methods: {
    changed(section, index, name, changedValue) {
      if (!this.localData[name]) this.localData[name] = {};
      this.localData[name].value = changedValue;
      section.items[index].value = changedValue;
    }
  },
  watch: {
    $route() {
      this.section = this.$route.params.section;
    },
    data: {
      handler(value) {
        this.localData = value;
      },
      deep: true
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
