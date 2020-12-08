<template>
  <b-container>
    <b-row class="home mainPage">
      <img alt="Vue logo" src="../assets/logo.png" />
      <h1>{{ $t("home.welcome") }}</h1>
      {{ $t("home.message") }}
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-button type="submit" variant="primary" to="/patients">
          {{ $t("home.patients") }}
        </b-button>
      </b-col>
      <b-col sm="6">
        <b-button type="submit" variant="primary" to="/crfs">
          {{ $t("home.crfs") }}
        </b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
export default {
  name: "Home",
  components: {},
  data() {
    return {};
  }
};
</script>
<style scoped>
.home {
  display: block;
}
</style>
