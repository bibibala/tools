import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";

export default defineConfig([
    {
        name: "app/files-to-lint",
        files: ["**/*.{js,mjs,jsx,vue}"],
    },

    globalIgnores(["**/dist/**", "**/dist-ssr/**", "**/coverage/**"]),

    {
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            "no-unused-vars": "error",
            "no-useless-escape": "off",
            "vue/no-mutating-props": "off",
            "prefer-promise-reject-errors": "off",
            "vue/multi-word-component-names": [
                "error",
                {
                    ignores: ["index"], // 忽略 index.vue
                },
            ],
        },
    },

    js.configs.recommended,
    ...pluginVue.configs["flat/essential"],
    skipFormatting,
]);
