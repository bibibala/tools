<template>
    <div class="tool-page">
        <!-- 工具标题 -->
        <header class="tool-header">
            <h1>Prettier 配置导出工具</h1>
            <p>选择你的 Prettier 规则，一键导出配置文件</p>
        </header>

        <!-- 基础格式配置区域 -->
        <section class="tool-section">
            <h2 class="section-title">基础格式配置</h2>
            <div class="config-grid">
                <!-- 缩进配置 -->
                <div class="config-item">
                    <label class="section-label">缩进方式</label>
                    <select
                        v-model="prettierConfig.useTabs"
                        class="form-input form-select"
                    >
                        <option :value="false">空格（2个）</option>
                        <option :value="true">Tab</option>
                    </select>
                </div>

                <!-- 换行长度 -->
                <div class="config-item">
                    <label class="section-label">单行最大长度</label>
                    <input
                        type="number"
                        v-model.number="prettierConfig.printWidth"
                        min="40"
                        max="200"
                        class="form-input"
                    />
                </div>

                <!-- 尾逗号 -->
                <div class="config-item">
                    <label class="section-label">尾逗号</label>
                    <select
                        v-model="prettierConfig.trailingComma"
                        class="form-input form-select"
                    >
                        <option value="none">无（none）</option>
                        <option value="es5">ES5 兼容（es5）</option>
                        <option value="all">全部（all）</option>
                    </select>
                </div>

                <!-- 分号 -->
                <div class="config-item">
                    <label class="section-label">语句分号</label>
                    <select
                        v-model="prettierConfig.semi"
                        class="form-input form-select"
                    >
                        <option :value="true">添加分号（;）</option>
                        <option :value="false">不添加分号</option>
                    </select>
                </div>

                <!-- 引号 -->
                <div class="config-item">
                    <label class="section-label">字符串引号</label>
                    <select
                        v-model="prettierConfig.singleQuote"
                        class="form-input form-select"
                    >
                        <option :value="true">单引号（'）</option>
                        <option :value="false">双引号（"）</option>
                    </select>
                </div>

                <!-- 对象括号间距 -->
                <div class="config-item">
                    <label class="section-label">对象括号间距</label>
                    <select
                        v-model="prettierConfig.bracketSpacing"
                        class="form-input form-select"
                    >
                        <option :value="true">有间距（{ foo }）</option>
                        <option :value="false">无间距（{foo}）</option>
                    </select>
                </div>
            </div>
        </section>
        <!-- JavaScript/TypeScript 配置 -->
        <section class="tool-section">
            <h2 class="section-title">JavaScript/TypeScript</h2>
            <div class="config-grid">
                <!-- JSX 引号 -->
                <div class="config-item">
                    <label class="section-label">JSX 引号</label>
                    <select
                        v-model="prettierConfig.jsxSingleQuote"
                        class="form-input form-select"
                    >
                        <option :value="false">双引号（"）</option>
                        <option :value="true">单引号（'）</option>
                    </select>
                </div>

                <!-- 箭头函数括号 -->
                <div class="config-item">
                    <label class="section-label">箭头函数括号</label>
                    <select
                        v-model="prettierConfig.arrowParens"
                        class="form-input form-select"
                    >
                        <option value="avoid">省略括号（x => x）</option>
                        <option value="always">强制括号（(x) => x）</option>
                    </select>
                </div>

                <!-- 函数括号空格 -->
                <div class="config-item">
                    <label class="section-label">函数括号空格</label>
                    <select
                        v-model="prettierConfig.spaceBeforeFunctionParen"
                        class="form-input form-select"
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
                    <label class="section-label">装饰器位置</label>
                    <select
                        v-model="prettierConfig.decoratorsBeforeExport"
                        class="form-input form-select"
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
        </section>

        <!-- HTML/CSS 配置 -->
        <section class="tool-section">
            <h2 class="section-title">HTML/CSS 配置</h2>
            <div class="config-grid">
                <!-- HTML 空格敏感度 -->
                <div class="config-item">
                    <label class="section-label">HTML 空格敏感度</label>
                    <select
                        v-model="prettierConfig.htmlWhitespaceSensitivity"
                        class="form-input form-select"
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
                    <label class="section-label">Vue 脚本缩进</label>
                    <select
                        v-model="prettierConfig.vueIndentScriptAndStyle"
                        class="form-input form-select"
                    >
                        <option :value="false">不缩进</option>
                        <option :value="true">缩进（与模板保持一致）</option>
                    </select>
                </div>

                <!-- 行内元素换行 -->
                <div class="config-item">
                    <label class="section-label">行内元素换行</label>
                    <select
                        v-model="prettierConfig.singleAttributePerLine"
                        class="form-input form-select"
                    >
                        <option :value="false">允许多个属性在同一行</option>
                        <option :value="true">每个属性单独一行</option>
                    </select>
                </div>
            </div>
        </section>

        <!-- 高级配置区域 -->
        <section class="tool-section">
            <h2 class="section-title">高级配置</h2>
            <div class="config-grid">
                <!-- 换行符 -->
                <div class="config-item">
                    <label class="section-label">换行符格式</label>
                    <select
                        v-model="prettierConfig.endOfLine"
                        class="form-input form-select"
                    >
                        <option value="lf">LF（Linux/macOS）</option>
                        <option value="crlf">CRLF（Windows）</option>
                        <option value="cr">CR（旧 Mac）</option>
                        <option value="auto">自动识别</option>
                    </select>
                </div>

                <!--  proseWrap -->
                <div class="config-item">
                    <label class="section-label">Markdown 换行处理</label>
                    <select
                        v-model="prettierConfig.proseWrap"
                        class="form-input form-select"
                    >
                        <option value="preserve">保留原有换行</option>
                        <option value="always">超过长度时换行</option>
                        <option value="never">不自动换行</option>
                    </select>
                </div>

                <!-- 配置文件格式 -->
                <div class="config-item">
                    <label class="section-label">导出文件格式</label>
                    <select
                        v-model="exportFormat"
                        class="form-input form-select"
                    >
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
        </section>

        <!-- 配置预览区域 -->
        <section class="tool-section">
            <h2 class="section-title">配置预览（语法高亮）</h2>
            <div class="preview-card">
                <CodeHighlighter
                    :code="formattedConfig"
                    :language="highlightLanguage"
                />
            </div>
        </section>

        <!-- 导出按钮 -->
        <div class="action-section">
            <button
                class="btn btn-primary"
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
import CodeHighlighter from "@/components/CodeHighlighter.vue";

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
/* 使用统一的设计系统，无需额外样式 */
</style>
