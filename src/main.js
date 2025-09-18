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
        routes, // vite-ssg需要routes来生成静态页面
    };
}

if (typeof window !== "undefined") {
    const { app } = createApp();
    app.mount("#app");
}
