<template>
    <div class="json-to-ts-converter">
        <header class="app-header">
            <h1>JSON 转 TypeScript 接口工具</h1>
            <p>将JSON数据自动转换为TypeScript接口定义</p>
        </header>

        <main class="main-content">
            <div class="input-section">
                <label class="section-label">输入JSON</label>
                <div class="input-container">
                    <JsonEditor
                        v-model:json="jsonData"
                        @update:json="handleJsonChange"
                    ></JsonEditor>

                    <div class="actions">
                        <button class="btn clear-btn" @click="clearInput">
                            清空
                        </button>
                        <button class="btn sample-btn" @click="loadSample">
                            加载示例
                        </button>
                    </div>
                </div>
            </div>

            <div class="options-section">
                <label class="section-label">转换选项</label>
                <div class="options-container">
                    <div class="option-item">
                        <label class="option-label">
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
                            class="interface-name-input"
                        />
                    </div>

                    <div class="option-item">
                        <label class="option-label">
                            <input
                                type="checkbox"
                                v-model="options.optionalProperties"
                            />
                            所有属性设为可选 (添加 ?)
                        </label>
                    </div>

                    <div class="option-item">
                        <label class="option-label">
                            <input
                                type="checkbox"
                                v-model="options.nullableProperties"
                            />
                            允许属性为null (添加 | null)
                        </label>
                    </div>

                    <div class="option-item">
                        <label class="option-label">
                            <input
                                type="checkbox"
                                v-model="options.addReadonly"
                            />
                            添加 readonly 修饰符
                        </label>
                    </div>

                    <div class="option-item">
                        <label class="option-label">
                            <input
                                type="checkbox"
                                v-model="options.preserveComments"
                            />
                            保留注释 (如果有)
                        </label>
                    </div>
                </div>
            </div>

            <div class="output-section">
                <label class="section-label">TypeScript 接口</label>
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
                        class="btn copy-btn"
                        @click="copyToClipboard"
                        :disabled="tsOutput === ''"
                    >
                        <i class="icon copy-icon">📋</i>
                        复制到剪贴板
                    </button>
                    <button
                        class="btn download-btn"
                        @click="downloadAsFile"
                        :disabled="tsOutput === ''"
                    >
                        <i class="icon download-icon">💾</i>
                        下载文件
                    </button>
                </div>
            </div>
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

const copyToClipboard = async () => {
    if (!tsOutput.value) return;

    try {
        await navigator.clipboard.writeText(tsOutput.value);
        useToast.showSuccess("复制成功");
    } catch (err) {
        useToast.showError(`复制失败: ${err} `);
        const textArea = document.createElement("textarea");
        textArea.value = tsOutput.value;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
    }
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

watch(options, handleJsonChange, { deep: true });
watch(interfaceName, handleJsonChange);
</script>

<style scoped>
.json-to-ts-converter {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
}

.app-header {
    text-align: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
}

.app-header h1 {
    color: #2c3e50;
    margin-bottom: 10px;
    font-size: 2rem;
}

.app-header p {
    color: #7f8c8d;
    font-size: 1.1rem;
}

.main-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 25px;
}

@media (min-width: 768px) {
    .main-content {
        grid-template-columns: 1fr 1fr;
    }

    .options-section {
        grid-column: 1 / 2;
    }

    .output-section {
        grid-column: 2 / 3;
        grid-row: 1 / 3;
    }
}

.section-label {
    display: block;
    font-weight: 600;
    margin-bottom: 10px;
    color: #2c3e50;
    font-size: 1.1rem;
}

.input-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

.clear-btn {
    background-color: #f1f5f9;
    color: #333;
}

.clear-btn:hover {
    background-color: #e2e8f0;
}

.sample-btn {
    background-color: #3498db;
    color: white;
}

.sample-btn:hover {
    background-color: #2980b9;
}

.copy-btn {
    background-color: #2ecc71;
    color: white;
}

.copy-btn:hover:not(:disabled) {
    background-color: #27ae60;
}

.download-btn {
    background-color: #e67e22;
    color: white;
}

.download-btn:hover:not(:disabled) {
    background-color: #d35400;
}

.copy-btn:disabled,
.download-btn:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
    opacity: 0.7;
}

.icon {
    font-style: normal;
}

.options-section {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.options-container {
    background-color: #f8fafc;
    border-radius: 6px;
    padding: 20px;
    border: 1px solid #e2e8f0;
}

.option-item {
    margin-bottom: 15px;
}

.option-item:last-child {
    margin-bottom: 0;
}

.option-label {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    font-size: 0.95rem;
    margin-bottom: 5px;
}

.interface-name-input:disabled {
    background-color: #f1f5f9;
    cursor: not-allowed;
    opacity: 0.7;
}

/* 输出区域 */
.output-container {
    position: relative;
    min-height: 300px;
    border-radius: 6px;
    overflow: hidden;
}

.ts-highlight-container {
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
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
    color: #95a5a6;
    font-style: italic;
    padding: 20px;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 6px;
}

.output-actions {
    margin-top: 15px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

@media (max-width: 768px) {
    .output-actions {
        flex-direction: column;
    }

    .btn {
        width: 100%;
    }

    .actions {
        flex-direction: column;
    }
}
</style>
