import { ViteSSG } from "vite-ssg";
import App from "./App.vue";
import { routes } from "./router";
import "@/assets/style/root.css";
import "@/assets/style/layout.css";

export const createApp = ViteSSG(App, {
  routes,
  base: import.meta.env.BASE_URL,
});
