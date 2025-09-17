<template>
    <div class="code-highlighter">
        <div v-if="loading" class="loading">正在加载加载高亮加载高亮器...</div>
        <div v-else-if="error" class="error">
            {{ error }}
        </div>
        <div v-else class="code-container">
            <button class="copy-btn" @click="copyToClipboard(code)">
                <i class="icon">📋</i>
                <span class="text">复制</span>
            </button>
            <div v-html="highlightedCode" class="highlighted-code" />
        </div>
    </div>
</template>

<script setup>
import { createHighlighter } from "shiki";
import { ref, computed, onMounted, watch, watchEffect } from "vue";
import { copyToClipboard } from "@/utils/useToClipboard.js";

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

// 状态管理
const highlighter = ref(null);
const loading = ref(true);
const error = ref("");
const highlightedCode = ref("<pre><code></code></pre>");

// 常用主题和语言预加载
const commonThemes = ["vitesse-dark"];
const commonLanguages = ["javascript", "typescript", "json", "sass", "html"];

// 直接使用传入的语言，不做任何映射
const normalizedLanguage = computed(() => {
    return language.toLowerCase();
});

// 代码高亮处理
const processHighlighting = async () => {
    if (!highlighter.value || !code.trim()) {
        highlightedCode.value = "<pre><code></code></pre>";
        return;
    }

    try {
        highlightedCode.value = await highlighter.value.codeToHtml(code, {
            lang: normalizedLanguage.value,
            theme,
        });
    } catch (err) {
        console.error("代码高亮失败:", err);
        highlightedCode.value = `<pre><code>${escapeHtml(code)}</code></pre>`;
    }
};

// 初始化Shiki
async function initShiki() {
    try {
        loading.value = true;
        error.value = "";

        const themesToLoad = [...new Set([theme, ...commonThemes])];
        const langsToLoad = [
            ...new Set([normalizedLanguage.value, ...commonLanguages]),
        ];

        highlighter.value = await createHighlighter({
            themes: themesToLoad,
            langs: langsToLoad,
        });

        await processHighlighting();
    } catch (err) {
        console.error("初始化 Shiki 失败:", err);
        error.value = `代码高亮器加载失败: ${err.message}`;
        highlightedCode.value = `<pre><code>${escapeHtml(code)}</code></pre>`;
    } finally {
        loading.value = false;
    }
}

// HTML转义
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// 生命周期和监听器
onMounted(initShiki);

watch(
    () => theme,
    async (newTheme) => {
        if (highlighter.value) {
            try {
                const loadedThemes = highlighter.value.getLoadedThemes();
                if (!loadedThemes.includes(newTheme)) {
                    await highlighter.value.loadTheme(newTheme);
                }
                await processHighlighting();
            } catch (err) {
                console.warn("加载新主题失败:", err);
            }
        }
    },
);

watch(
    () => language,
    async () => {
        if (highlighter.value) {
            try {
                const normalizedLang = normalizedLanguage.value;
                const loadedLangs = highlighter.value.getLoadedLanguages();
                if (!loadedLangs.includes(normalizedLang)) {
                    await highlighter.value.loadLanguage(normalizedLang);
                }
                await processHighlighting();
            } catch (err) {
                console.warn("加载新语言失败:", err);
            }
        }
    },
);

watch(
    () => code,
    async () => {
        if (highlighter.value && !loading.value && !error.value) {
            await processHighlighting();
        }
    },
);

watchEffect(() => {
    if (
        !loading.value &&
        !error.value &&
        highlighter.value &&
        highlightedCode.value === "<pre><code></code></pre>" &&
        code.trim()
    ) {
        console.log("检测到空高亮内容，尝试重新处理");
        setTimeout(processHighlighting, 100);
    }
});
</script>

<style scoped>
.code-highlighter {
    width: 100%;
    position: relative;
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

.code-container {
    position: relative;
    width: 100%;
}

.copy-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    opacity: 0;
    transition:
        opacity 0.2s ease,
        background-color 0.2s ease;
}

.code-container:hover .copy-btn {
    opacity: 99;
}

.copy-btn:hover {
    background-color: rgba(0, 0, 0, 0.7);
}

.icon {
    font-size: 14px;
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
    min-height: 24px;
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
