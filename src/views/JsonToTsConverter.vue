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
                </div>
            </div>

            <div class="output-section">
                <label class="section-label">TypeScript 接口</label>
                <div class="output-container">
                    <pre v-if="tsOutput" class="ts-output">{{ tsOutput }}</pre>
                    <div v-else class="output-placeholder">
                        转换后的TypeScript接口将显示在这里...
                    </div>
                </div>
                <button
                    class="btn copy-btn"
                    @click="copyToClipboard"
                    :disabled="!tsOutput"
                >
                    <i class="icon copy-icon">📋</i>
                    复制到剪贴板
                </button>
            </div>
        </main>

        <div v-if="showNotification" class="notification">
            {{ notificationMessage }}
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";

// 输入输出数据
const jsonInput = ref("");
const tsOutput = ref("");
const errorMessage = ref("");

// 转换选项
const interfaceName = ref("RootObject");
const options = ref({
    interfaceName: true,
    optionalProperties: false,
    nullableProperties: false,
    addReadonly: false,
    preserveComments: false,
});

// 通知状态
const showNotification = ref(false);
const notificationMessage = ref("");

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
    // 确定当前接口名称
    const intfName =
        currentInterfaceName ||
        (options.value.interfaceName && isRoot ? interfaceName.value : "");

    // 处理不同类型的值
    if (typeof json !== "object" || json === null) {
        return getTypeFromValue(json);
    }

    // 处理数组
    if (Array.isArray(json)) {
        if (json.length === 0) {
            return "any[]";
        }

        // 获取数组元素的类型
        const elementTypes = json.map((item) =>
            convertJsonToTypeScript(item, null, false),
        );
        const uniqueTypes = [...new Set(elementTypes)];

        // 如果数组元素有多种类型，使用联合类型
        const elementType =
            uniqueTypes.length > 1 ? uniqueTypes.join(" | ") : uniqueTypes[0];
        return `${elementType}[]`;
    }

    // 处理对象 - 生成接口
    const properties = Object.entries(json)
        .map(([key, value]) => {
            const type = convertJsonToTypeScript(value, capitalize(key), false);
            const optional = options.value.optionalProperties ? "?" : "";
            const nullable = options.value.nullableProperties ? " | null" : "";
            const readonly = options.value.addReadonly ? "readonly " : "";

            return `  ${readonly}${key}${optional}: ${type}${nullable};`;
        })
        .join("\n");

    // 如果是根对象且需要接口名称
    if (isRoot && options.value.interfaceName && intfName) {
        return `interface ${intfName} {\n${properties}\n}`;
    }

    // 嵌套对象使用匿名类型
    return `{\n${properties}\n}`;
};

// 从值获取TypeScript类型
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

// 工具函数：首字母大写
const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
};

// 清空输入
const clearInput = () => {
    jsonInput.value = "";
    tsOutput.value = "";
    errorMessage.value = "";
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

// 复制到剪贴板
const copyToClipboard = () => {
    if (!tsOutput.value) return;

    navigator.clipboard
        .writeText(tsOutput.value)
        .then(() => {
            showNotificationMessage("已复制到剪贴板!");
        })
        .catch((err) => {
            showNotificationMessage("复制失败，请手动复制", false);
            console.error("复制失败:", err);
        });
};

// 显示通知消息
const showNotificationMessage = (message) => {
    notificationMessage.value = message;
    showNotification.value = true;

    setTimeout(() => {
        showNotification.value = false;
    }, 3000);
};

// 监听选项变化，重新转换
watch(options, handleInput, { deep: true });
watch(interfaceName, handleInput);
</script>

<style scoped>
/* 容器适配 App 布局 */
.json-to-ts-converter {
    width: 100%;
}

/* 头部样式（与其他页面统一） */
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

/* 主要内容区 */
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

/* 共用样式 */
.section-label {
    display: block;
    font-weight: 600;
    margin-bottom: 10px;
    color: #2c3e50;
    font-size: 1.1rem;
}

/* 输入区域 */
.input-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

textarea {
    width: 100%;
    min-height: 250px;
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

/* 按钮样式 */
.actions {
    display: flex;
    gap: 10px;
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
    margin-top: 10px;
    padding: 10px 20px;
    width: 100%;
}

.copy-btn:hover:not(:disabled) {
    background-color: #27ae60;
}

.copy-btn:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
    opacity: 0.7;
}

.icon {
    font-style: normal;
}

/* 选项区域 */
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
}

.interface-name-input {
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
    min-height: 250px;
    border: 1px solid #ddd;
    border-radius: 6px;
    overflow: hidden;
}

.ts-output {
    width: 100%;
    min-height: 250px;
    padding: 15px;
    margin: 0;
    font-family: "Consolas", "Monaco", monospace;
    font-size: 0.9rem;
    background-color: #f8fafc;
    white-space: pre-wrap;
    word-wrap: break-word;
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
}

/* 错误消息 */
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

/* 通知 */
.notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 20px;
    background-color: #2ecc71;
    color: white;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-size: 0.95rem;
    z-index: 100;
    animation:
        fadeIn 0.3s,
        fadeOut 0.3s 2.7s;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
        transform: translateY(0);
    }
    to {
        opacity: 0;
        transform: translateY(20px);
    }
}
</style>
