import App from "./App.vue";
import "@/assets/style/root.css";
import "@/assets/style/layout.css";
import { createMyRouter, routes } from "@/router";
import { createApp as createVueApp } from "vue";

// vite-ssg期望的createApp函数
export function createApp() {
    const app = createVueApp(App);
    const router = createMyRouter();

    app.use(router);

    return {
        app,
        router,
        routes, // 确保routes被传递给vite-ssg
    };
}

if (typeof window !== "undefined") {
    const { app } = createApp();
    app.mount("#app");
}
