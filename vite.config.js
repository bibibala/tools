import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            registerType: "autoUpdate",
            workbox: {
                globDirectory: "dev-dist",
                globPatterns: ["**/*.js"],
                globIgnores: ["**/node_modules/**/*", "sw.js", "workbox-*.js"],
                navigateFallback: null, // 禁用离线页面，支持完全离线使用
                navigateFallbackDenylist: [/^\/api/],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: "CacheFirst",
                        options: {
                            cacheName: "google-fonts-cache",
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                    {
                        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                        handler: "CacheFirst",
                        options: {
                            cacheName: "google-fonts-static-cache",
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                ],
            },
            manifest: {
                name: "CodeForge",
                short_name: "CodeForge",
                description:
                    "Professional code generation and development tools",
                theme_color: "#2563eb",
                background_color: "#ffffff",
                display: "standalone",
                scope: "/",
                start_url: "/",
                icons: [
                    {
                        src: "android-chrome-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "android-chrome-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
                categories: ["developer", "productivity", "utilities"],
                lang: "zh-CN",
                dir: "ltr",
                orientation: "any",
                prefer_related_applications: false,
            },
            devOptions: {
                enabled: true,
                type: "module",
                // suppressWarnings: true, // 抑制开发模式下的警告
            },
        }),
    ],
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
            "workbox-window",
            "vite-plugin-pwa",
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
