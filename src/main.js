import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import "@/assets/style/root.css";
import "@/assets/style/layout.css";

createApp(App).use(router).mount("#app");
