<template>
  <div class="mainPage">
    <h1 v-if="formsId">{{ $t("EditCRF") }}</h1>
    <h1 v-else>{{ $t("CreateCRF") }}</h1>
    <div>
      <b-card bg-variant="light">
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">
          <b-form-group
            label-cols-lg="3"
            :label="$t('CreateCRF')"
            label-size="lg"
            label-class="font-weight-bold pt-0"
            class="mb-0"
          >
            <b-form-group
              label-cols-sm="3"
              :label="$t('Format')"
              label-align-sm="right"
            >
              <b-form-select
                v-model="form.format"
                name="format"
                :options="formatOptions"
              ></b-form-select>
            </b-form-group>
            <b-form-group
              label-cols-sm="3"
              :label="$t('UploadFile')"
              label-align-sm="right"
              label-for="nested-file"
            >
              <b-form-file
                v-model="form.file"
                :state="Boolean(form.file)"
                :placeholder="$t('ChooseFile')"
                :drop-placeholder="$t('DropFile')"
                name="filename"
              ></b-form-file>
            </b-form-group>
          </b-form-group>
          <b-button type="submit" variant="primary">{{ $t("Verify") }}</b-button>
          <b-button type="reset" variant="danger">{{  $t("Reset") }}</b-button>
        </b-form>
      </b-card>
      <b-card bg-variant="light">
        <b-row>
          <b-col sm="3">
            <h2>{{ $t("Log") }}:</h2>
          </b-col>
          <b-col sm="9">
            <div class="log" v-for="(line, index) in log" :key="index">
              <span :class="line.type"
                >{{ line.type | typeFilter }}: {{ line.msg }}</span
              >
            </div>
          </b-col>
        </b-row>
      </b-card>
      <b-card bg-variant="light">
        <b-row>
          <b-col sm="3">
            <h2>{{ $t("CRFs") }}:</h2>
          </b-col>
          <b-col sm="9">
            <b-form-group class="log" :label="$t('SelectCRFToUpload')">
              <b-form-checkbox
                v-for="crf in crfs"
                v-model="selected"
                :key="crf.name"
                :value="crf"
              >
                {{ crf.name }}
              </b-form-checkbox>
            </b-form-group>
          </b-col>
        </b-row>
      </b-card>
      <b-button
        type="submit"
        variant="primary"
        :disabled="!saveAllowed"
        @click="onSave()"
        >{{ $t("Save") }}</b-button
      >
      <b-button variant="danger" @click="goBack()">{{ $t("Back") }}</b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CRFUpload",
  components: {},
  data() {
    return {
      form: {
        file: [],
        format: "JSON"
      },
      formatOptions: ["JSON", "Excel", "RedCap", "OpenClinica"],
      show: true,
      saveAllowed: false,
      crfs: [],
      selected: [],
      log: [],
      formsId: null
    };
  },
  created() {
    this.formsId = this.$route.params.formsId;
  },
  methods: {
    getFormat() {
      switch (this.form.format) {
        case "JSON":
          return ".json";
        case "Excel":
        case "RedCap":
        case "OpenClinica":
          return ".xlsx";
        default:
          return ".txt";
      }
    },
    /**
     * Uploads the file and gets back a log of the verification.
     * @param evt
     */
    onSubmit(evt) {
      evt.preventDefault();
      const formData = new FormData();
      const format = this.getFormat();
      formData.append("filename", "CRF-" + Date.now() + format); // TODO: Better filenames
      formData.append("file", this.form.file);
      formData.append("format", this.form.format);
      this.axios
        .post("crf/upload/check", formData)
        .then(({ data }) => {
          this.log = data.payload.log;
          this.saveAllowed = data.payload.saveAllowed;
          this.crfs = data.payload.crfs;
          this.selected = this.crfs;
        })
        .catch((err, data) => {
          console.log(err, data);
        });
    },
    onReset(evt) {
      evt.preventDefault();
      // Reset our form values
      this.form.file = [];
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.log = [];
      this.crf = {};
      this.saveAllowed = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
    onSave() {
      this.selected.forEach(crf => {
        const send = {
          crf: crf
        };
        if (this.formsId === null || this.formsId === undefined) {
          this.axios.post("crf/", send).then(() => {
            console.log("saved");
            this.$router.push("/crfs");
          });
        } else {
          this.axios.put("crf/" + this.formsId, send).then(() => {
            console.log("edited");
            this.$router.push("/crfs");
          });
        }
      });
    },
    goBack() {
      // Todo: Delete File if it was uploaded
      this.$router.push("/crfs");
    }
  },
  filters: {
    typeFilter: function(value) {
      if (value) {
        return value[0].toUpperCase() + value.slice(1);
      }
      return value;
    }
  }
};
</script>

<style scoped>
.log {
  text-align: left;
}

.info {
  color: green;
}

.warning {
  color: orange;
}

.error {
  color: red;
}
</style>
