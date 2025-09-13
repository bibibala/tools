<template>
    <div class="code-highlighter">
        <div v-if="loading" class="loading">正在加载高亮器...</div>
        <div v-else-if="error" class="error">
            {{ error }}
        </div>
        <div v-else v-html="highlightedCode" class="highlighted-code" />
    </div>
</template>

<script setup>
import { createHighlighter } from "shiki";
import { ref, computed, onMounted, watch, nextTick } from "vue";

const { code, language, theme } = defineProps({
    code: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        default: "json",
    },
    theme: {
        type: String,
        default: "vitesse-dark",
    },
});

const highlighter = ref(null);
const loading = ref(true);
const error = ref("");

// 统一的语言映射配置
const languageMap = {
    // JavaScript 相关
    js: "javascript",
    jsx: "javascript",

    // TypeScript 相关
    ts: "typescript",
    tsx: "typescript",

    // HTML 相关
    htm: "html",

    // CSS 相关
    css: "css",
    scss: "scss",
    sass: "sass",
    less: "less",
    stylus: "stylus",

    // 其他常用语言
    py: "python",
    rb: "ruby",
    sh: "bash",
    shell: "bash",
    yml: "yaml",

    // 保持原样的语言
    json: "json",
    html: "html",
    javascript: "javascript",
    typescript: "typescript",
    python: "python",
    java: "java",
    cpp: "cpp",
    c: "c",
    go: "go",
    rust: "rust",
    php: "php",
    swift: "swift",
    kotlin: "kotlin",
    dart: "dart",
    vue: "vue",
    xml: "xml",
    sql: "sql",
    markdown: "markdown",
    md: "markdown",
    yaml: "yaml",
    toml: "toml",
    ini: "ini",
    dockerfile: "dockerfile",
    bash: "bash",
    powershell: "powershell",
    r: "r",
    matlab: "matlab",
    latex: "latex",
    graphql: "graphql",
};

const normalizedLanguage = computed(() => {
    const lang = language.toLowerCase();
    return languageMap[lang] || lang;
});

const highlightedCode = computed(() => {
    if (!highlighter.value || !code.trim()) {
        return "<pre><code></code></pre>";
    }

    try {
        return highlighter.value.codeToHtml(code, {
            lang: normalizedLanguage.value,
            theme,
        });
    } catch (err) {
        console.error("代码高亮失败:", err);
        return `<pre><code>${escapeHtml(code)}</code></pre>`;
    }
});

async function initShiki() {
    try {
        loading.value = true;
        error.value = "";

        highlighter.value = await createHighlighter({
            themes: [theme],
            langs: [normalizedLanguage.value],
        });

        console.log("Shiki 初始化成功");
    } catch (err) {
        console.error("初始化 Shiki 失败:", err);
        error.value = `代码高亮器加载失败: ${err.message}`;
    } finally {
        loading.value = false;
    }
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

onMounted(initShiki);

watch(
    () => theme,
    async (newTheme, oldTheme) => {
        if (highlighter.value && newTheme !== oldTheme) {
            try {
                const loadedThemes = highlighter.value.getLoadedThemes();
                if (!loadedThemes.includes(newTheme)) {
                    await highlighter.value.loadTheme(newTheme);
                }
                await nextTick();
            } catch (err) {
                console.warn("加载新主题失败:", err);
            }
        }
    },
);

watch(
    () => language,
    async (newLang, oldLang) => {
        if (highlighter.value && newLang !== oldLang) {
            try {
                const normalizedLang = normalizedLanguage.value;
                const loadedLangs = highlighter.value.getLoadedLanguages();
                if (!loadedLangs.includes(normalizedLang)) {
                    await highlighter.value.loadLanguage(normalizedLang);
                }
                await nextTick();
            } catch (err) {
                console.warn("加载新语言失败:", err);
            }
        }
    },
);
</script>

<style scoped>
.code-highlighter {
    width: 100%;
}

.loading {
    padding: 16px;
    text-align: center;
    color: #666;
    font-style: italic;
}

.error {
    padding: 16px;
    background-color: #fee;
    border: 1px solid #fcc;
    border-radius: 4px;
    color: #c33;
}

.highlighted-code {
    width: 100%;
    overflow-x: auto;
}

.highlighted-code :deep(pre) {
    margin: 0;
    padding: 16px !important;
    border-radius: 8px;
    font-family: "Monaco", "Consolas", "Ubuntu Mono", monospace;
    font-size: 14px;
    line-height: 1.5;
    overflow-x: auto;
}

.highlighted-code :deep(code) {
    font-family: inherit;
    font-size: inherit;
}

.highlighted-code :deep(pre::-webkit-scrollbar) {
    height: 8px;
}

.highlighted-code :deep(pre::-webkit-scrollbar-track) {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
}

.highlighted-code :deep(pre::-webkit-scrollbar-thumb) {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
}

.highlighted-code :deep(pre::-webkit-scrollbar-thumb:hover) {
    background: rgba(255, 255, 255, 0.5);
}
</style>
