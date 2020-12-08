<template>
  <div class="mainPage">
    <h1>{{ $t("crfOverview") }}</h1>
    <div class="" align="right">
      <b-button pill variant="success" :to="{ name: 'CRFUpload' }">
        {{ $t("Add") }}
      </b-button>
    </div>
    <b-table striped hover :items="crfs" :fields="fields">
      <template v-slot:cell(name)="data">
        <router-link
          :to="{
            name: 'CRFDetail',
            params: { crfId: data.item._id, section: 0 }
          }"
          >{{ data.value }}</router-link
        >
      </template>
      <template v-slot:cell(countFilled)="data">
        {{ data.item.count }}
      </template>
      <template v-slot:cell(createdAt)="data">
        {{ new Date(data.value) | formatDate }}
      </template>
      <template v-slot:cell(settings)="data">
        <b-button
          pill
          variant="outline-success"
          :to="{ name: 'CRFUpload', params: { formsId: data.item.formsId } }"
          >{{ $t("Edit") }}</b-button
        >
        <b-button pill variant="outline-success">{{ $t("Export") }}</b-button>
        <b-button
          pill
          variant="outline-danger"
          @click="deleteCRF(data.item.formsId)"
          >{{ $t("Delete") }}</b-button
        >
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
    this.$store.dispatch("crfs/GET_CRFS", true);
  },
  computed: {
    ...mapState("crfs", ["crfs"])
  },
  methods: {
    deleteCRF(formsId) {
      this.$store.dispatch("crfs/DESTROY_CRF", formsId);
    }
  },
  data() {
    return {
      fields: [
        {
          key: "name",
          label: this.$t("Name"),
          sortable: true
        },
        {
          key: "description",
          label: this.$t("Description")
        },
        {
          key: "countFilled",
          label: this.$t("Count"),
          sortable: true
        },
        {
          key: "createdAt",
          label: this.$t("createdAt"),
          sortable: true
        },
        { key: "settings", label: this.$t("Settings") }
      ]
    };
  }
};
</script>

<style scoped></style>
