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
import { createHighlighterCore } from "shiki/core";
import { copyToClipboard } from "@/utils/useToClipboard.js";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { ref, onMounted, watch, watchEffect, onBeforeUnmount } from "vue";

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

// 代码高亮处理
const processHighlighting = async () => {
    highlightedCode.value = highlighter.value.codeToHtml(code, {
        lang: language.toLowerCase(),
        theme,
    });
};
onMounted(initCodeHighlighter);

onBeforeUnmount(() => {
    if (highlighter.value) {
        highlighter.value.dispose();
    }
});

// 初始化
async function initCodeHighlighter() {
    try {
        loading.value = true;
        error.value = "";

        highlighter.value = await createHighlighterCore({
            themes: [import("shiki/dist/themes/vitesse-dark")],
            langs: [
                import("shiki/dist/langs/typescript"),
                import("shiki/dist/langs/javascript"),
                import("shiki/dist/langs/html"),
                import("shiki/dist/langs/css"),
                import("shiki/dist/langs/json"),
                import("shiki/dist/langs/sass"),
            ],
            engine: createJavaScriptRegexEngine(),
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

watch(
    () => language,
    async () => {
        if (highlighter.value) {
            await processHighlighting();
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
