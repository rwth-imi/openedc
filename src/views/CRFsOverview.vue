<template>
  <div class="mainPage">
    <h1>CRFs Overview</h1>
    <div class="" align="right">
      <b-button pill variant="success" to="/CreateCRF">Add</b-button>
    </div>
    <b-table striped hover :items="crfs" :fields="fields">
      <template v-slot:cell(name)="data">
        <router-link
          :to="{ name: 'CRF', params: { crfId: data.item._id, section: 0 } }"
          >{{ data.value }}</router-link
        >
      </template>
      <template v-slot:cell(countFilled)="data">
        <router-link
          :to="{ name: 'CRFsFilled', params: { crfId: data.item._id } }"
          >{{ data.value }}</router-link
        >
      </template>
      <template v-slot:cell(createdAt)="data">
        {{ (new Date(data.value)).toDateString() }}
      </template>
      <template v-slot:cell(settings)="data">
        <b-button pill variant="outline-success" :to="{ name: 'EditCRF', params: {crfId: data.item._id }}">Edit</b-button>
        <b-button pill variant="outline-success">Export</b-button>
        <b-button pill variant="outline-danger">Delete</b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "CRFs",
  components: {},
  mounted() {
    this.$store.dispatch("crfs/GET_CRFS");
  },
  computed: {
    ...mapState("crfs", ["crfs"]),
    filteredList() {
      return this.crfs.filter(crf => {
        return crf._id.includes(this.search.toLowerCase())
      })
    }
  },
  data() {
    return {
      fields: [
        {
          key: "name",
          sortable: true
        },
        {
          key: "countFilled",
          label: "Count",
          sortable: true
        },
        {
          key: "createdAt",
          sortable: true
        },
        "Settings"
      ]
    };
  }
};
</script>

<style scoped></style>
