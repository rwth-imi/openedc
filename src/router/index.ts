import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import Patients from "../views/Patients/Patients.vue";
import PatientRegister from "../views/Patients/PatientRegister.vue";
import Patient from "../views/Patients/Patient.vue";
import CRFs from "../views/CRFsOverview.vue";
import Test from "../views/Test.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/patients",
    name: "Patients",
    component: Patients
  },
  {
    path: "/patients/register",
    name: "PatientRegister",
    component: PatientRegister
  },
  {
    path: "/patient/:patientNumber",
    name: "Patient",
    component: Patient,
    props: route => ({ patientNumber: route.query.patientNumber })
  },
  {
    path: "/crfs",
    name: "CRFs",
    component: CRFs
  },
  {
    path: "/createCRF",
    name: "CreateCRF",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/CreateCRF.vue")
  },
  {
    path: "/CRF/:crfId/:section",
    name: "CRF",
    component: () => import(/* webpackChunkName: "about" */ "../views/CRF.vue")
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/help",
    name: "Help",
    component: () => import(/* webpackChunkName: "about" */ "../views/Help.vue")
  },
  {
    path: "/test",
    name: "Test",
    component: Test
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
