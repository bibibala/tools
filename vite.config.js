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
        onPageRendered(route, html, appCtx) {
            // 从路由配置中获取meta信息
            const routeConfig = appCtx.routes.find((r) => r.path === route);

            if (routeConfig && routeConfig.meta) {
                const { title, description, keywords } = routeConfig.meta;

                // 替换title
                if (title) {
                    const fullTitle = title.includes("CodeForge")
                        ? title
                        : `${title} · CodeForge`;
                    html = html.replace(
                        /<title>.*?<\/title>/i,
                        `<title>${fullTitle}</title>`,
                    );
                }

                // 替换description
                if (description) {
                    html = html.replace(
                        /<meta\s+name="description"\s+content="[^"]*"/i,
                        `<meta name="description" content="${description}"`,
                    );
                }

                // 替换keywords
                if (keywords) {
                    html = html.replace(
                        /<meta\s+name="keywords"\s+content="[^"]*"/i,
                        `<meta name="keywords" content="${keywords}"`,
                    );
                }

                // 替换Open Graph
                if (title) {
                    html = html.replace(
                        /<meta\s+property="og:title"\s+content="[^"]*"/i,
                        `<meta property="og:title" content="${title}"`,
                    );
                }

                if (description) {
                    html = html.replace(
                        /<meta\s+property="og:description"\s+content="[^"]*"/i,
                        `<meta property="og:description" content="${description}"`,
                    );
                }

                // 替换Twitter Card
                if (title) {
                    html = html.replace(
                        /<meta\s+name="twitter:title"\s+content="[^"]*"/i,
                        `<meta name="twitter:title" content="${title}"`,
                    );
                }

                if (description) {
                    html = html.replace(
                        /<meta\s+name="twitter:description"\s+content="[^"]*"/i,
                        `<meta name="twitter:description" content="${description}"`,
                    );
                }
            }

            return html;
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
