<template>
    <div class="tool-page">
        <header class="tool-header">
            <h1>大文件处理工具</h1>
            <p>分片读取，控制并发，支持暂停/继续/取消，实时展示进度</p>
        </header>

        <main class="main-content">
            <section class="tool-section">
                <h2 class="section-title">选择文件</h2>
                <div class="config-grid">
                    <div class="config-item full-width">
                        <div class="input-row">
                            <input
                                type="file"
                                @change="onFileChange"
                                :disabled="isReading"
                                class="form-input"
                            />
                            <button
                                class="btn btn-secondary"
                                @click="reset"
                                :disabled="!file || isReading"
                            >
                                清除
                            </button>
                        </div>
                    </div>

                    <div v-if="fileInfo" class="config-item full-width">
                        <div class="file-meta">
                            <div class="info-item">
                                <label>文件名：</label>
                                <span>{{ fileInfo.name }}</span>
                            </div>
                            <div class="info-item">
                                <label>大小：</label>
                                <span
                                    >{{
                                        (fileInfo.size / 1024 / 1024).toFixed(2)
                                    }}
                                    MB</span
                                >
                            </div>
                            <div class="info-item">
                                <label>类型：</label>
                                <span>{{ fileInfo.type || "未知" }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="tool-section">
                <h2 class="section-title">读取参数</h2>
                <div class="config-grid">
                    <div class="config-item">
                        <label class="section-label">分片大小</label>
                        <select
                            v-model.number="chunkSizeMB"
                            :disabled="isReading"
                            class="form-input"
                        >
                            <option :value="1">1 MB</option>
                            <option :value="2">2 MB</option>
                            <option :value="4">4 MB</option>
                            <option :value="8">8 MB</option>
                            <option :value="16">16 MB</option>
                        </select>
                    </div>
                    <div class="config-item">
                        <label class="section-label">并发数</label>
                        <div class="range-input-wrapper">
                            <input
                                type="range"
                                min="1"
                                max="8"
                                v-model.number="concurrency"
                                :disabled="isReading"
                                class="range-input"
                            />
                            <span class="range-value">{{ concurrency }}</span>
                        </div>
                    </div>

                    <div class="config-item full-width">
                        <div class="actions">
                            <button
                                class="btn btn-primary"
                                @click="startRead"
                                :disabled="!file || isReading"
                            >
                                开始读取
                            </button>
                            <button
                                class="btn btn-warning"
                                @click="togglePause"
                                :disabled="!isReading"
                            >
                                {{ isPaused ? "继续" : "暂停" }}
                            </button>
                            <button
                                class="btn btn-error"
                                @click="cancel"
                                :disabled="!isReading"
                            >
                                取消
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section v-if="fileInfo" class="tool-section">
                <h2 class="section-title">进度</h2>
                <div class="progress-container">
                    <div class="progress-bar">
                        <div
                            class="progress"
                            :style="{ width: percent + '%' }"
                        ></div>
                    </div>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <label>进度：</label>
                            <span class="status-info"
                                >{{ percent.toFixed(1) }}%</span
                            >
                        </div>
                        <div class="stat-item">
                            <label>分片：</label>
                            <span>{{ loadedChunks }} / {{ totalChunks }}</span>
                        </div>
                        <div class="stat-item">
                            <label>已读：</label>
                            <span
                                >{{ (bytesRead / 1024 / 1024).toFixed(2) }} /
                                {{ (fileInfo.size / 1024 / 1024).toFixed(2) }}
                                MB</span
                            >
                        </div>
                        <div class="stat-item">
                            <label>速度：</label>
                            <span class="status-success"
                                >{{ speedMBps.toFixed(2) }} MB/s</span
                            >
                        </div>
                        <div v-if="etaSeconds !== null" class="stat-item">
                            <label>剩余：</label>
                            <span class="status-warning"
                                >约 {{ etaSeconds.toFixed(1) }} 秒</span
                            >
                        </div>
                        <div v-if="elapsedSeconds > 0" class="stat-item">
                            <label>耗时：</label>
                            <span>{{ elapsedSeconds.toFixed(1) }} 秒</span>
                        </div>
                    </div>
                </div>
            </section>

            <section v-if="textPreview" class="tool-section">
                <h2 class="section-title">文本预览（前 1KB）</h2>
                <pre class="preview-box">{{ textPreview }}</pre>
            </section>
        </main>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";

const file = ref(null);
const fileInfo = ref(null);
const textPreview = ref("");

const chunkSizeMB = ref(2);
const concurrency = ref(5);

const totalChunks = ref(0);
const loadedChunks = ref(0);
const bytesRead = ref(0);

const isReading = ref(false);
const isPaused = ref(false);
const isCanceled = ref(false);
let resumeResolver = null;

const startTs = ref(0);
const endTs = ref(0);

const CHUNK_SIZE = computed(() => chunkSizeMB.value * 1024 * 1024);

const percent = computed(() => {
    if (!fileInfo.value || fileInfo.value.size === 0) return 0;
    return Math.min(100, (bytesRead.value / fileInfo.value.size) * 100);
});

const elapsedSeconds = computed(() => {
    if (!startTs.value) return 0;
    const end = endTs.value || Date.now();
    return (end - startTs.value) / 1000;
});

const speedMBps = computed(() => {
    if (elapsedSeconds.value <= 0) return 0;
    return bytesRead.value / 1024 / 1024 / elapsedSeconds.value;
});

const etaSeconds = computed(() => {
    if (!fileInfo.value || speedMBps.value === 0) return null;
    const remainingMB = (fileInfo.value.size - bytesRead.value) / 1024 / 1024;
    return Math.max(0, remainingMB / speedMBps.value);
});

function onFileChange(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    reset();
    file.value = f;
    fileInfo.value = {
        name: f.name,
        size: f.size,
        type: f.type,
    };
    totalChunks.value = Math.ceil(f.size / CHUNK_SIZE.value);
    previewIfText(f);
}

function reset() {
    if (isReading.value) return;
    file.value = null;
    fileInfo.value = null;
    textPreview.value = "";
    totalChunks.value = 0;
    loadedChunks.value = 0;
    bytesRead.value = 0;
    isPaused.value = false;
    isCanceled.value = false;
    startTs.value = 0;
    endTs.value = 0;
}

function togglePause() {
    if (!isReading.value) return;
    isPaused.value = !isPaused.value;
    if (!isPaused.value && resumeResolver) {
        // resume workers
        resumeResolver();
        resumeResolver = null;
    }
}

function cancel() {
    if (!isReading.value) return;
    isCanceled.value = true;
    // 解除暂停以便 worker 感知取消
    if (resumeResolver) {
        resumeResolver();
        resumeResolver = null;
    }
}

async function startRead() {
    if (!file.value) return;
    // 初始化状态
    isReading.value = true;
    isPaused.value = false;
    isCanceled.value = false;
    loadedChunks.value = 0;
    bytesRead.value = 0;
    totalChunks.value = Math.ceil(file.value.size / CHUNK_SIZE.value);
    startTs.value = Date.now();
    endTs.value = 0;

    try {
        await readFileInChunks(file.value, concurrency.value);
    } finally {
        isReading.value = false;
        if (!isCanceled.value) endTs.value = Date.now();
    }
}

async function readFileInChunks(f, conc) {
    let index = 0;
    const chunks = Math.ceil(f.size / CHUNK_SIZE.value);

    async function nextChunk() {
        const current = index++;
        if (current >= chunks) return null;
        const start = current * CHUNK_SIZE.value;
        const end = Math.min(start + CHUNK_SIZE.value, f.size);
        return f.slice(start, end);
    }

    async function waitIfPaused() {
        if (!isPaused.value) return;
        await new Promise((resolve) => {
            resumeResolver = resolve;
        });
    }

    async function worker() {
        while (true) {
            if (isCanceled.value) return;
            await waitIfPaused();
            if (isCanceled.value) return;
            const blob = await nextChunk();
            if (!blob) return;
            const buf = await readChunk(blob);
            // 在这里可进行边读边上传/处理 buf
            loadedChunks.value++;
            bytesRead.value += buf.byteLength;
        }
    }

    await Promise.all(Array.from({ length: conc }, worker));
}

function readChunk(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(reader.error);
        reader.onload = () => resolve(reader.result);
        reader.readAsArrayBuffer(blob);
    });
}

