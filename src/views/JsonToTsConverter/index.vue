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
                    <textarea
                        v-model="jsonInput"
                        placeholder='示例: {"name": "John", "age": 30, "isActive": true}'
                        @input="handleInput"
                    ></textarea>
                    <div class="actions">
                        <button class="btn clear-btn" @click="clearInput">
                            清空
                        </button>
                        <button class="btn sample-btn" @click="loadSample">
                            加载示例
                        </button>
                        <button
                            class="btn preview-btn"
                            @click="toggleJsonPreview"
                        >
                            {{ showJsonPreview ? "隐藏预览" : "JSON预览" }}
                        </button>
                    </div>
                </div>

                <!-- JSON 高亮预览 -->
                <div
                    v-if="showJsonPreview && formattedJson"
                    class="json-preview"
                >
                    <label class="section-label">JSON 格式化预览</label>
                    <div class="highlight-container">
                        <ShikiCodeHighlighterHighlighter
                            :code="formattedJson"
                            language="json"
                            :theme="codeTheme"
                        />
                    </div>
                </div>

                <div v-if="errorMessage" class="error-message">
                    <i class="icon error-icon">!</i>
                    {{ errorMessage }}
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

                    <!-- 主题选择 -->
                    <div class="option-item">
                        <label class="option-label">代码主题</label>
                        <select v-model="codeTheme" class="theme-select">
                            <option value="github-dark">GitHub Dark</option>
                            <option value="github-light">GitHub Light</option>
                            <option value="dracula">Dracula</option>
                            <option value="monokai">Monokai</option>
                            <option value="nord">Nord</option>
                            <option value="one-dark-pro">One Dark Pro</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="output-section">
                <label class="section-label">TypeScript 接口</label>
                <div class="output-container">
                    <div v-if="tsOutput" class="ts-highlight-container">
                        <ShikiCodeHighlighterHighlighter
                            :code="tsOutput"
                            language="typescript"
                            :theme="codeTheme"
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
                        :disabled="!tsOutput"
                    >
                        <i class="icon copy-icon">📋</i>
                        复制到剪贴板
                    </button>
                    <button
                        class="btn download-btn"
                        @click="downloadAsFile"
                        :disabled="!tsOutput"
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
import { ref, watch, computed } from "vue";
import useToast from "@/utils/useToast.js";
import ShikiCodeHighlighterHighlighter from "@/components/ShikiCodeHighlighter.vue";

const jsonInput = ref("");
const tsOutput = ref("");
const errorMessage = ref("");
const showJsonPreview = ref(false);
const codeTheme = ref("github-dark");

const interfaceName = ref("RootObject");
const options = ref({
    interfaceName: true,
    optionalProperties: false,
    nullableProperties: false,
    addReadonly: false,
    preserveComments: false,
});

// 格式化的 JSON 用于高亮显示
const formattedJson = computed(() => {
    if (!jsonInput.value.trim()) return "";

    try {
        const parsed = JSON.parse(jsonInput.value);
        return JSON.stringify(parsed, null, 2);
    } catch {
        return "";
    }
});

// 处理输入变化
const handleInput = () => {
    try {
        // 清除错误消息
        errorMessage.value = "";

        // 如果输入为空，清空输出
        if (!jsonInput.value.trim()) {
            tsOutput.value = "";
            return;
        }

        // 尝试解析JSON
        const jsonObject = JSON.parse(jsonInput.value);

        // 转换为TypeScript接口
        tsOutput.value = convertJsonToTypeScript(jsonObject);
    } catch (err) {
        // 捕获JSON解析错误
        errorMessage.value = `JSON解析错误: ${err.message}`;
        tsOutput.value = "";
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
    jsonInput.value = "";
    tsOutput.value = "";
    errorMessage.value = "";
    showJsonPreview.value = false;
};

const toggleJsonPreview = () => {
    showJsonPreview.value = !showJsonPreview.value;
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

    jsonInput.value = JSON.stringify(sampleJson, null, 2);
    handleInput();
};
const copyToClipboard = async () => {
    if (!tsOutput.value) return;

    try {
        await navigator.clipboard.writeText(tsOutput.value);
        useToast.showSuccess("复制成功");
    } catch (err) {
        useToast.showError(`复制失败:,${err} `);
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

watch(options, handleInput, { deep: true });
watch(interfaceName, handleInput);
</script>

<style scoped>
.json-to-ts-converter {
    width: 100%;
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

textarea {
    width: 100%;
    min-height: 200px;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-family: "Consolas", "Monaco", monospace;
    font-size: 0.9rem;
    resize: vertical;
    transition: border-color 0.2s;
}

textarea:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
}

.json-preview {
    margin-top: 15px;
}

.highlight-container,
.ts-highlight-container {
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
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

.preview-btn {
    background-color: #9b59b6;
    color: white;
}

.preview-btn:hover {
    background-color: #8e44ad;
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

.interface-name-input,
.theme-select {
    margin-left: 10px;
    padding: 6px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;
    width: 200px;
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

.error-message {
    margin-top: 10px;
    padding: 10px 15px;
    background-color: #fee2e2;
    border-left: 4px solid #ef4444;
    border-radius: 4px;
    color: #dc2626;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 8px;
}

.error-icon {
    background-color: #ef4444;
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
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
