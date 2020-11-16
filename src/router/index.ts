import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import Patients from "../views/Patients/Patients.vue";
import PatientRegister from "../views/Patients/PatientRegister.vue";
import Patient from "../views/Patients/Patient.vue";
import CRFs from "../views/CRFsOverview.vue";

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
    path: "/patient/:patientId",
    name: "Patient",
    component: Patient,
    props: route => ({ patientId: route.query.patientId })
  },
  {
    path: "/crfs",
    name: "CRFs",
    component: CRFs
  },
  {
    path: "/createCRF",
    name: "CRFUpload",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/CRFUpload.vue")
  },
  {
    path: "/CRF/:crfId/:section",
    name: "CRFDetail",
    component: () => import(/* webpackChunkName: "about" */ "../views/CRFDetail.vue")
  },
  {
    path: "/CRF/:crfId/data/:patientId",
    name: "CRFData",
    component: () => import(/* webpackChunkName: "about" */ "../views/CRFData.vue")
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
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