async function previewIfText(f) {
    const isLikelyText =
        (f.type && f.type.startsWith("text")) ||
        /\.(txt|md|csv|json|log|xml|html?)$/i.test(f.name);
    if (!isLikelyText) {
        textPreview.value = "";
        return;
    }
    const blob = f.slice(0, 1024);
    textPreview.value = await blob.text();
}
</script>
<style scoped>
/* 使用项目统一的设计系统 */

.main-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xl);
}

.input-row {
    display: flex;
    gap: var(--space-md);
    align-items: center;
}

.range-input-wrapper {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    width: 100%;
}

.range-input {
    flex: 1;
    height: 6px;
    background: var(--bg-secondary);
    border-radius: var(--radius);
    outline: none;
    border: 1px solid var(--border);
    cursor: pointer;
}

.range-input::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    background: var(--accent);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: var(--shadow-sm);
    transition: all 0.2s ease;
}

.range-input::-webkit-slider-thumb:hover {
    background: var(--accent-light);
    transform: scale(1.1);
}

.range-input::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: var(--accent);
    border-radius: 50%;
    cursor: pointer;
    border: none;
    box-shadow: var(--shadow-sm);
}

.range-value {
    color: var(--text-secondary);
    font-weight: var(--font-weight-medium);
    min-width: 24px;
    text-align: center;
    font-size: var(--font-size-sm);
}

