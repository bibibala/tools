<template>
    <div class="tool-page">
        <header class="tool-header">
            <h1>JSON 转 TypeScript 接口工具</h1>
            <p>将JSON数据自动转换为TypeScript接口定义</p>
        </header>

        <main class="main-content">
            <section class="tool-section">
                <h2 class="section-title">输入JSON</h2>
                <div class="input-container">
                    <JsonEditor
                        v-model:json="jsonData"
                        @update:json="handleJsonChange"
                    ></JsonEditor>

                    <div class="actions">
                        <button class="btn btn-secondary" @click="clearInput">
                            清空
                        </button>
                        <button class="btn btn-primary" @click="loadSample">
                            加载示例
                        </button>
                    </div>
                </div>
            </section>

            <section class="tool-section">
                <h2 class="section-title">转换选项</h2>
                <div class="options-container">
                    <div class="option-item">
                        <label class="section-label">
                            <input
                                type="checkbox"
                                v-model="options.interfaceName"
                            />
                            生成接口名称
                        </label>
                        <input
                            type="text"
                            v-model="interfaceName"
                            :disabled="!options.interfaceName"
                            placeholder="接口名称"
                            class="form-input"
                        />
                    </div>

                    <div class="option-item">
                        <label class="section-label">
                            <input
                                type="checkbox"
                                v-model="options.optionalProperties"
                            />
                            所有属性设为可选 (添加 ?)
                        </label>
                    </div>

                    <div class="option-item">
                        <label class="section-label">
                            <input
                                type="checkbox"
                                v-model="options.nullableProperties"
                            />
                            允许属性为null (添加 | null)
                        </label>
                    </div>

                    <div class="option-item">
                        <label class="section-label">
                            <input
                                type="checkbox"
                                v-model="options.addReadonly"
                            />
                            添加 readonly 修饰符
                        </label>
                    </div>

                    <div class="option-item">
                        <label class="section-label">
                            <input
                                type="checkbox"
                                v-model="options.preserveComments"
                            />
                            保留注释 (如果有)
                        </label>
                    </div>
                </div>
            </section>

            <section class="tool-section">
                <h2 class="section-title">TypeScript 接口</h2>
                <div class="output-container">
                    <div v-if="tsOutput !== ''" class="ts-highlight-container">
                        <CodeHighlighter
                            :code="tsOutput"
                            language="typescript"
                        />
                    </div>
                    <div v-else class="output-placeholder">
                        转换后的TypeScript接口将显示在这里...
                    </div>
                </div>
                <div class="output-actions">
                    <button
                        class="btn btn-primary"
                        @click="downloadAsFile"
                        :disabled="tsOutput === ''"
                    >
                        <i class="icon download-icon">💾</i>
                        下载文件
                    </button>
                </div>
            </section>
        </main>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";
import useToast from "@/utils/useToast.js";
import JsonEditor from "@/components/JsonEditor.vue";
import CodeHighlighter from "@/components/CodeHighlighter.vue";

const jsonData = ref({});
const tsOutput = ref("");

const interfaceName = ref("RootObject");
const options = ref({
    interfaceName: true,
    optionalProperties: false,
    nullableProperties: false,
    addReadonly: false,
    preserveComments: false,
});

// 处理JSON编辑器内容变化
const handleJsonChange = (value) => {
    try {
        const jsonObject =
            typeof value === "object" ? value : JSON.parse(value);
        tsOutput.value = convertJsonToTypeScript(jsonObject);
    } catch (err) {
        useToast.showError(`JSON 格式错误,${err}`);
    }
};

// 新增：处理选项或接口名称变化时重新生成TypeScript
const regenerateTypeScript = () => {
    if (jsonData.value && Object.keys(jsonData.value).length > 0) {
        tsOutput.value = convertJsonToTypeScript(jsonData.value);
    }
};

