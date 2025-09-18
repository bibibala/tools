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
                        v-model="indentType"
                        class="form-input form-select"
                        @change="updateIndentConfig"
                    >
                        <option value="spaces-2">空格（2个）</option>
                        <option value="spaces-4">空格（4个）</option>
                        <option value="tabs">Tab</option>
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

                    <!-- 引号规则同步提示 -->
                    <div class="sync-info">
                        <div class="sync-item">
                            <span class="sync-icon">🔗</span>
                            <div class="sync-content">
                                <strong>配置文件自动同步</strong>
                                <p>
                                    ESLint 引号规则将自动与 Prettier
                                    配置保持一致
                                </p>
                                <p v-if="generateFiles.tsconfig">
                                    TSConfig 缩进和项目配置也会同步更新
                                </p>
                                <small>
                                    当前设置：{{
                                        prettierConfig.singleQuote
                                            ? "单引号"
                                            : "双引号"
                                    }}
                                    {{
                                        eslintConfig.extends.typescript
                                            ? "（包含 TypeScript 规则）"
                                            : ""
                                    }}
                                    {{
                                        generateFiles.tsconfig
                                            ? "+ TSConfig 同步"
                                            : ""
                                    }}
                                </small>
                            </div>
                        </div>
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
                            <label class="checkbox-item">
                                <input
                                    type="checkbox"
                                    v-model="generateFiles.tsconfig"
                                />
                                <span class="checkmark"></span>
                                TSConfig
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
            tabWidth: 4,
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

// 缩进类型管理
const indentType = ref("spaces-2");

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

// 更新缩进配置
const updateIndentConfig = () => {
    switch (indentType.value) {
        case "spaces-2":
            prettierConfig.value.useTabs = false;
            prettierConfig.value.tabWidth = 2;
            break;
        case "spaces-4":
            prettierConfig.value.useTabs = false;
            prettierConfig.value.tabWidth = 4;
            break;
        case "tabs":
            prettierConfig.value.useTabs = true;
            prettierConfig.value.tabWidth = 2; // Tab的默认宽度
            break;
    }
};

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
    rules: {
        quotes: "off", // 将根据Prettier配置自动设置
        "@typescript-eslint/quotes": "off", // TypeScript引号规则
    },
});

const generateFiles = ref({
    prettier: true,
    eslint: true,
    editorconfig: true,
    gitattributes: true,
    tsconfig: false, // 默认不启用，因为不是所有项目都需要TypeScript
});

const exportFormat = ref("js");
const activeTab = ref("prettier");

