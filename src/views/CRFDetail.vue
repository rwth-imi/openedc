<template>
  <b-row>
    <b-col>
      <h1>{{ $t("crfDetail") }}: {{ crf.name }}</h1>
      <CRF
        :crf-id="crf._id"
        :data="data"
        :section="section"
        :sections="sections"
      ></CRF>
    </b-col>
  </b-row>
</template>
<script>
import CRF from "@/components/CRF";
import { mapState } from "vuex";

export default {
  name: "CRFDetail",
  components: {
    CRF
  },
  data() {
    return {
      data: {},
      section: 0,
      sections: []
    };
  },
  computed: {
    ...mapState("crfs", ["crfs", "crf"])
  },
  created() {
    this.$store.dispatch("crfs/GET_CRF", {
      crfId: this.$route.params.crfId,
      include: true
    });
  }
};
</script>
