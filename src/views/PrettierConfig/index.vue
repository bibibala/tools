<template>
    <div class="tool-page">
        <!-- 工具标题 -->
        <header class="tool-header">
            <h1>代码格式化配置工具</h1>
            <p>
                一键生成 Prettier、ESLint、EditorConfig 和 GitAttributes
                配置文件
            </p>
        </header>

        <!-- 配置套餐选择 -->
        <section class="tool-section">
            <h2 class="section-title">配置套餐</h2>
            <div class="config-grid">
                <div class="config-item">
                    <label class="section-label">选择预设配置</label>
                    <select
                        v-model="selectedPreset"
                        class="form-input form-select"
                        @change="applyPreset"
                    >
                        <option value="custom">自定义配置</option>
                        <option value="standard">标准配置（推荐）</option>
                        <option value="airbnb">Airbnb 风格</option>
                        <option value="google">Google 风格</option>
                        <option value="vue">Vue.js 项目</option>
                        <option value="react">React 项目</option>
                        <option value="typescript">TypeScript 项目</option>
                    </select>
                </div>
            </div>
        </section>

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

        <!-- ESLint 配置区域 -->
        <section class="tool-section">
            <h2 class="section-title">ESLint 配置</h2>
            <div class="eslint-config-container">
                <!-- ESLint 启用开关 -->
                <div class="eslint-toggle">
                    <label class="toggle-label">
                        <input
                            type="checkbox"
                            v-model="eslintConfig.enabled"
                            class="toggle-input"
                        />
                        <span class="toggle-slider"></span>
                        <span class="toggle-text">启用 ESLint 配置</span>
                    </label>
                </div>

                <!-- ESLint 详细配置 -->
                <div v-if="eslintConfig.enabled" class="eslint-details">
                    <div class="config-row">
                        <div class="config-group">
                            <h4 class="group-title">运行环境</h4>
                            <div class="checkbox-grid">
                                <label class="checkbox-item">
                                    <input
                                        type="checkbox"
                                        v-model="eslintConfig.env.browser"
                                    />
                                    <span class="checkmark"></span>
                                    浏览器环境
                                </label>
                                <label class="checkbox-item">
                                    <input
                                        type="checkbox"
                                        v-model="eslintConfig.env.node"
                                    />
                                    <span class="checkmark"></span>
                                    Node.js 环境
                                </label>
                                <label class="checkbox-item">
                                    <input
                                        type="checkbox"
                                        v-model="eslintConfig.env.es6"
                                    />
                                    <span class="checkmark"></span>
                                    ES6+ 语法
                                </label>
                            </div>
                        </div>

                        <div class="config-group">
                            <h4 class="group-title">扩展配置</h4>
                            <div class="checkbox-grid">
                                <label class="checkbox-item">
                                    <input
                                        type="checkbox"
                                        v-model="
                                            eslintConfig.extends.recommended
                                        "
                                    />
                                    <span class="checkmark"></span>
                                    ESLint 推荐规则
                                </label>
                                <label class="checkbox-item">
                                    <input
                                        type="checkbox"
                                        v-model="eslintConfig.extends.prettier"
                                    />
                                    <span class="checkmark"></span>
                                    Prettier 集成
                                </label>
                                <label class="checkbox-item">
                                    <input
                                        type="checkbox"
                                        v-model="eslintConfig.extends.vue"
                                    />
                                    <span class="checkmark"></span>
                                    Vue.js 支持
                                </label>
                                <label class="checkbox-item">
                                    <input
                                        type="checkbox"
                                        v-model="
                                            eslintConfig.extends.typescript
                                        "
                                    />
                                    <span class="checkmark"></span>
                                    TypeScript 支持
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="config-item">
                        <label class="section-label">ECMAScript 版本</label>
                        <select
                            v-model="eslintConfig.parserOptions.ecmaVersion"
                            class="form-input form-select"
                        >
                            <option value="2020">ES2020</option>
                            <option value="2021">ES2021</option>
                            <option value="2022">ES2022</option>
                            <option value="latest">最新版本</option>
                        </select>
                    </div>
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
            <div class="advanced-config">
                <div class="config-row">
                    <div class="config-group">
                        <h4 class="group-title">系统兼容性</h4>
                        <div class="config-item">
                            <label class="section-label">换行符格式</label>
                            <div class="radio-group">
                                <label class="radio-item">
                                    <input
                                        type="radio"
                                        v-model="prettierConfig.endOfLine"
                                        value="lf"
                                        name="endOfLine"
                                    />
                                    <span class="radio-mark"></span>
                                    <span class="radio-text">
                                        <strong>LF</strong>
                                        <small>Linux/macOS</small>
                                    </span>
                                </label>
                                <label class="radio-item">
                                    <input
                                        type="radio"
                                        v-model="prettierConfig.endOfLine"
                                        value="crlf"
                                        name="endOfLine"
                                    />
                                    <span class="radio-mark"></span>
                                    <span class="radio-text">
                                        <strong>CRLF</strong>
                                        <small>Windows</small>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="config-group">
                        <h4 class="group-title">生成文件</h4>
                        <div class="file-selection">
                            <label class="checkbox-item">
                                <input
                                    type="checkbox"
                                    v-model="generateFiles.prettier"
                                />
                                <span class="checkmark"></span>
                                Prettier 配置
                            </label>
                            <label class="checkbox-item">
                                <input
                                    type="checkbox"
                                    v-model="generateFiles.eslint"
                                />
                                <span class="checkmark"></span>
                                ESLint 配置
                            </label>
                            <label class="checkbox-item">
                                <input
                                    type="checkbox"
                                    v-model="generateFiles.editorconfig"
                                />
                                <span class="checkmark"></span>
                                EditorConfig
                            </label>
                            <label class="checkbox-item">
                                <input
                                    type="checkbox"
                                    v-model="generateFiles.gitattributes"
                                />
                                <span class="checkmark"></span>
                                GitAttributes
                            </label>
                        </div>
                    </div>
                </div>

                <div class="config-item">
                    <label class="section-label">配置文件格式</label>
                    <select
                        v-model="exportFormat"
                        class="form-input form-select"
                    >
                        <option value="js">.config.js（JS 模块）</option>
                        <option value="json">.rc（JSON 格式）</option>
                        <option value="json5">.json5（JSON5 格式）</option>
                    </select>
                </div>
            </div>
        </section>

        <!-- 配置预览区域 -->
        <section class="tool-section">
            <h2 class="section-title">配置预览</h2>
            <div class="preview-tabs">
                <button
                    v-for="file in activeFiles"
                    :key="file.name"
                    :class="['tab-btn', { active: activeTab === file.name }]"
                    @click="activeTab = file.name"
                >
                    {{ file.displayName }}
                </button>
            </div>
            <div class="preview-card">
                <CodeHighlighter :code="currentPreviewContent" />
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import CodeHighlighter from "@/components/CodeHighlighter.vue";

