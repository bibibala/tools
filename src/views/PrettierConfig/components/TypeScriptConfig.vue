<template>
    <div class="typescript-config">
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
        <!-- 编译选项规则 -->
        <div class="tool-section">
            <h3 class="section-title">TypeScript 编译选项</h3>
            <div class="rules-grid">
                <div
                    v-for="option in compilerOptions"
                    :key="option.name"
                    class="rule-item"
                >
                    <div class="rule-header">
                        <label class="rule-name">{{ option.name }}</label>
                        <select
                            v-model="config.compilerOptions[option.name]"
                            class="rule-select"
                        >
                            <option
                                v-for="opt in option.options"
                                :key="opt.value"
                                :value="opt.value"
                            >
                                {{ opt.label }}
                            </option>
                        </select>
                    </div>
                    <p class="rule-description">{{ option.description }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";

const emit = defineEmits(["config-change"]);

// 默认配置 - 只保留编译选项
const config = ref({
    compilerOptions: {
        target: "ES2020",
        module: "ESNext",
        moduleResolution: "node",
        strict: true,
        noImplicitAny: true,
        strictNullChecks: true,
        sourceMap: true,
    },
});

// 编译选项配置
const compilerOptions = [
    {
        name: "target",
        description: "指定ECMAScript目标版本",
        options: [
            { value: "ES5", label: "ES5" },
            { value: "ES2015", label: "ES2015 (ES6)" },
            { value: "ES2017", label: "ES2017 (ES8)" },
            { value: "ES2018", label: "ES2018 (ES9)" },
            { value: "ES2019", label: "ES2019 (ES10)" },
            { value: "ES2020", label: "ES2020 (ES11)" },
            { value: "ES2021", label: "ES2021 (ES12)" },
            { value: "ES2022", label: "ES2022 (ES13)" },
            { value: "ESNext", label: "ESNext" },
        ],
    },
    {
        name: "module",
        description: "指定模块代码生成",
        options: [
            { value: "CommonJS", label: "CommonJS" },
            { value: "ES6", label: "ES6" },
            { value: "ES2015", label: "ES2015" },
            { value: "ES2020", label: "ES2020" },
            { value: "ES2022", label: "ES2022" },
            { value: "ESNext", label: "ESNext" },
            { value: "Node16", label: "Node16" },
            { value: "NodeNext", label: "NodeNext" },
        ],
    },
    {
        name: "moduleResolution",
        description: "决定如何处理模块",
        options: [
            { value: "classic", label: "Classic" },
            { value: "node", label: "Node" },
            { value: "node16", label: "Node16" },
            { value: "bundler", label: "Bundler" },
        ],
    },
    {
        name: "strict",
        description: "启用所有严格类型检查选项",
        options: [
            { value: true, label: "启用" },
            { value: false, label: "禁用" },
        ],
    },
    {
        name: "noImplicitAny",
        description: "在表达式和声明上有隐含的any类型时报错",
        options: [
            { value: true, label: "禁止" },
            { value: false, label: "允许" },
        ],
    },
    {
        name: "strictNullChecks",
        description:
            "在严格的null检查模式下，null和undefined值不包含在任何类型里",
        options: [
            { value: true, label: "启用" },
            { value: false, label: "禁用" },
        ],
    },
    {
        name: "sourceMap",
        description: "生成相应的.map文件",
        options: [
            { value: true, label: "生成" },
            { value: false, label: "不生成" },
        ],
    },
];

// 预设配置
const presets = [
    {
        name: "基础配置",
        config: {
            compilerOptions: {
                target: "ES2020",
                module: "ESNext",
                moduleResolution: "node",
                strict: true,
                noImplicitAny: true,
                strictNullChecks: true,
                sourceMap: true,
            },
        },
    },
    {
        name: "Node.js",
        config: {
            compilerOptions: {
                target: "ES2020",
                module: "CommonJS",
                moduleResolution: "node",
                strict: true,
                noImplicitAny: true,
                strictNullChecks: true,
                sourceMap: true,
            },
        },
    },
    {
        name: "严格模式",
        config: {
            compilerOptions: {
                target: "ES2022",
                module: "ESNext",
                moduleResolution: "node",
                strict: true,
                noImplicitAny: true,
                strictNullChecks: true,
                sourceMap: true,
            },
        },
    },
    {
        name: "宽松模式",
        config: {
            compilerOptions: {
                target: "ES2015",
                module: "CommonJS",
                moduleResolution: "node",
                strict: false,
                noImplicitAny: false,
                strictNullChecks: false,
                sourceMap: false,
            },
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

// 暴露方法给父组件
defineExpose({
    generateConfig,
});
</script>

<style scoped>
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
