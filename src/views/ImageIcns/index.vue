<template>
    <div class="tool-page">
        <header class="tool-header">
            <h1>图片转图标</h1>
            <p>将图片转换为多种图标格式（ICNS、ICO、PNG）</p>
        </header>

        <main class="main-content">
            <section class="tool-section">
                <div class="upload-area">
                    <div class="file-input-wrapper">
                        <input
                            type="file"
                            id="fileInput"
                            accept="image/*"
                            @change="handleFileSelect"
                            class="file-input"
                        />
                        <label for="fileInput" class="file-input-label">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path
                                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                                />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            选择图片文件
                        </label>
                    </div>

                    <div v-if="previewUrl" class="preview-container">
                        <img
                            :src="previewUrl"
                            alt="预览图"
                            class="preview-image"
                        />
                        <div class="file-info">
                            <span class="file-name">{{
                                selectedFile?.name
                            }}</span>
                            <span class="file-size">{{
                                formatFileSize(selectedFile?.size)
                            }}</span>
                        </div>
                    </div>
                </div>

                <div class="action-buttons">
                    <button
                        @click="convertToIcns"
                        :disabled="!selectedFile || isConverting || !wasmReady"
                        class="btn btn-primary"
                    >
                        <svg
                            v-if="isConverting"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            class="spinning"
                        >
                            <line x1="12" y1="2" x2="12" y2="6" />
                            <line x1="12" y1="18" x2="12" y2="22" />
                            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                            <line x1="2" y1="12" x2="6" y2="12" />
                            <line x1="18" y1="12" x2="22" y2="12" />
                            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                        </svg>
                        {{ isConverting ? "转换中..." : "生成 ICNS" }}
                    </button>

                    <button
                        @click="convertToIco"
                        :disabled="!selectedFile || isConverting || !wasmReady"
                        class="btn btn-primary"
                    >
                        <svg
                            v-if="isConverting"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            class="spinning"
                        >
                            <line x1="12" y1="2" x2="12" y2="6" />
                            <line x1="12" y1="18" x2="12" y2="22" />
                            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                            <line x1="2" y1="12" x2="6" y2="12" />
                            <line x1="18" y1="12" x2="22" y2="12" />
                            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                        </svg>
                        {{ isConverting ? "转换中..." : "生成 ICO" }}
                    </button>

                    <button
                        @click="convertToPngs"
                        :disabled="!selectedFile || isConverting || !wasmReady"
                        class="btn btn-primary"
                    >
                        <svg
                            v-if="isConverting"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            class="spinning"
                        >
                            <line x1="12" y1="2" x2="12" y2="6" />
                            <line x1="12" y1="18" x2="12" y2="22" />
                            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                            <line x1="2" y1="12" x2="6" y2="12" />
                            <line x1="18" y1="12" x2="22" y2="12" />
                            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                        </svg>
                        {{ isConverting ? "转换中..." : "生成 PNGs" }}
                    </button>

                    <button
                        @click="convertToAll"
                        :disabled="!selectedFile || isConverting || !wasmReady"
                        class="btn btn-primary"
                    >
                        <svg
                            v-if="isConverting"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            class="spinning"
                        >
                            <line x1="12" y1="2" x2="12" y2="6" />
                            <line x1="12" y1="18" x2="12" y2="22" />
                            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                            <line x1="2" y1="12" x2="6" y2="12" />
                            <line x1="18" y1="12" x2="22" y2="12" />
                            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                        </svg>
                        {{ isConverting ? "转换中..." : "生成全部" }}
                    </button>
                </div>

                <div class="status-container">
                    <div
                        class="status-message"
                        :class="statusType"
                        v-if="statusMessage"
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                v-if="statusType === 'success'"
                                d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                            />
                            <polyline
                                v-if="statusType === 'success'"
                                points="22 4 12 14.01 9 11.01"
                            />
                            <circle
                                v-if="statusType === 'error'"
                                cx="12"
                                cy="12"
                                r="10"
                            />
                            <line
                                v-if="statusType === 'error'"
                                x1="15"
                                y1="9"
                                x2="9"
                                y2="15"
                            />
                            <line
                                v-if="statusType === 'error'"
                                x1="9"
                                y1="9"
                                x2="15"
                                y2="15"
                            />
                            <circle
                                v-if="statusType === 'info'"
                                cx="12"
                                cy="12"
                                r="10"
                            />
                            <line
                                v-if="statusType === 'info'"
                                x1="12"
                                y1="16"
                                x2="12"
                                y2="12"
                            />
                            <line
                                v-if="statusType === 'info'"
                                x1="12"
                                y1="8"
                                x2="12.01"
                                y2="8"
                            />
                        </svg>
                        {{ statusMessage }}
                    </div>
                </div>

                <div class="log-container" v-if="logMessages.length > 0">
                    <div class="log-header">
                        <h3>转换日志</h3>
                        <button @click="clearLogs" class="btn btn-small">
                            清除日志
                        </button>
                    </div>
                    <div class="log-content">
                        <div
                            v-for="(log, index) in logMessages"
                            :key="index"
                            class="log-item"
                        >
                            <span class="log-time">[{{ log.time }}]</span>
                            <span class="log-message">{{ log.message }}</span>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import JSZip from "jszip";
