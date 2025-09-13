import { createRouter, createWebHistory } from "vue-router";
import { hideLoading, showLoading } from "@/utils/useToast.js";

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
        {
            path: "/json",
            name: "JsonEditor",
            component: () => import("@/views/JsonPretty/index.vue"),
            meta: { title: "Json格式化" },
        },
        {
            path: "/prettier",
            name: "PrettierConfig",
            component: () => import("@/views/PrettierConfig/index.vue"),
            meta: { title: "prettier配置" },
        },
        {
            path: "/web-meta",
            name: "WebMeta",
            component: () => import("@/views/WebMeta/index.vue"),
            meta: { title: "网站元信息配置" },
        },
    ],
});

router.beforeEach(() => {
    showLoading();
});
router.afterEach((to) => {
    hideLoading();
    if (to.meta && to.meta.title) {
        document.title = `${to.meta.title} · MyTools`;
    } else {
        document.title = "MyTools";
    }
});

export default router;
