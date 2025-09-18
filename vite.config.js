import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
    plugins: [vue()],
    build: {
        minify: true,
        cssMinify: true,
        cssCodeSplit: true,
    },
    ssgOptions: {
        script: "async",
        formatting: "minify",
        crittersOptions: {
            reduceInlineStyles: false,
        },
        includedRoutes(paths, routes) {
            return routes.flatMap((route) => {
                return route.path === "/" ? ["/"] : [route.path];
            });
        },
    },
    optimizeDeps: {
        include: [
            "vue",
            "vue-router",
            "notiflix",
            "shiki",
            "exif-js",
            "lunar-javascript",
        ],
        exclude: [
            "eslint",
            "@eslint/js",
            "eslint-plugin-vue",
            "@vue/eslint-config-prettier",
            "prettier",
            "lint-staged",
            "simple-git-hooks",
            "vite",
            "@vitejs/plugin-vue",
            "globals",
        ],
    },
    server: {
        host: "0.0.0.0",
        open: {
            app: { name: "google chrome" },
        },
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
});
