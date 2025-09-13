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

const {
    code,
    language = "json",
    theme = "vitesse-dark",
} = defineProps({
    code: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        default: "json",
        validator: (value) =>
            ["json", "typescript", "ts", "js"].includes(value),
    },
    theme: {
        type: String,
        default: "vitesse-dark",
    },
});

const highlighter = ref(null);
const loading = ref(true);
const error = ref("");

const langMap = {
    ts: "typescript",
    js: "javascript",
};

const normalizedLanguage = computed(() => langMap[language] || language);

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
