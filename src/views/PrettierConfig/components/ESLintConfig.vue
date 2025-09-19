<template>
    <div class="eslint-config">
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
        <!-- 常用规则 -->
        <div class="tool-section">
            <h3 class="section-title">ESLint 规则配置</h3>
            <div class="rules-grid">
                <div
                    v-for="rule in commonRules"
                    :key="rule.name"
                    class="rule-item"
                >
                    <div class="rule-header">
                        <label class="rule-name">{{ rule.name }}</label>
                        <select
                            v-model="config.rules[rule.name]"
                            class="rule-select"
                        >
                            <option
                                v-for="option in getRuleOptions(rule.name)"
                                :key="option.value"
                                :value="option.value"
                            >
                                {{ option.label }}
                            </option>
                        </select>
                    </div>
                    <p class="rule-description">{{ rule.description }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, defineEmits } from "vue";

const emit = defineEmits(["config-change"]);

// 默认配置 - 只保留规则
const config = ref({
    rules: {
        "no-console": "warn",
        "no-debugger": "error",
        "no-unused-vars": "warn",
        "no-undef": "error",
        semi: "always",
        quotes: "single",
        indent: 2,
        "comma-dangle": "never",
        "no-trailing-spaces": "error",
        "eol-last": "error",
    },
});

// 常用规则
const commonRules = [
    {
        name: "no-console",
        description: "禁止使用console",
    },
    {
        name: "no-debugger",
        description: "禁止使用debugger",
    },
    {
        name: "no-unused-vars",
        description: "禁止未使用的变量",
    },
    {
        name: "semi",
        description: "强制使用分号",
    },
    {
        name: "quotes",
        description: "强制使用一致的引号",
    },
    {
        name: "indent",
        description: "强制使用一致的缩进",
    },
    {
        name: "comma-dangle",
        description: "要求或禁止末尾逗号",
    },
    {
        name: "no-trailing-spaces",
        description: "禁止行尾空格",
    },
    {
        name: "eol-last",
        description: "要求或禁止文件末尾存在空行",
    },
];

// 预设配置
const presets = [
    {
        name: "基础配置",
        config: {
            rules: {
                "no-console": "warn",
                "no-debugger": "error",
                "no-unused-vars": "warn",
                semi: "always",
                quotes: "single",
            },
        },
    },
    {
        name: "严格模式",
        config: {
            rules: {
                "no-console": "error",
                "no-debugger": "error",
                "no-unused-vars": "error",
                "no-undef": "error",
                semi: "always",
                quotes: "single",
                indent: 2,
                "comma-dangle": "never",
                "no-trailing-spaces": "error",
                "eol-last": "error",
            },
        },
    },
    {
        name: "宽松模式",
        config: {
            rules: {
                "no-console": "off",
                "no-debugger": "warn",
                "no-unused-vars": "warn",
                semi: "off",
                quotes: "off",
                indent: "off",
                "comma-dangle": "off",
                "no-trailing-spaces": "warn",
                "eol-last": "off",
            },
        },
    },
];

// 获取规则选项
const getRuleOptions = (ruleName) => {
    const ruleOptions = {
        "no-console": [
            { value: "off", label: "关闭" },
            { value: "warn", label: "警告" },
            { value: "error", label: "错误" },
        ],
        "no-debugger": [
            { value: "off", label: "关闭" },
            { value: "warn", label: "警告" },
            { value: "error", label: "错误" },
        ],
        "no-unused-vars": [
            { value: "off", label: "关闭" },
            { value: "warn", label: "警告" },
            { value: "error", label: "错误" },
        ],
        "no-undef": [
            { value: "off", label: "关闭" },
            { value: "warn", label: "警告" },
            { value: "error", label: "错误" },
        ],
        semi: [
            { value: "off", label: "关闭" },
            { value: "always", label: "总是添加" },
            { value: "never", label: "从不添加" },
        ],
        quotes: [
            { value: "off", label: "关闭" },
            { value: "single", label: "单引号" },
            { value: "double", label: "双引号" },
        ],
        indent: [
            { value: "off", label: "关闭" },
            { value: 2, label: "2个空格" },
            { value: 4, label: "4个空格" },
            { value: "tab", label: "制表符" },
        ],
        "comma-dangle": [
            { value: "off", label: "关闭" },
            { value: "never", label: "从不添加" },
            { value: "always", label: "总是添加" },
            { value: "always-multiline", label: "多行时添加" },
        ],
        "no-trailing-spaces": [
            { value: "off", label: "关闭" },
            { value: "warn", label: "警告" },
            { value: "error", label: "错误" },
        ],
        "eol-last": [
            { value: "off", label: "关闭" },
            { value: "warn", label: "警告" },
            { value: "error", label: "错误" },
        ],
    };
    return (
        ruleOptions[ruleName] || [
            { value: "off", label: "关闭" },
            { value: "warn", label: "警告" },
            { value: "error", label: "错误" },
        ]
    );
};

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

// 暴露方法给父组件
defineExpose({
    generateConfig,
});
</script>

<style scoped>
.checkbox-group {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--space-sm);
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    cursor: pointer;
    font-size: var(--font-size-sm);
}

.checkbox-input {
    margin: 0;
}

.checkbox-text {
    user-select: none;
}

.rules-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-md);
}

.rule-item {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: var(--space-md);
}

.rule-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-xs);
}

.rule-name {
    font-weight: var(--font-weight-semibold);
    color: var(--accent);
    font-family: monospace;
    font-size: var(--font-size-sm);
}

.rule-select {
    padding: var(--space-xs) var(--space-sm);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--bg);
    color: var(--text);
    font-size: var(--font-size-xs);
}

.rule-description {
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.4;
}

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

/* 响应式设计 */
@media (max-width: 768px) {
    .checkbox-group {
        grid-template-columns: 1fr;
    }

    .rules-grid {
        grid-template-columns: 1fr;
    }

    .rule-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-xs);
    }
}
</style>
