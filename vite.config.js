import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import Sitemap from "vite-plugin-sitemap";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      vue(),
      Sitemap({
        hostname: env.VITE_APP_URL,
        outDir: "dist",
        dynamicRoutes: ["/icns", "/year", "/sheet2code", "/profile"],
      }),
    ],
    build: {
      minify: true,
      cssMinify: true,
      cssCodeSplit: true,
    },
    optimizeDeps: {
      include: [
        "vue",
        "vue-router",
        "xlsx",
        "jszip",
        "html2pdf.js",
        "shiki",
        "notiflix",
      ],
      exclude: [],
    },
    server: {
      host: "0.0.0.0",
      open: true,
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
});
