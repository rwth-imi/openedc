<template>
  <div class="home mainPage">
    <img alt="Vue logo" src="../assets/logo.png" />
    <h1>{{ $t("home.welcome") }}</h1>
    {{ $t("home.message")}}
  </div>
</template>

<script lang="ts">
    export default {
        name: "Home",
        components: {
        },
        data() {
          return {
          }
        }
    }
</script>
