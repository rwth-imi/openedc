import "@babel/polyfill";
import "mutationobserver-shim";
import Vue from "vue";
import "./plugins/axios";
import "./plugins/bootstrap-vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import i18n from "./plugins/i18n";


Vue.config.productionTip = false;

import moment from 'moment'

import VueSidebarMenu from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import './styles.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCaretDown, faArrowsAltH, faClipboardList, faUserInjured} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCaretDown, faArrowsAltH, faClipboardList, faUserInjured)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(VueSidebarMenu)

/**
 * filter for displaying a date
 */
Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(value).format('YYYY/MM/DD')
  }
});

/**
 * Filter for displaying date and time
 */
Vue.filter('formatDatetime', function(value) {
  if (value) {
    return moment(value).format('YYYY/MM/DD hh:mm')
  }
});

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  created() {
    // Prevent blank screen in Electron builds
    this.$router.push('/')
  }
}).$mount("#app");