.actions {
    display: flex;
    gap: var(--space-md);
    flex-wrap: wrap;
    justify-content: center;
}

.file-meta {
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    padding: var(--space-lg);
    border: 1px solid var(--border);
}

.info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-xs) 0;
    border-bottom: 1px solid var(--border-light);
}

.info-item:last-child {
    border-bottom: none;
}

.info-item label {
    font-weight: var(--font-weight-semibold);
    color: var(--text);
    font-size: var(--font-size-sm);
}

.info-item span {
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    word-break: break-all;
}

.progress-container {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
}

.progress-bar {
    height: 12px;
    background: var(--bg-secondary);
    border-radius: var(--radius);
    overflow: hidden;
    border: 1px solid var(--border);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

.progress {
    height: 100%;
    background: linear-gradient(90deg, var(--success), var(--info));
    width: 0%;
    transition: width 0.3s ease;
    border-radius: var(--radius);
    position: relative;
}

.progress::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
    );
    animation: shimmer 2s infinite;
}

@keyframes shimmer {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(100%);
    }
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-md);
}

.stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-sm) var(--space-md);
    background: var(--bg-secondary);
    border-radius: var(--radius);
    border: 1px solid var(--border);
}

.stat-item label {
    font-weight: var(--font-weight-medium);
    color: var(--text);
    font-size: var(--font-size-sm);
}

.stat-item span {
    font-weight: var(--font-weight-semibold);
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
}

.preview-box {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: var(--space-lg);
    white-space: pre-wrap;
    word-break: break-word;
    font-family: var(--font-mono, "Courier New", monospace), serif;
    font-size: var(--font-size-sm);
    line-height: 1.5;
    color: var(--text);
    max-height: 300px;
    overflow-y: auto;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .actions {
        flex-direction: column;
        align-items: stretch;
    }

    .input-row {
        flex-direction: column;
        align-items: stretch;
        gap: var(--space-sm);
    }

    .stats-grid {
        grid-template-columns: 1fr;
        gap: var(--space-sm);
    }

    .range-input-wrapper {
        flex-direction: column;
        gap: var(--space-sm);
    }
}
</style>
