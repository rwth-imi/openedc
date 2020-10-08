<template>
  <div id="app">
    <div id="nav">
      <b-navbar toggleable="lg" type="dark" variant="light">
        <b-navbar-brand to="#"><img alt="Vue logo" src="./assets/logo.png" height="30px" /></b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item to="/">Home</b-nav-item>
            <b-nav-item to="/patients">Patients</b-nav-item>
            <b-nav-item to="/crfs">CRFs</b-nav-item>
            <b-nav-item to="/about">About</b-nav-item>
            <b-nav-item to="/help">Help</b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown text="Lang" right>
              <b-dropdown-item href="#">EN</b-dropdown-item>
              <b-dropdown-item href="#">DE</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <router-view />
  </div>
</template>

<style>

.navbar.navbar-dark.bg-light{
    background-color: #A9D18E!important;
 }
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav a {
  font-weight: bold;
  color: #385723;
}

#nav a.router-link-exact-active {
  color: #E2F0D9;
}

.mainPage {
  padding: 30px 0 0 0
}
</style>
