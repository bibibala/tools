import App from "./App.vue";
import "@/assets/style/root.css";
import "@/assets/style/layout.css";
import { createMyRouter, routes } from "@/router";
import { createApp as createVueApp } from "vue";
import { registerSW } from "virtual:pwa-register";

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

    // 注册Service Worker
    const updateSW = registerSW({
        onNeedRefresh() {
            // 可以在这里添加更新提示逻辑
            console.log("New content available, please refresh!");
            if (confirm("新版本可用，是否立即更新？")) {
                updateSW(true);
            }
        },
        onOfflineReady() {
            console.log("App ready to work offline");
        },
        onRegistered(r) {
            if (r) {
                console.log("SW Registered: " + r);
            }
        },
        onRegisterError(error) {
            console.log("SW registration error", error);
        },
    });
}
