import { createRouter, createWebHistory } from "vue-router";
import { hideLoading, showLoading } from "@/utils/useToast.js";

export const routes = [
        {
            path: "/",
            name: "RegexVisualizer",
            component: () => import("@/views/RegexVisualizer/index.vue"),
            meta: { title: "正则可视化调试" },
        },
        {
            path: "/file",
            name: "FileAction",
            component: () => import("@/views/FileAction/index.vue"),
            meta: { title: "大文件处理" },
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
            meta: { title: "前端项目配置" },
        },
        {
            path: "/web-meta",
            name: "WebMeta",
            component: () => import("@/views/WebMeta/index.vue"),
            meta: { title: "网站元信息配置" },
        },
        {
            path: "/file-accept",
            name: "FileAcceptGenerator",
            component: () => import("@/views/FileAcceptGenerator/index.vue"),
            meta: { title: "文件类型Accept生成" },
        },
        {
            path: "/image-location",
            name: "ImageLocationViewer",
            component: () => import("@/views/ImageLocationViewer/index.vue"),
            meta: { title: "图片元信息查看" },
        },
    ],
    router = createRouter({
        history: createWebHistory(),
        routes,
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
