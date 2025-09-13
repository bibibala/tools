<template>
    <div class="prettier-tool">
        <!-- 工具标题 -->
        <div class="tool-header">
            <h2>Prettier 配置导出工具</h2>
            <p class="tool-desc">选择你的 Prettier 规则，一键导出配置文件</p>
        </div>

        <!-- 基础格式配置区域 -->
        <div class="config-section">
            <h3 class="section-title">基础格式配置</h3>
            <div class="config-grid">
                <!-- 缩进配置 -->
                <div class="config-item">
                    <label class="config-label">缩进方式</label>
                    <select
                        v-model="prettierConfig.useTabs"
                        class="config-input"
                    >
                        <option :value="false">空格（2个）</option>
                        <option :value="true">Tab</option>
                    </select>
                </div>

                <!-- 换行长度 -->
                <div class="config-item">
                    <label class="config-label">单行最大长度</label>
                    <input
                        type="number"
                        v-model.number="prettierConfig.printWidth"
                        min="40"
                        max="200"
                        class="config-input"
                    />
                </div>

                <!-- 尾逗号 -->
                <div class="config-item">
                    <label class="config-label">尾逗号</label>
                    <select
                        v-model="prettierConfig.trailingComma"
                        class="config-input"
                    >
                        <option value="none">无（none）</option>
                        <option value="es5">ES5 兼容（es5）</option>
                        <option value="all">全部（all）</option>
                    </select>
                </div>

                <!-- 分号 -->
                <div class="config-item">
                    <label class="config-label">语句分号</label>
                    <select v-model="prettierConfig.semi" class="config-input">
                        <option :value="true">添加分号（;）</option>
                        <option :value="false">不添加分号</option>
                    </select>
                </div>

                <!-- 引号 -->
                <div class="config-item">
                    <label class="config-label">字符串引号</label>
                    <select
                        v-model="prettierConfig.singleQuote"
                        class="config-input"
                    >
                        <option :value="true">单引号（'）</option>
                        <option :value="false">双引号（"）</option>
                    </select>
                </div>

                <!-- 对象括号间距 -->
                <div class="config-item">
                    <label class="config-label">对象括号间距</label>
                    <select
                        v-model="prettierConfig.bracketSpacing"
                        class="config-input"
                    >
                        <option :value="true">有间距（{ foo }）</option>
                        <option :value="false">无间距（{foo}）</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- JavaScript/TypeScript 配置 -->
        <div class="config-section">
            <h3 class="section-title">JavaScript/TypeScript</h3>
            <div class="config-grid">
                <!-- JSX 引号 -->
                <div class="config-item">
                    <label class="config-label">JSX 引号</label>
                    <select
                        v-model="prettierConfig.jsxSingleQuote"
                        class="config-input"
                    >
                        <option :value="false">双引号（"）</option>
                        <option :value="true">单引号（'）</option>
                    </select>
                </div>

                <!-- 箭头函数括号 -->
                <div class="config-item">
                    <label class="config-label">箭头函数括号</label>
                    <select
                        v-model="prettierConfig.arrowParens"
                        class="config-input"
                    >
                        <option value="avoid">省略括号（x => x）</option>
                        <option value="always">强制括号（(x) => x）</option>
                    </select>
                </div>

                <!-- 函数括号空格 -->
                <div class="config-item">
                    <label class="config-label">函数括号空格</label>
                    <select
                        v-model="prettierConfig.spaceBeforeFunctionParen"
                        class="config-input"
                    >
                        <option :value="false">无空格（function()）</option>
                        <option :value="true">有空格（function ()）</option>
                        <option value="always">
                            总是有空格（包括箭头函数）
                        </option>
                        <option value="never">
                            总是无空格（包括匿名函数）
                        </option>
                    </select>
                </div>

                <!-- 装饰器位置 -->
                <div class="config-item">
                    <label class="config-label">装饰器位置</label>
                    <select
                        v-model="prettierConfig.decoratorsBeforeExport"
                        class="config-input"
                    >
                        <option :value="true">
                            导出前（@decorator export）
                        </option>
                        <option :value="false">
                            导出后（export @decorator）
                        </option>
                    </select>
                </div>
            </div>
        </div>

        <!-- HTML/CSS 配置 -->
        <div class="config-section">
            <h3 class="section-title">HTML/CSS 配置</h3>
            <div class="config-grid">
                <!-- HTML 空格敏感度 -->
                <div class="config-item">
                    <label class="config-label">HTML 空格敏感度</label>
                    <select
                        v-model="prettierConfig.htmlWhitespaceSensitivity"
                        class="config-input"
                    >
                        <option value="css">遵循 CSS 规则</option>
                        <option value="strict">
                            严格模式（所有空格都重要）
                        </option>
                        <option value="ignore">忽略空格（仅关注语义）</option>
                    </select>
                </div>

                <!-- Vue 文件脚本缩进 -->
                <div class="config-item">
                    <label class="config-label">Vue 脚本缩进</label>
                    <select
                        v-model="prettierConfig.vueIndentScriptAndStyle"
                        class="config-input"
                    >
                        <option :value="false">不缩进</option>
                        <option :value="true">缩进（与模板保持一致）</option>
                    </select>
                </div>

                <!-- 行内元素换行 -->
                <div class="config-item">
                    <label class="config-label">行内元素换行</label>
                    <select
                        v-model="prettierConfig.singleAttributePerLine"
                        class="config-input"
                    >
                        <option :value="false">允许多个属性在同一行</option>
                        <option :value="true">每个属性单独一行</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- 高级配置区域 -->
        <div class="config-section">
            <h3 class="section-title">高级配置</h3>
            <div class="config-grid">
                <!-- 换行符 -->
                <div class="config-item">
                    <label class="config-label">换行符格式</label>
                    <select
                        v-model="prettierConfig.endOfLine"
                        class="config-input"
                    >
                        <option value="lf">LF（Linux/macOS）</option>
                        <option value="crlf">CRLF（Windows）</option>
                        <option value="cr">CR（旧 Mac）</option>
                        <option value="auto">自动识别</option>
                    </select>
                </div>

                <!--  proseWrap -->
                <div class="config-item">
                    <label class="config-label">Markdown 换行处理</label>
                    <select
                        v-model="prettierConfig.proseWrap"
                        class="config-input"
                    >
                        <option value="preserve">保留原有换行</option>
                        <option value="always">超过长度时换行</option>
                        <option value="never">不自动换行</option>
                    </select>
                </div>

                <!-- 配置文件格式 -->
                <div class="config-item">
                    <label class="config-label">导出文件格式</label>
                    <select v-model="exportFormat" class="config-input">
                        <option value="js">
                            prettier.config.js（JS 模块）
                        </option>
                        <option value="json">.prettierrc（JSON 格式）</option>
                        <option value="json5">
                            .prettierrc.json5（JSON5 格式）
                        </option>
                    </select>
                </div>
            </div>
        </div>

        <!-- 配置预览区域 -->
        <div class="preview-section">
            <h3 class="section-title">配置预览（语法高亮）</h3>
            <div class="preview-card">
                <CodeHighlighter
                    :code="formattedConfig"
                    :language="highlightLanguage"
                />
            </div>
        </div>

        <!-- 导出按钮 -->
        <div class="action-section">
            <button
                class="export-btn"
                @click="downloadConfig"
                :disabled="!formattedConfig"
            >
                导出 {{ exportFileName }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import CodeHighlighter from "@/components/ShikiCodeHighlighter.vue";

const prettierConfig = ref({
    // 基础配置
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: false,
    trailingComma: "es5",
    bracketSpacing: true,

    // JavaScript/TypeScript 配置
    jsxSingleQuote: false,
    arrowParens: "avoid",
    spaceBeforeFunctionParen: false,
    decoratorsBeforeExport: true,

    // HTML/CSS 配置
    htmlWhitespaceSensitivity: "css",
    vueIndentScriptAndStyle: false,
    singleAttributePerLine: false,

    // 高级配置
    endOfLine: "lf",
    proseWrap: "preserve",
});

const exportFormat = ref("js");

const exportFileName = computed(() => {
    switch (exportFormat.value) {
        case "js":
            return "prettier.config.js";
        case "json":
            return ".prettierrc";
        case "json5":
            return ".prettierrc.json5";
        default:
            return "prettier.config.js";
    }
});

const highlightLanguage = computed(() => {
    switch (exportFormat.value) {
        case "js":
            return "js";
        case "json":
            return "json";
        case "json5":
            return "json";
        default:
            return "js";
    }
});

const formattedConfig = computed(() => {
    const config = { ...prettierConfig.value };
    if (config.useTabs) delete config.tabWidth;

    switch (exportFormat.value) {
        case "js":
            return `module.exports = ${JSON.stringify(config, null, 2)};\n`;
        case "json":
            return JSON.stringify(config, null, 2);
        case "json5":
            return JSON.stringify(config, null, 2)
                .replace(/"([^"]+)":/g, "$1:")
                .replace(/,(\s*[}])/g, "$1");
        default:
            return `module.exports = ${JSON.stringify(config, null, 2)};\n`;
    }
});