// 转换JSON为TypeScript接口
const convertJsonToTypeScript = (
    json,
    currentInterfaceName = null,
    isRoot = true,
) => {
    const intfName =
        currentInterfaceName ||
        (options.value.interfaceName && isRoot ? interfaceName.value : "");
    if (typeof json !== "object" || json === null) {
        return getTypeFromValue(json);
    }
    if (Array.isArray(json)) {
        if (json.length === 0) {
            return "any[]";
        }
        const elementTypes = json.map((item) =>
            convertJsonToTypeScript(item, null, false),
        );
        const uniqueTypes = [...new Set(elementTypes)];
        const elementType =
            uniqueTypes.length > 1 ? uniqueTypes.join(" | ") : uniqueTypes[0];
        return `${elementType}[]`;
    }
    const properties = Object.entries(json)
        .map(([key, value]) => {
            const type = convertJsonToTypeScript(value, capitalize(key), false);
            const optional = options.value.optionalProperties ? "?" : "";
            const nullable = options.value.nullableProperties ? " | null" : "";
            const readonly = options.value.addReadonly ? "readonly " : "";

            return `  ${readonly}${key}${optional}: ${type}${nullable};`;
        })
        .join("\n");
    if (isRoot && options.value.interfaceName && intfName) {
        return `interface ${intfName} {\n${properties}\n}`;
    }
    return `{\n${properties}\n}`;
};

const getTypeFromValue = (value) => {
    if (value === null) return "null";

    switch (typeof value) {
        case "string":
            return "string";
        case "number":
            return "number";
        case "boolean":
            return "boolean";
        case "function":
            return "Function";
        case "object":
            return "object";
        default:
            return "any";
    }
};

const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const clearInput = () => {
    jsonData.value = null;
    tsOutput.value = "";
};

// 加载示例JSON
const loadSample = () => {
    const sampleJson = {
        name: "John Doe",
        age: 30,
        isActive: true,
        address: {
            street: "123 Main St",
            city: "Anytown",
            zipCode: "12345",
        },
        hobbies: ["reading", "hiking", "coding"],
        contactInfo: {
            email: "john@example.com",
            phone: null,
        },
        lastLogin: "2023-07-15T14:30:00Z",
    };

    jsonData.value = sampleJson;
    handleJsonChange(sampleJson);
};

const downloadAsFile = () => {
    if (!tsOutput.value) return;

    const filename = `${interfaceName.value || "interfaces"}.ts`;
    const blob = new Blob([tsOutput.value], { type: "text/typescript" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

watch(options, regenerateTypeScript, { deep: true });
watch(interfaceName, regenerateTypeScript);
</script>

<style scoped>
/* 使用统一的设计系统，保留必要的自定义样式 */
.main-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-2xl);
}

@media (min-width: 768px) {
    .main-content {
        grid-template-columns: 1fr 1fr;
    }

    .tool-section:nth-child(2) {
        grid-column: 1 / 2;
    }

    .tool-section:nth-child(3) {
        grid-column: 2 / 3;
        grid-row: 1 / 3;
    }
}

.input-container {
    display: flex;
    flex-direction: column;
    gap: var(--space);
}

.actions {
    display: flex;
    gap: var(--space);
    flex-wrap: wrap;
}

.options-container {
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    padding: var(--space-xl);
    border: 1px solid var(--border);
}

.option-item {
    margin-bottom: var(--space-lg);
}

.option-item:last-child {
    margin-bottom: 0;
}

.section-label {
    display: flex;
    align-items: center;
    gap: var(--space);
    cursor: pointer;
    font-size: var(--font-size-sm);
    margin-bottom: var(--space-xs);
}

.output-container {
    position: relative;
    min-height: 300px;
    border-radius: var(--radius-md);
    overflow: hidden;
}

.ts-highlight-container {
    border-radius: var(--radius-md);
    overflow: hidden;
    border: 1px solid var(--border);
}

.output-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    font-style: italic;
    padding: var(--space-xl);
    text-align: center;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
}

.output-actions {
    margin-top: var(--space-lg);
    display: flex;
    gap: var(--space);
    flex-wrap: wrap;
}

@media (max-width: 768px) {
    .output-actions {
        flex-direction: column;
    }

    .actions {
        flex-direction: column;
    }
}
</style>
