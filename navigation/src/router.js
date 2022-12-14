import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Navigation from "./views/Navigation.vue";
import Search from "./views/Search.vue";
import Environment from "./views/Environment.vue";
import Activity from "./views/Activity.vue";
import Queue from "./views/Queue.vue";
import Recommend from "./views/Recommend.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/navigation",
      name: "navigation",
      component: Navigation,
    },
    {
      path: "/search",
      name: "search",
      component: Search,
    },
    {
      path: "/environment",
      name: "environment",
      component: Environment,
    },
    {
      path: "/activity",
      name: "activity",
      component: Activity,
    },
    {
      path: "/queue",
      name: "queue",
      component: Queue,
    },
    {
      path: "/recommend",
      name: "recommend",
      component: Recommend,
    },
  ],
});