const downloadConfig = () => {
    const content = formattedConfig.value;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = exportFileName.value;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
</script>

<style scoped>
.prettier-tool {
    max-width: 900px;
    margin: 0 auto;
    padding: 24px 16px;
    font-family: inherit;
    color: var(--text);
}

.tool-header {
    margin-bottom: 32px;
    text-align: center;
}

.tool-header h2 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 8px;
    color: var(--accent);
}

.tool-desc {
    font-size: 14px;
    color: var(--muted);
    margin: 0;
}

.config-section {
    margin-bottom: 32px;
}

.section-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
    color: var(--accent);
}

.config-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
}

.config-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.config-label {
    font-size: 14px;
    color: var(--text);
    font-weight: 500;
}

.config-input {
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg);
    color: var(--text);
    font-size: 14px;
    transition: border-color 0.15s ease;
}

.config-input:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgba(17, 24, 39, 0.1);
}

.preview-section {
    margin-bottom: 32px;
}

.preview-card {
    padding: 8px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    overflow-x: auto;
}

.action-section {
    display: flex;
    justify-content: center;
    margin-top: 16px;
}

.export-btn {
    padding: 10px 24px;
    border: none;
    border-radius: 6px;
    background: var(--accent);
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.export-btn:hover {
    background: #1f2937;
}

.export-btn:disabled {
    background: var(--muted);
    cursor: not-allowed;
    opacity: 0.7;
}

@media (max-width: 768px) {
    .config-grid {
        grid-template-columns: 1fr;
    }

    .tool-header h2 {
        font-size: 20px;
    }

    .section-title {
        font-size: 16px;
    }

    .export-btn {
        padding: 8px 20px;
        font-size: 14px;
    }

    .preview-card {
        padding: 4px;
    }
}
</style>
