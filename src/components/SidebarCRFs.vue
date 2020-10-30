<template lang="html">
  <div>
    <b-nav vertical class="mainPage">
      <div v-for="(crfItem, i) in crfs" :key="'crf_' + i">
        <b-nav-item-dropdown
          v-bind:class="[crf.name === crfItem.name ? 'active' : '']"
          :text="crfItem.name"
          toggle-class="nav-link-custom"
          right
        >
          <b-dropdown-item
            v-for="(sectionItem, index) in crfItem.sections"
            :key="sectionItem.name"
            v-bind:class="[section === index ? 'active' : '', 'subitem']"
            >{{ sectionItem.title }}
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </div>
    </b-nav>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "SidebarCRFs",
  props: ["crf"],
  mounted() {
    this.$store.dispatch("crfs/GET_CRFS");
  },
  computed: {
    ...mapState("crfs", ["crfs"])
  },
  data() {
    return {
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

<style lang="css" scoped></style>