import createModule from "./fun.js";

const wasmModule = ref(null);
const wasmReady = ref(false);
const selectedFile = ref(null);
const previewUrl = ref("");
const isConverting = ref(false);
const statusMessage = ref("");
const statusType = ref("info");
const logMessages = ref([]);

const ImageSizes = [
    16, 24, 30, 32, 40, 48, 64, 72, 80, 96, 128, 256, 512, 1024,
];

onMounted(async () => {
    addLog("🔄 正在加载 WASM 模块...");
    try {
        wasmModule.value = await createModule();
        wasmReady.value = true;
        addLog("✅ WASM 模块加载完成！");
        showStatus("WASM 已就绪 ✅", "success");
    } catch (err) {
        addLog(`❌ WASM 加载失败: ${err.message}`);
        showStatus("WASM 加载失败 ❌", "error");
    }
});

// 文件选择处理
const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    selectedFile.value = file;

    // 创建预览URL
    const reader = new FileReader();
    reader.onload = (e) => {
        previewUrl.value = e.target.result;
        addLog(`📂 已选择文件: ${file.name}`);
    };
    reader.readAsDataURL(file);
};

// 转换为ICNS
const convertToIcns = async () => {
    if (!selectedFile.value || !wasmModule.value || !wasmReady.value) {
        addLog("⚠️ 没有文件或 WASM 未加载");
        return;
    }

    isConverting.value = true;
    showStatus("正在转换...", "info");
    addLog("🚀 开始转换 ICNS...");

    try {
        // 将文件写入WASM文件系统
        const buffer = new Uint8Array(await selectedFile.value.arrayBuffer());
        wasmModule.value.FS_writeFile("input.png", buffer);

        // 调用C函数进行转换
        const result = wasmModule.value.ccall(
            "wasm_convert_to_icns",
            "number",
            ["string", "string"],
            ["input.png", "output.icns"],
        );

        if (result === 0) {
            // 读取输出文件
            const icnsData = wasmModule.value.FS_readFile("output.icns");
            downloadFile(icnsData, `${getBaseFileName()}.icns`, "image/icns");
            showStatus("ICNS 转换完成 ✅", "success");
            addLog("✅ ICNS 文件生成成功！");
        } else {
            showStatus("ICNS 转换失败 ❌", "error");
            addLog("❌ 转换函数返回错误码");
        }
    } catch (err) {
        showStatus("ICNS 转换失败 ❌", "error");
        addLog(`❌ 转换异常: ${err.message}`);
    } finally {
        isConverting.value = false;
    }
};

// 转换为ICO
const convertToIco = async () => {
    if (!selectedFile.value || !wasmModule.value || !wasmReady.value) {
        addLog("⚠️ 没有文件或 WASM 未加载");
        return;
    }

    isConverting.value = true;
    showStatus("正在转换...", "info");
    addLog("🚀 开始转换 ICO...");

    try {
        // 将文件写入WASM文件系统
        const buffer = new Uint8Array(await selectedFile.value.arrayBuffer());
        wasmModule.value.FS_writeFile("input.png", buffer);

        // 调用C函数进行转换
        const result = wasmModule.value.ccall(
            "wasm_convert_to_ico",
            "number",
            ["string", "string"],
            ["input.png", "output.ico"],
        );

        if (result === 0) {
            // 读取输出文件
            const icoData = wasmModule.value.FS_readFile("output.ico");
            downloadFile(icoData, `${getBaseFileName()}.ico`, "image/x-icon");
            showStatus("ICO 转换完成 ✅", "success");
            addLog("✅ ICO 文件生成成功！");
        } else {
            showStatus("ICO 转换失败 ❌", "error");
            addLog("❌ 转换函数返回错误码");
        }
    } catch (err) {
        showStatus("ICO 转换失败 ❌", "error");
        addLog(`❌ 转换异常: ${err.message}`);
    } finally {
        isConverting.value = false;
    }
};

