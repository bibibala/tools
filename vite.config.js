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
    optimizeDeps: {
        include: ["vue", "vue-router", "notiflix", "shiki", "json-editor-vue"],
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