// 预设配置
const presets = {
    standard: {
        prettier: {
            printWidth: 80,
            tabWidth: 2,
            useTabs: false,
            semi: true,
            singleQuote: true,
            trailingComma: "es5",
            bracketSpacing: true,
            jsxSingleQuote: true,
            arrowParens: "avoid",
            endOfLine: "lf",
        },
        eslint: {
            enabled: true,
            env: { browser: true, node: true, es6: true },
            extends: {
                recommended: true,
                prettier: true,
                vue: false,
                typescript: false,
            },
            parserOptions: { ecmaVersion: "latest" },
        },
    },
    airbnb: {
        prettier: {
            printWidth: 100,
            tabWidth: 2,
            useTabs: false,
            semi: true,
            singleQuote: true,
            trailingComma: "all",
            bracketSpacing: true,
            jsxSingleQuote: true,
            arrowParens: "always",
            endOfLine: "lf",
        },
        eslint: {
            enabled: true,
            env: { browser: true, node: true, es6: true },
            extends: {
                recommended: true,
                prettier: true,
                vue: false,
                typescript: false,
            },
            parserOptions: { ecmaVersion: "latest" },
        },
    },
    google: {
        prettier: {
            printWidth: 80,
            tabWidth: 2,
            useTabs: false,
            semi: true,
            singleQuote: true,
            trailingComma: "es5",
            bracketSpacing: false,
            jsxSingleQuote: true,
            arrowParens: "always",
            endOfLine: "lf",
        },
        eslint: {
            enabled: true,
            env: { browser: true, node: true, es6: true },
            extends: {
                recommended: true,
                prettier: true,
                vue: false,
                typescript: false,
            },
            parserOptions: { ecmaVersion: "latest" },
        },
    },
    vue: {
        prettier: {
            printWidth: 80,
            tabWidth: 2,
            useTabs: false,
            semi: false,
            singleQuote: true,
            trailingComma: "es5",
            bracketSpacing: true,
            vueIndentScriptAndStyle: true,
            endOfLine: "lf",
        },
        eslint: {
            enabled: true,
            env: { browser: true, node: true, es6: true },
            extends: {
                recommended: true,
                prettier: true,
                vue: true,
                typescript: false,
            },
            parserOptions: { ecmaVersion: "latest" },
        },
    },
    react: {
        prettier: {
            printWidth: 80,
            tabWidth: 2,
            useTabs: false,
            semi: true,
            singleQuote: true,
            trailingComma: "es5",
            bracketSpacing: true,
            jsxSingleQuote: true,
            arrowParens: "avoid",
            endOfLine: "lf",
        },
        eslint: {
            enabled: true,
            env: { browser: true, node: true, es6: true },
            extends: {
                recommended: true,
                prettier: true,
                vue: false,
                typescript: false,
            },
            parserOptions: { ecmaVersion: "latest" },
        },
    },
    typescript: {
        prettier: {
            printWidth: 80,
            tabWidth: 2,
            useTabs: false,
            semi: true,
            singleQuote: true,
            trailingComma: "all",
            bracketSpacing: true,
            arrowParens: "avoid",
            endOfLine: "lf",
        },
        eslint: {
            enabled: true,
            env: { browser: true, node: true, es6: true },
            extends: {
                recommended: true,
                prettier: true,
                vue: false,
                typescript: true,
            },
            parserOptions: { ecmaVersion: "latest" },
        },
    },
};