// 转换为PNGs
const convertToPngs = async () => {
    if (!selectedFile.value || !wasmModule.value || !wasmReady.value) {
        addLog("⚠️ 没有文件或 WASM 未加载");
        return;
    }

    isConverting.value = true;
    showStatus("正在转换...", "info");
    addLog("🚀 开始转换 PNGs...");

    try {
        // 将文件写入WASM文件系统
        const buffer = new Uint8Array(await selectedFile.value.arrayBuffer());
        wasmModule.value.FS_writeFile("input.png", buffer);

        // 调用C函数进行转换
        const result = wasmModule.value.ccall(
            "wasm_convert_to_pngs",
            "number",
            ["string"],
            ["input.png"],
        );

        if (result === 0) {
            // 创建ZIP文件包含所有PNG
            const zip = new JSZip();
            let pngCount = 0;

            for (const size of ImageSizes) {
                try {
                    const pngData = wasmModule.value.FS_readFile(
                        `/${size}.png`,
                    );
                    zip.file(`${size}.png`, pngData);
                    pngCount++;
                } catch (e) {
                    addLog(`⚠️ 缺少 ${size}.png，${e}`);
                }
            }

            if (pngCount > 0) {
                const zipBlob = await zip.generateAsync({ type: "blob" });
                downloadFile(
                    zipBlob,
                    `${getBaseFileName()}_pngs.zip`,
                    "application/zip",
                );
                showStatus(`PNGs 转换完成 ✅ (${pngCount} 个文件)`, "success");
                addLog(`✅ ${pngCount} 个 PNG 文件生成成功！`);
            } else {
                showStatus("没有生成任何 PNG 文件 ❌", "error");
                addLog("❌ 没有生成任何 PNG 文件");
            }
        } else {
            showStatus("PNGs 转换失败 ❌", "error");
            addLog("❌ 转换函数返回错误码");
        }
    } catch (err) {
        showStatus("PNGs 转换失败 ❌", "error");
        addLog(`❌ 转换异常: ${err.message}`);
    } finally {
        isConverting.value = false;
    }
};

// 转换为所有格式
const convertToAll = async () => {
    if (!selectedFile.value || !wasmModule.value || !wasmReady.value) {
        addLog("⚠️ 没有文件或 WASM 未加载");
        return;
    }

    isConverting.value = true;
    showStatus("正在转换...", "info");
    addLog("🚀 开始转换所有格式...");

    try {
        // 将文件写入WASM文件系统
        const buffer = new Uint8Array(await selectedFile.value.arrayBuffer());
        wasmModule.value.FS_writeFile("input.png", buffer);

        // 调用C函数进行转换
        const result = wasmModule.value.ccall(
            "wasm_convert_to_both",
            "number",
            ["string", "string"],
            ["input.png", "output_both"],
        );

        if (result === 0) {
            // 创建ZIP文件包含所有输出
            const zip = new JSZip();
            let fileCount = 0;

            // 添加ICNS文件
            try {
                const icnsData =
                    wasmModule.value.FS_readFile("/output_both.icns");
                zip.file(`${getBaseFileName()}.icns`, icnsData);
                fileCount++;
            } catch (e) {
                addLog(`⚠️ 缺少 ICNS 文件，${e}`);
            }

            // 添加ICO文件
            try {
                const icoData =
                    wasmModule.value.FS_readFile("/output_both.ico");
                zip.file(`${getBaseFileName()}.ico`, icoData);
                fileCount++;
            } catch (e) {
                addLog(`⚠️ 缺少 ICO 文件，${e}`);
            }

            for (const size of ImageSizes) {
                try {
                    const pngData = wasmModule.value.FS_readFile(
                        `/${size}.png`,
                    );
                    zip.file(`${size}.png`, pngData);
                    fileCount++;
                } catch (e) {
                    addLog(`⚠️ 缺少 ${size}.png,${e}`);
                }
            }

            if (fileCount > 0) {
                const zipBlob = await zip.generateAsync({ type: "blob" });
                downloadFile(
                    zipBlob,
                    `${getBaseFileName()}_all_formats.zip`,
                    "application/zip",
                );
                showStatus(`全部转换完成 ✅ (${fileCount} 个文件)`, "success");
                addLog(`✅ ${fileCount} 个文件生成成功！`);
            } else {
                showStatus("没有生成任何文件 ❌", "error");
                addLog("❌ 没有生成任何文件");
            }
        } else {
            showStatus("全部转换失败 ❌", "error");
            addLog("❌ 转换函数返回错误码");
        }
    } catch (err) {
        showStatus("全部转换失败 ❌", "error");
        addLog(`❌ 转换异常: ${err.message}`);
    } finally {
        isConverting.value = false;
    }
};

