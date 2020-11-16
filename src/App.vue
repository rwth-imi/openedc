<template>
  <div id="app">
    <div id="nav">
      <b-navbar toggleable="lg" type="dark" variant="light">
        <b-navbar-brand to="#"
          ><img alt="Vue logo" src="./assets/logo.png" height="30px"
        /></b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item to="/">{{ $t("home.title") }}</b-nav-item>
            <b-nav-item to="/patients">{{ $t("Patients") }}</b-nav-item>
            <b-nav-item to="/crfs">{{ $t("CRFs") }}</b-nav-item>
            <b-nav-item to="/about">{{ $t("Config") }}</b-nav-item>
            <b-nav-item to="/help">{{ $t("help.title") }}</b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown text="Lang" right>
              <b-dropdown-item
                v-for="(lang, index) in languages"
                :key="`lang${index}`"
                @click="changeLanguage(lang)"
                >{{ lang.title }}</b-dropdown-item
              >
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <div id="main">
      <router-view />
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "app",
  components: {},
  computed: {
    ...mapGetters("language", ["languages"])
  },
  methods: {
    changeLanguage(lang) {
      this.$i18n.locale = lang.value;
      this.$store.dispatch("language/setLanguage", lang.value);
    }
  }
};
</script>
<style>
.navbar.navbar-dark.bg-light {
  background-color: #a9d18e !important;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  position: fixed;
  width: 100%;
  top: 0px;
  z-index: 1;
}

#nav a {
  font-weight: bold;
  color: #385723;
}

#nav a.router-link-exact-active {
  color: #e2f0d9;
}

#main {
  z-index: 0;
  margin-top: 58px;
}
</style>
