import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import jquery from "jquery";

createApp(App).use(jquery).mount("#app");