const selectedPreset = ref("custom");

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
    vueIndentScriptAndStyle: false,
    singleAttributePerLine: false,

    // 高级配置
    endOfLine: "lf",
});

const eslintConfig = ref({
    enabled: true,
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    extends: {
        recommended: true,
        prettier: true,
        vue: false,
        typescript: false,
    },
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
});

const generateFiles = ref({
    prettier: true,
    eslint: true,
    editorconfig: true,
    gitattributes: true,
});

const exportFormat = ref("js");
const activeTab = ref("prettier");

// 应用预设配置
const applyPreset = () => {
    if (selectedPreset.value !== "custom" && presets[selectedPreset.value]) {
        const preset = presets[selectedPreset.value];
        Object.assign(prettierConfig.value, preset.prettier);
        Object.assign(eslintConfig.value, preset.eslint);
    }
};

// 生成 Prettier 配置
const formattedPrettierConfig = computed(() => {
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

// 生成 ESLint 配置
const formattedEslintConfig = computed(() => {
    if (!eslintConfig.value.enabled) return "";

    const config = {
        env: eslintConfig.value.env,
        extends: [],
        parserOptions: {
            ecmaVersion: eslintConfig.value.parserOptions.ecmaVersion,
            sourceType: "module",
        },
        rules: {},
    };

    // 添加扩展配置
    if (eslintConfig.value.extends.recommended) {
        config.extends.push("eslint:recommended");
    }
    if (eslintConfig.value.extends.vue) {
        config.extends.push("plugin:vue/vue3-essential");
    }
    if (eslintConfig.value.extends.typescript) {
        config.extends.push("@typescript-eslint/recommended");
    }
    if (eslintConfig.value.extends.prettier) {
        config.extends.push("prettier");
    }

    // 添加与 Prettier 相关的规则
    if (eslintConfig.value.extends.prettier) {
        config.rules = {
            "prettier/prettier": "error",
            ...config.rules,
        };
    }

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

// 生成 EditorConfig
const formattedEditorConfig = computed(() => {
    const indent = prettierConfig.value.useTabs ? "tab" : "space";
    const indentSize = prettierConfig.value.useTabs
        ? "tab_width"
        : "indent_size";
    const endOfLine = prettierConfig.value.endOfLine === "crlf" ? "crlf" : "lf";

    return `root = true

[*]
charset = utf-8
${indentSize} = ${prettierConfig.value.tabWidth}
indent_style = ${indent}
end_of_line = ${endOfLine}
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
`;
});

// 生成 GitAttributes
const formattedGitAttributes = computed(() => {
    const endOfLine = prettierConfig.value.endOfLine;

    let content = `# Auto detect text files and perform LF normalization
* text=auto

# Source code
*.js text eol=lf
*.jsx text eol=lf
*.ts text eol=lf
*.tsx text eol=lf
*.vue text eol=lf
*.css text eol=lf
*.scss text eol=lf
*.sass text eol=lf
*.less text eol=lf
*.html text eol=lf
*.json text eol=lf
*.md text eol=lf
*.yml text eol=lf
*.yaml text eol=lf

# Images
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.svg text eol=lf

# Fonts
*.woff binary
*.woff2 binary
*.eot binary
*.ttf binary
*.otf binary
`;

    if (endOfLine === "crlf") {
        content = content.replace(/eol=lf/g, "eol=crlf");
    }

    return content;
});

// 活动文件列表
const activeFiles = computed(() => {
    const files = [];

    if (generateFiles.value.prettier) {
        files.push({
            name: "prettier",
            displayName: "Prettier",
            content: formattedPrettierConfig.value,
            language: exportFormat.value === "json" ? "json" : "javascript",
            filename: getPrettierFileName(),
        });
    }

    if (generateFiles.value.eslint && eslintConfig.value.enabled) {
        files.push({
            name: "eslint",
            displayName: "ESLint",
            content: formattedEslintConfig.value,
            language: exportFormat.value === "json" ? "json" : "javascript",
            filename: getEslintFileName(),
        });
    }

    if (generateFiles.value.editorconfig) {
        files.push({
            name: "editorconfig",
            displayName: "EditorConfig",
            content: formattedEditorConfig.value,
            filename: ".editorconfig",
        });
    }

    if (generateFiles.value.gitattributes) {
        files.push({
            name: "gitattributes",
            displayName: "GitAttributes",
            content: formattedGitAttributes.value,
            filename: ".gitattributes",
        });
    }

    return files;
});

// 当前预览内容
const currentPreviewContent = computed(() => {
    const file = activeFiles.value.find((f) => f.name === activeTab.value);
    return file ? file.content : "";
});

// 文件名生成函数
const getPrettierFileName = () => {
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
};

const getEslintFileName = () => {
    switch (exportFormat.value) {
        case "js":
            return "eslint.config.js";
        case "json":
            return ".eslintrc";
        case "json5":
            return ".eslintrc.json5";
        default:
            return "eslint.config.js";
    }
};

// 监听活动文件变化，自动切换到第一个可用的标签
watch(
    activeFiles,
    (newFiles) => {
        if (
            newFiles.length > 0 &&
            !newFiles.find((f) => f.name === activeTab.value)
        ) {
            activeTab.value = newFiles[0].name;
        }
    },
    { immediate: true },
);
</script>

<style scoped>
/* ESLint 配置样式 */
.eslint-config-container {
    background: #f8fafc;
    border-radius: 12px;
    padding: 24px;
    border: 1px solid #e2e8f0;
}

.eslint-toggle {
    margin-bottom: 24px;
}

.toggle-label {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
}

.toggle-input {
    display: none;
}

.toggle-slider {
    position: relative;
    width: 50px;
    height: 24px;
    background: #cbd5e1;
    border-radius: 24px;
    transition: all 0.3s ease;
}

.toggle-slider::before {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-input:checked + .toggle-slider {
    background: #3b82f6;
}

.toggle-input:checked + .toggle-slider::before {
    transform: translateX(26px);
}

.eslint-details {
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 高级配置样式 */
.advanced-config {
    background: #f8fafc;
    border-radius: 12px;
    padding: 24px;
    border: 1px solid #e2e8f0;
}

.config-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    margin-bottom: 24px;
}

.config-group {
    background: white;
    border-radius: 8px;
    padding: 20px;
    border: 1px solid #e2e8f0;
}

.group-title {
    margin: 0 0 16px 0;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* 复选框样式 */
.checkbox-grid {
    display: grid;
    gap: 12px;
}

.checkbox-item {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    transition: background-color 0.2s;
}

.checkbox-item:hover {
    background: #f1f5f9;
}

.checkbox-item input[type="checkbox"] {
    display: none;
}

.checkmark {
    position: relative;
    width: 18px;
    height: 18px;
    border: 2px solid #cbd5e1;
    border-radius: 4px;
    transition: all 0.2s;
}

.checkbox-item input[type="checkbox"]:checked + .checkmark {
    background: #3b82f6;
    border-color: #3b82f6;
}

.checkbox-item input[type="checkbox"]:checked + .checkmark::after {
    content: "";
    position: absolute;
    top: 1px;
    left: 5px;
    width: 6px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

/* 单选按钮样式 */
.radio-group {
    display: flex;
    gap: 16px;
}

.radio-item {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    padding: 12px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    transition: all 0.2s;
    flex: 1;
}

.radio-item:hover {
    border-color: #cbd5e1;
    background: #f8fafc;
}

.radio-item input[type="radio"] {
    display: none;
}

.radio-mark {
    position: relative;
    width: 18px;
    height: 18px;
    border: 2px solid #cbd5e1;
    border-radius: 50%;
    transition: all 0.2s;
}

.radio-item input[type="radio"]:checked + .radio-mark {
    border-color: #3b82f6;
}

.radio-item input[type="radio"]:checked + .radio-mark::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 8px;
    height: 8px;
    background: #3b82f6;
    border-radius: 50%;
}

.radio-item input[type="radio"]:checked ~ .radio-text {
    color: #3b82f6;
}

.radio-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.radio-text strong {
    font-weight: 600;
    font-size: 14px;
}

.radio-text small {
    font-size: 12px;
    color: #6b7280;
}

/* 文件选择样式 */
.file-selection {
    display: grid;
    gap: 12px;
}

/* 预览标签样式 */
.preview-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    border-bottom: 1px solid #e5e7eb;
}

.tab-btn {
    padding: 8px 16px;
    border: none;
    background: none;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    font-size: 14px;
    color: #6b7280;
    transition: all 0.2s;
}

.tab-btn:hover {
    color: #374151;
}

.tab-btn.active {
    color: #3b82f6;
    border-bottom-color: #3b82f6;
}

.action-section {
    text-align: center;
    margin-top: 32px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .config-row {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .radio-group {
        flex-direction: column;
    }
}
</style>
