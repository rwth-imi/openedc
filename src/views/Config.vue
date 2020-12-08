<template>
  <div class="about mainPage">
    <h1>Configuration of the application</h1>
    <b-card bg-variant="light">
      <b-form @submit="save" v-if="show">
        <b-form-group
          label-cols-lg="3"
          :label="$t('Language')"
          label-size="lg"
          label-class="font-weight-bold pt-0"
          class="mb-0"
        >
          <b-form-select
            id="language"
            v-model="localConfig.language"
            :options="languageChoices"
          >
            <template #first>
              <b-form-select-option :value="null" disabled
                >-- {{ $t("selectLanguage") }} --</b-form-select-option
              >
            </template>
          </b-form-select>
        </b-form-group>
        <hr />
        <b-button type="submit" variant="primary">{{ $t("Save") }}</b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  name: "config",
  components: {},
  data() {
    return {
      localConfig: {
        language: null
      },
      noConfig: true,
      show: false
    };
  },
  computed: {
    ...mapGetters("language", ["languages"]),
    ...mapState("config", ["config"]),
    languageChoices() {
      const langs = [];
      this.languages.forEach(lang => {
        langs.push({
          value: lang.value,
          text: lang.title
        });
      });
      return langs;
    }
  },
  created() {
    this.$store.dispatch("config/GET_CONFIG").then(exists => {
      console.log(this.config, exists);
      if (exists) {
        this.noConfig = false;
        this.localConfig = this.config;
      }
      this.show = true;
    });
  },
  methods: {
    save(evt) {
      evt.preventDefault();
      if (this.noConfig) {
        this.$store.dispatch("config/CREATE_CONFIG", this.localConfig);
        this.noConfig = false;
      } else {
        this.$store.dispatch("config/SET_CONFIG", this.localConfig);
      }
    }
  }
};
</script>
