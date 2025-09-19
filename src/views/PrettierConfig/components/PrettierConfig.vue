<template>
    <div class="prettier-config">
        <!-- 预设配置 -->
        <div class="tool-section">
            <h3 class="section-title">预设配置</h3>
            <div class="preset-buttons">
                <button
                    v-for="preset in presets"
                    :key="preset.name"
                    @click="applyPreset(preset)"
                    class="btn btn-secondary preset-btn"
                >
                    {{ preset.name }}
                </button>
            </div>
            <p class="form-hint">点击应用常用配置预设</p>
        </div>
        <div class="config-grid">
            <!-- 基础配置 -->
            <div class="config-item">
                <label class="section-label" for="print-width">行宽</label>
                <input
                    id="print-width"
                    v-model.number="config.printWidth"
                    type="number"
                    min="1"
                    max="200"
                    class="form-input"
                />
                <p class="form-hint">每行最大字符数</p>
            </div>

            <div class="config-item">
                <label class="section-label" for="tab-width">缩进宽度</label>
                <input
                    id="tab-width"
                    v-model.number="config.tabWidth"
                    type="number"
                    min="1"
                    max="8"
                    class="form-input"
                />
                <p class="form-hint">缩进空格数</p>
            </div>

            <div class="config-item">
                <label class="section-label" for="use-tabs">使用制表符</label>
                <select
                    id="use-tabs"
                    v-model="config.useTabs"
                    class="form-input form-select"
                >
                    <option :value="false">空格</option>
                    <option :value="true">制表符</option>
                </select>
                <p class="form-hint">使用制表符还是空格缩进</p>
            </div>

            <div class="config-item">
                <label class="section-label" for="semi">分号</label>
                <select
                    id="semi"
                    v-model="config.semi"
                    class="form-input form-select"
                >
                    <option :value="true">添加分号</option>
                    <option :value="false">不添加分号</option>
                </select>
                <p class="form-hint">是否在语句末尾添加分号</p>
            </div>

            <div class="config-item">
                <label class="section-label" for="single-quote">引号</label>
                <select
                    id="single-quote"
                    v-model="config.singleQuote"
                    class="form-input form-select"
                >
                    <option :value="false">双引号</option>
                    <option :value="true">单引号</option>
                </select>
                <p class="form-hint">使用单引号还是双引号</p>
            </div>

            <div class="config-item">
                <label class="section-label" for="trailing-comma"
                    >尾随逗号</label
                >
                <select
                    id="trailing-comma"
                    v-model="config.trailingComma"
                    class="form-input form-select"
                >
                    <option value="none">无</option>
                    <option value="es5">ES5</option>
                    <option value="all">全部</option>
                </select>
                <p class="form-hint">是否在对象和数组末尾添加逗号</p>
            </div>

            <div class="config-item">
                <label class="section-label" for="end-of-line">行尾序列</label>
                <select
                    id="end-of-line"
                    v-model="config.endOfLine"
                    class="form-input form-select"
                >
                    <option value="lf">LF (Unix)</option>
                    <option value="crlf">CRLF (Windows)</option>
                    <option value="auto">自动检测</option>
                </select>
                <p class="form-hint">行尾序列类型</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, defineEmits } from "vue";

const emit = defineEmits(["config-change"]);

// 默认配置
const config = ref({
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: false,
    trailingComma: "es5",
    endOfLine: "lf",
});

// 预设配置
const presets = [
    {
        name: "标准配置",
        config: {
            printWidth: 80,
            tabWidth: 2,
            useTabs: false,
            semi: true,
            singleQuote: false,
            trailingComma: "es5",
            endOfLine: "lf",
        },
    },
    {
        name: "Vue/React",
        config: {
            printWidth: 100,
            tabWidth: 2,
            useTabs: false,
            semi: false,
            singleQuote: true,
            trailingComma: "all",
            endOfLine: "lf",
        },
    },
    {
        name: "Node.js",
        config: {
            printWidth: 100,
            tabWidth: 2,
            useTabs: false,
            semi: true,
            singleQuote: true,
            trailingComma: "all",
            endOfLine: "lf",
        },
    },
];

// 应用预设配置
const applyPreset = (preset) => {
    config.value = { ...config.value, ...preset.config };
};

// 监听配置变化
watch(
    config,
    (newConfig) => {
        emit("config-change", newConfig);
    },
    { deep: true },
);

// 生成配置文件内容
const generateConfig = () => {
    return JSON.stringify(config.value, null, 2);
};

// 生成.editorconfig内容
const generateEditorConfig = () => {
    const eol = config.value.endOfLine === "crlf" ? "crlf" : "lf";
    const indent = config.value.useTabs ? "tab" : "space";
    const indentSize = config.value.useTabs
        ? ""
        : config.value.tabWidth.toString();

    return `root = true

[*]
charset = utf-8
end_of_line = ${eol}
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = ${indent}${indentSize ? "\nindent_size = " + indentSize : ""}

[*.{js,jsx,ts,tsx}]
indent_size = ${config.value.tabWidth}

[*.{json,yml,yaml}]
indent_size = 2

[*.md]
trim_trailing_whitespace = false`;
};

// 生成.gitattributes内容
const generateGitAttributes = () => {
    if (config.value.endOfLine === "lf") {
        return `# 设置默认行为，以防人们没有设置 core.autocrlf
* text=auto

# 明确声明文本文件你想要的行尾结束符
# （通常是 LF，即使在 Windows 上）
*.js text eol=lf
*.jsx text eol=lf
*.ts text eol=lf
*.tsx text eol=lf
*.json text eol=lf
*.css text eol=lf
*.scss text eol=lf
*.html text eol=lf
*.md text eol=lf
*.yml text eol=lf
*.yaml text eol=lf

# 声明二进制文件（所有其他文件）
# - 二进制文件通常不需要行尾转换
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.svg binary
*.woff binary
*.woff2 binary
*.ttf binary
*.eot binary`;
    }
    return "";
};

// 暴露方法给父组件
defineExpose({
    generateConfig,
    generateEditorConfig,
    generateGitAttributes,
});
</script>

<style scoped>
.preset-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: var(--space-sm);
    margin-bottom: var(--space-sm);
}

.preset-btn {
    font-size: var(--font-size-sm);
    padding: var(--space-sm) var(--space-md);
    text-align: center;
}

.preset-btn:hover {
    background-color: var(--accent);
    color: white;
    border-color: var(--accent);
}
</style>
