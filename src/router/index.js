import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", redirect: { path: "/regex" } },
        {
            path: "/regex",
            name: "RegexVisualizer",
            component: () => import("@/views/RegexVisualizer.vue"),
            meta: { title: "正则可视化调试" },
        },
        {
            path: "/file",
            name: "FileAction",
            component: () => import("@/views/FileAction.vue"),
            meta: { title: "大文件读取" },
        },
        {
            path: "/color",
            name: "ColorSchemeGenerator",
            component: () => import("@/views/ColorSchemeGenerator.vue"),
            meta: { title: "颜色处理" },
        },
        {
            path: "/json-to-interface",
            name: "JsonToTsConverter",
            component: () => import("@/views/JsonToTsConverter.vue"),
            meta: { title: "颜色处理" },
        },
    ],
});

router.afterEach((to) => {
    if (to.meta && to.meta.title) {
        document.title = `${to.meta.title} · MyTools`;
    } else {
        document.title = "MyTools";
    }
});

export default router;
