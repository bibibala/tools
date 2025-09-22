import {
    createRouter,
    createWebHistory,
    createMemoryHistory,
} from "vue-router";
import { hideLoading, showLoading } from "@/utils/useToast.js";

export const routes = [
    {
        path: "/",
        name: "RegexVisualizer",
        component: () => import("@/views/RegexVisualizer/index.vue"),
        meta: {
            title: "正则可视化调试",
            category: "开发工具",
            description:
                "在线正则表达式可视化工具，帮助开发者理解和调试正则表达式，支持实时预览和语法高亮",
            keywords: "正则表达式, 可视化, 调试工具, regex, 在线工具",
        },
    },
    {
        path: "/year",
        name: "ChineseNewYearCountdown",
        component: () => import("@/views/ChineseNewYearCountdown/index.vue"),
        meta: {
            title: "农历新年倒计时",
            category: "生活工具",
            description:
                "精美的农历新年倒计时工具，实时显示距离春节还有多少天、小时、分钟、秒，支持生肖年份显示和进度可视化",
            keywords:
                "农历新年, 春节倒计时, 新年倒计时, 生肖, 农历, 春节, 中国新年, 倒计时工具",
        },
    },
    {
        path: "/file",
        name: "FileAction",
        component: () => import("@/views/FileAction/index.vue"),
        meta: {
            title: "大文件处理",
            category: "文件处理",
            description:
                "在线大文件处理工具，支持文件分割、合并、压缩等操作，无需上传服务器",
            keywords: "文件处理, 大文件, 文件分割, 文件合并, 在线工具",
        },
    },
    {
        path: "/color",
        name: "ColorSchemeGenerator",
        component: () => import("@/views/ColorSchemeGenerator/index.vue"),
        meta: {
            title: "颜色处理",
            category: "设计工具",
            description:
                "在线颜色转换工具，支持HEX、RGB、HSL等格式互转，颜色配色方案生成",
            keywords: "颜色转换, HEX, RGB, HSL, 配色方案, 颜色工具",
        },
    },
    {
        path: "/json-to-interface",
        name: "JsonToTsConverter",
        component: () => import("@/views/JsonToTsConverter/index.vue"),
        meta: {
            title: "Json转Ts接口",
            category: "开发工具",
            description:
                "在线JSON转TypeScript接口工具，快速生成类型定义，提高开发效率",
            keywords: "JSON, TypeScript, 接口生成, 类型定义, 前端工具",
        },
    },
    {
        path: "/json",
        name: "JsonEditor",
        component: () => import("@/views/JsonPretty/index.vue"),
        meta: {
            title: "Json格式化",
            category: "开发工具",
            description:
                "在线JSON格式化美化工具，支持JSON验证、压缩、格式化，提升代码可读性",
            keywords: "JSON格式化, JSON美化, JSON验证, 在线工具",
        },
    },
    {
        path: "/prettier",
        name: "PrettierConfig",
        component: () => import("@/views/PrettierConfig/index.vue"),
        meta: {
            title: "前端项目配置",
            category: "开发工具",
            description:
                "在线Prettier配置生成器，快速生成前端项目代码格式化配置文件",
            keywords: "Prettier, 代码格式化, 前端配置, 项目配置",
        },
    },
    {
        path: "/web-meta",
        name: "WebMeta",
        component: () => import("@/views/WebMeta/index.vue"),
        meta: {
            title: "网站元信息配置",
            category: "网站工具",
            description:
                "在线网站SEO元信息生成工具，快速生成meta标签、Open Graph、Twitter Card等",
            keywords: "SEO, meta标签, Open Graph, Twitter Card, 网站优化",
        },
    },
    {
        path: "/file-accept",
        name: "FileAcceptGenerator",
        component: () => import("@/views/FileAcceptGenerator/index.vue"),
        meta: {
            title: "文件类型Accept生成",
            category: "文件处理",
            description:
                "在线文件类型Accept属性生成器，快速生成HTML input文件选择器的accept属性",
            keywords: "文件类型, Accept属性, HTML, input, 文件选择器",
        },
    },
    {
        path: "/image-location",
        name: "ImageLocationViewer",
        component: () => import("@/views/ImageLocationViewer/index.vue"),
        meta: {
            title: "图片元信息查看",
            category: "文件处理",
            description:
                "在线图片EXIF信息查看工具，查看照片拍摄时间、地理位置、相机参数等元数据",
            keywords: "图片EXIF, 元信息, 照片信息, 地理位置, 相机参数",
        },
    },
    {
        path: "/pets",
        name: "HarmfulToPets",
        component: () => import("@/views/HarmfulToPets/index.vue"),
        meta: {
            title: "养宠注意指南",
            category: "生活工具",
            description:
                "宠物安全指南，了解对宠物有害的食物、植物和家庭用品，保护宠物健康",
            keywords: "宠物安全, 宠物健康, 有害食物, 有害植物, 宠物护理",
        },
    },
];

export function createMyRouter() {
    const router = createRouter({
        history:
            typeof window !== "undefined"
                ? createWebHistory()
                : createMemoryHistory(),
        routes,
    });

    if (typeof window !== "undefined") {
        router.beforeEach((to) => {
            document.title = `${to.meta.title} · CodeForge`;
            showLoading();
        });

        router.afterEach(() => {
            hideLoading();
        });
    }

    return router;
}

// 导出默认路由实例（为了向后兼容）
const router = createMyRouter();
export default router;