// 应用预设配置
const applyPreset = () => {
    if (selectedPreset.value !== "custom" && presets[selectedPreset.value]) {
        const preset = presets[selectedPreset.value];
        Object.assign(prettierConfig.value, preset.prettier);
        Object.assign(eslintConfig.value, preset.eslint);

        // 同步缩进类型
        if (preset.prettier.useTabs) {
            indentType.value = "tabs";
        } else if (preset.prettier.tabWidth === 4) {
            indentType.value = "spaces-4";
        } else {
            indentType.value = "spaces-2";
        }

        // 根据预设类型自动启用相关配置文件
        if (selectedPreset.value === "typescript") {
            generateFiles.value.tsconfig = true;
            generateFiles.value.eslint = true; // TypeScript项目通常需要ESLint
        } else if (selectedPreset.value === "vue") {
            generateFiles.value.tsconfig = false; // Vue项目可能不需要TypeScript
        } else if (selectedPreset.value === "react") {
            generateFiles.value.tsconfig = false; // React项目可能使用JavaScript
        }
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

    // 根据Prettier配置同步引号规则
    const quoteStyle = prettierConfig.value.singleQuote ? "single" : "double";

    // 基础JavaScript引号规则
    config.rules.quotes = [
        "error",
        quoteStyle,
        {
            avoidEscape: true,
            allowTemplateLiterals: true,
        },
    ];

    // TypeScript引号规则（如果启用了TypeScript支持）
    if (eslintConfig.value.extends.typescript) {
        config.rules["@typescript-eslint/quotes"] = [
            "error",
            quoteStyle,
            {
                avoidEscape: true,
                allowTemplateLiterals: true,
            },
        ];
        // 禁用基础quotes规则，使用TypeScript版本
        config.rules.quotes = "off";
    }

    // JSX引号规则（如果有React或Vue JSX支持）
    if (
        eslintConfig.value.extends.vue ||
        config.extends.some((ext) => ext.includes("react"))
    ) {
        const jsxQuoteStyle = prettierConfig.value.jsxSingleQuote
            ? "prefer-single"
            : "prefer-double";
        config.rules["jsx-quotes"] = ["error", jsxQuoteStyle];
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

// 生成 TSConfig
const formattedTsConfig = computed(() => {
    const config = {
        $schema: "https://json.schemastore.org/tsconfig",
        compilerOptions: {
            // 基础配置
            target: "ES2020",
            lib: ["ES2020", "DOM", "DOM.Iterable"],
            allowJs: true,
            skipLibCheck: true,
            esModuleInterop: true,
            allowSyntheticDefaultImports: true,
            strict: true,
            forceConsistentCasingInFileNames: true,
            noFallthroughCasesInSwitch: true,

            // 模块解析
            module: "ESNext",
            moduleResolution: "bundler",
            resolveJsonModule: true,
            isolatedModules: true,
            noEmit: true,

            // JSX 配置
            jsx: eslintConfig.value.extends.vue ? "preserve" : "react-jsx",

            // 路径映射
            baseUrl: ".",
            paths: {
                "@/*": ["src/*"],
            },

            // 类型检查配置
            noUnusedLocals: true,
            noUnusedParameters: true,
            exactOptionalPropertyTypes: true,
            noImplicitReturns: true,
            noImplicitOverride: true,
        },
        include: [
            "src/**/*.ts",
            "src/**/*.tsx",
            ...(eslintConfig.value.extends.vue ? ["src/**/*.vue"] : []),
        ],
        exclude: ["node_modules", "dist", "**/*.test.*", "**/*.spec.*"],
    };

    // 根据项目类型调整配置
    if (eslintConfig.value.extends.vue) {
        // Vue 项目特殊配置
        config.compilerOptions.jsx = "preserve";
        config.compilerOptions.types = ["vite/client"];
    }

    // 使用与Prettier一致的缩进格式化JSON
    return JSON.stringify(
        config,
        null,
        prettierConfig.value.useTabs ? "\t" : prettierConfig.value.tabWidth,
    );
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

    if (generateFiles.value.tsconfig) {
        files.push({
            name: "tsconfig",
            displayName: "TSConfig",
            content: formattedTsConfig.value,
            language: "json",
            filename: "tsconfig.json",
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

// 监听Prettier引号配置变化，自动同步JSX引号
watch(
    () => prettierConfig.value.singleQuote,
    (newValue) => {
        // 自动同步JSX引号设置
        prettierConfig.value.jsxSingleQuote = newValue;
    },
);

// 监听TypeScript扩展配置变化，自动启用/禁用TSConfig生成
watch(
    () => eslintConfig.value.extends.typescript,
    (newValue) => {
        if (newValue) {
            // 启用TypeScript时，建议启用TSConfig生成
            generateFiles.value.tsconfig = true;
        }
        // 注意：不自动禁用TSConfig，因为用户可能有其他需求
    },
);

// 初始化缩进类型
const initIndentType = () => {
    if (prettierConfig.value.useTabs) {
        indentType.value = "tabs";
    } else if (prettierConfig.value.tabWidth === 4) {
        indentType.value = "spaces-4";
    } else {
        indentType.value = "spaces-2";
    }
};

// 组件挂载时初始化
initIndentType();
</script>

<style scoped>
/* ESLint 配置样式 */
.eslint-config-container {
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    padding: var(--space-xl);
    border: 1px solid var(--border);
}

.eslint-toggle {
    margin-bottom: var(--space-xl);
}

.toggle-label {
    display: flex;
    align-items: center;
    gap: var(--space);
    cursor: pointer;
    font-size: var(--font-size);
    font-weight: var(--font-weight-medium);
}

.toggle-input {
    display: none;
}

.toggle-slider {
    position: relative;
    width: 50px;
    height: 24px;
    background: var(--border);
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
    background: var(--bg);
    border-radius: 50%;
    transition: all 0.3s ease;
    box-shadow: var(--shadow-sm);
}

.toggle-input:checked + .toggle-slider {
    background: var(--info);
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
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    padding: var(--space-xl);
    border: 1px solid var(--border);
}

.config-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-2xl);
    margin-bottom: var(--space-xl);
}

.config-group {
    background: var(--bg);
    border-radius: var(--radius);
    padding: var(--space-lg);
    border: 1px solid var(--border);
}

.group-title {
    margin: 0 0 var(--space-md) 0;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--accent-light);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* 复选框样式 */
.checkbox-grid {
    display: grid;
    gap: var(--space);
}

.checkbox-item {
    display: flex;
    align-items: center;
    gap: var(--space);
    cursor: pointer;
    padding: var(--space-sm);
    border-radius: var(--radius);
    transition: background-color 0.2s;
}

.checkbox-item:hover {
    background: var(--hover-bg);
}

.checkbox-item input[type="checkbox"] {
    display: none;
}

.checkmark {
    position: relative;
    width: 18px;
    height: 18px;
    border: 2px solid var(--border);
    border-radius: var(--radius-sm);
    transition: all 0.2s;
}

.checkbox-item input[type="checkbox"]:checked + .checkmark {
    background: var(--info);
    border-color: var(--info);
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
    gap: var(--space-md);
}

.radio-item {
    display: flex;
    align-items: center;
    gap: var(--space);
    cursor: pointer;
    padding: var(--space) var(--space-md);
    border: 2px solid var(--border);
    border-radius: var(--radius);
    transition: all 0.2s;
    flex: 1;
}

.radio-item:hover {
    border-color: var(--border);
    background: var(--hover-bg);
}

.radio-item input[type="radio"] {
    display: none;
}

.radio-mark {
    position: relative;
    width: 18px;
    height: 18px;
    border: 2px solid var(--border);
    border-radius: 50%;
    transition: all 0.2s;
}

.radio-item input[type="radio"]:checked + .radio-mark {
    border-color: var(--info);
}

.radio-item input[type="radio"]:checked + .radio-mark::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 8px;
    height: 8px;
    background: var(--info);
    border-radius: 50%;
}

.radio-item input[type="radio"]:checked ~ .radio-text {
    color: var(--info);
}

.radio-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.radio-text strong {
    font-weight: var(--font-weight-semibold);
    font-size: var(--font-size-sm);
}

.radio-text small {
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
}

/* 文件选择样式 */
.file-selection {
    display: grid;
    gap: var(--space);
}

/* 预览标签样式 */
.preview-tabs {
    display: flex;
    gap: var(--space-sm);
    margin-bottom: var(--space-md);
    border-bottom: 1px solid var(--border);
}

.tab-btn {
    padding: var(--space-sm) var(--space-md);
    border: none;
    background: none;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    transition: all 0.2s;
}

.tab-btn:hover {
    color: var(--text);
}

.tab-btn.active {
    color: var(--info);
    border-bottom-color: var(--info);
}

.preview-card {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
}

.action-section {
    text-align: center;
    margin-top: var(--space-2xl);
}

/* 同步信息样式 */
.sync-info {
    margin-top: var(--space-lg);
    padding: var(--space-md);
    background: var(--bg-secondary);
    border: 1px solid var(--border-light);
    border-radius: var(--radius);
}

.sync-item {
    display: flex;
    align-items: flex-start;
    gap: var(--space);
}

.sync-icon {
    font-size: var(--font-size-lg);
    margin-top: 2px;
}

.sync-content {
    flex: 1;
}

.sync-content strong {
    color: var(--accent);
    font-size: var(--font-size-sm);
    display: block;
    margin-bottom: var(--space-xs);
}

.sync-content p {
    margin: 0 0 var(--space-sm) 0;
    color: var(--text);
    font-size: var(--font-size-xs);
    line-height: 1.4;
}

.sync-content small {
    color: var(--text-secondary);
    font-size: var(--font-size-xs);
    font-style: italic;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .config-row {
        grid-template-columns: 1fr;
        gap: var(--space-md);
    }

    .radio-group {
        flex-direction: column;
    }
}
</style>