// 获取基础文件名（不含扩展名）
const getBaseFileName = () => {
    return selectedFile.value?.name.replace(/\.[^/.]+$/, "") || "output";
};

// 下载文件
const downloadFile = (data, filename, mimeType) => {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addLog(`💾 已下载: ${filename}`);
};

// 工具函数
const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const addLog = (message) => {
    const time = new Date().toLocaleTimeString();
    logMessages.value.push({ time, message });
};

const clearLogs = () => {
    logMessages.value = [];
};

const showStatus = (message, type) => {
    statusMessage.value = message;
    statusType.value = type;
};
</script>

<style scoped>
.tool-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--space-xl);
    color: var(--text);
    min-height: calc(100vh - 200px);
}

.tool-header {
    text-align: center;
    margin-bottom: var(--space-3xl);
    padding-bottom: var(--space-xl);
    border-bottom: 1px solid var(--border);
}

.tool-header h1 {
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-bold);
    color: var(--accent);
    margin-bottom: var(--space-sm);
}

.tool-header p {
    font-size: var(--font-size-lg);
    color: var(--text-secondary);
    margin: 0;
}

.main-content {
    max-width: 800px;
    margin: 0 auto;
}

.tool-section {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: var(--space-xl);
    margin-bottom: var(--space-2xl);
    box-shadow: var(--shadow-sm);
}

.upload-area {
    margin-bottom: var(--space-2xl);
}

.file-input-wrapper {
    position: relative;
    margin-bottom: var(--space-lg);
}

.file-input {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
}

.file-input-label {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    padding: var(--space-lg) var(--space-xl);
    background: var(--accent);
    color: white;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size);
}

.file-input-label:hover {
    background: var(--accent-light);
    transform: translateY(-1px);
}

.preview-container {
    display: flex;
    align-items: center;
    gap: var(--space-lg);
    padding: var(--space-lg);
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    border: 2px dashed var(--border);
}

.preview-image {
    max-width: 100px;
    max-height: 100px;
    object-fit: contain;
    border-radius: var(--radius-sm);
}

.file-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
}

.file-name {
    font-weight: var(--font-weight-medium);
    color: var(--text);
}

.file-size {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
}

.action-buttons {
    display: flex;
    gap: var(--space-lg);
    margin-bottom: var(--space-lg);
}

.btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-sm) var(--space-md);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--bg);
    color: var(--text);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
    min-height: 36px;
}

.btn:hover {
    background: var(--info);
    border-color: var(--border);
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-primary {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
}

.btn-primary:hover:not(:disabled) {
    background: var(--accent-light);
    border-color: var(--accent-light);
}

.btn-small {
    padding: var(--space-sm) var(--space);
    font-size: var(--font-size-xs);
}

.status-container {
    margin-bottom: var(--space-lg);
}

.status-message {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm) var(--space);
    border-radius: var(--radius);
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-sm);
}

.status-message.success {
    background: rgba(16, 185, 129, 0.1);
    color: var(--success);
    border: 1px solid var(--success);
}

.status-message.error {
    background: rgba(239, 68, 68, 0.1);
    color: var(--error);
    border: 1px solid var(--error);
}

.status-message.info {
    background: rgba(59, 130, 246, 0.1);
    color: var(--info);
    border: 1px solid var(--info);
}

.log-container {
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    overflow: hidden;
    border: 1px solid var(--border);
}

.log-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-lg);
    background: var(--bg);
    border-bottom: 1px solid var(--border);
}

.log-header h3 {
    margin: 0;
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--accent);
}

.log-content {
    max-height: 200px;
    overflow-y: auto;
    padding: var(--space-lg);
}

.log-item {
    display: flex;
    gap: var(--space-sm);
    margin-bottom: var(--space-sm);
    font-size: var(--font-size-sm);
    font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
}

.log-time {
    color: var(--text-secondary);
    white-space: nowrap;
}

.log-message {
    color: var(--text);
    word-break: break-word;
}

.spinning {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .tool-page {
        padding: var(--space-lg);
    }

    .tool-section {
        padding: var(--space-lg);
    }

    .action-buttons {
        flex-direction: column;
    }

    .preview-container {
        flex-direction: column;
        text-align: center;
    }
}
</style>
