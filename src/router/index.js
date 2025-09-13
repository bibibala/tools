import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", redirect: { path: "/regex" } },
        {
            path: "/regex",
            name: "RegexVisualizer",
            component: () => import("@/views/RegexVisualizer/index.vue"),
            meta: { title: "正则可视化调试" },
        },
        {
            path: "/file",
            name: "FileAction",
            component: () => import("@/views/FileAction/index.vue"),
            meta: { title: "大文件处理工具" },
        },
        {
            path: "/color",
            name: "ColorSchemeGenerator",
            component: () => import("@/views/ColorSchemeGenerator/index.vue"),
            meta: { title: "颜色处理" },
        },
        {
            path: "/json-to-interface",
            name: "JsonToTsConverter",
            component: () => import("@/views/JsonToTsConverter/index.vue"),
            meta: { title: "Json转Ts接口" },
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
