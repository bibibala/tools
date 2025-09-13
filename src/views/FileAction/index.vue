<template>
    <div class="tool-page">
        <header class="tool-header">
            <h1>大文件处理工具</h1>
            <p>分片读取，控制并发，支持暂停/继续/取消，实时展示进度</p>
        </header>

        <main class="main-content">
            <section class="input-section">
                <label class="section-label">选择文件</label>
                <div class="input-row">
                    <input
                        type="file"
                        @change="onFileChange"
                        :disabled="isReading"
                    />
                    <button
                        class="btn clear-btn"
                        @click="reset"
                        :disabled="!file || isReading"
                    >
                        清除
                    </button>
                </div>

                <div v-if="fileInfo" class="file-meta">
                    <div class="meta-item">
                        <strong>文件名：</strong>{{ fileInfo.name }}
                    </div>
                    <div class="meta-item">
                        <strong>大小：</strong
                        >{{ (fileInfo.size / 1024 / 1024).toFixed(2) }} MB
                    </div>
                    <div class="meta-item">
                        <strong>类型：</strong>{{ fileInfo.type || "未知" }}
                    </div>
                </div>
            </section>

            <section class="options-section">
                <label class="section-label">读取参数</label>
                <div class="options-container">
                    <div class="option-item">
                        <label class="option-label">分片大小</label>
                        <select
                            v-model.number="chunkSizeMB"
                            :disabled="isReading"
                        >
                            <option :value="1">1 MB</option>
                            <option :value="2">2 MB</option>
                            <option :value="4">4 MB</option>
                            <option :value="8">8 MB</option>
                            <option :value="16">16 MB</option>
                        </select>
                    </div>
                    <div class="option-item">
                        <label class="option-label">并发数</label>
                        <input
                            type="range"
                            min="1"
                            max="8"
                            v-model.number="concurrency"
                            :disabled="isReading"
                        />
                        <span class="option-value">{{ concurrency }}</span>
                    </div>

                    <div class="actions">
                        <button
                            class="btn sample-btn"
                            @click="startRead"
                            :disabled="!file || isReading"
                        >
                            开始读取
                        </button>
                        <button
                            class="btn"
                            @click="togglePause"
                            :disabled="!isReading"
                        >
                            {{ isPaused ? "继续" : "暂停" }}
                        </button>
                        <button
                            class="btn"
                            @click="cancel"
                            :disabled="!isReading"
                        >
                            取消
                        </button>
                    </div>
                </div>
            </section>

            <section v-if="fileInfo" class="progress-section">
                <label class="section-label">进度</label>
                <div class="progress-bar">
                    <div
                        class="progress"
                        :style="{ width: percent + '%' }"
                    ></div>
                </div>
                <div class="stats">
                    <div>进度：{{ percent.toFixed(1) }}%</div>
                    <div>分片：{{ loadedChunks }} / {{ totalChunks }}</div>
                    <div>
                        已读：{{ (bytesRead / 1024 / 1024).toFixed(2) }} /
                        {{ (fileInfo.size / 1024 / 1024).toFixed(2) }} MB
                    </div>
                    <div>速度：{{ speedMBps.toFixed(2) }} MB/s</div>
                    <div v-if="etaSeconds !== null">
                        剩余：约 {{ etaSeconds.toFixed(1) }} 秒
                    </div>
                    <div v-if="elapsedSeconds > 0">
                        耗时：{{ elapsedSeconds.toFixed(1) }} 秒
                    </div>
                </div>
            </section>

            <section v-if="textPreview" class="preview-section">
                <label class="section-label">文本预览（前 1KB）</label>
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
.main-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 25px;
}

.section-label {
    display: block;
    font-weight: 600;
    margin-bottom: 10px;
    color: #2c3e50;
    font-size: 1.1rem;
}

.input-row {
    display: flex;
    gap: 10px;
    align-items: center;
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

.clear-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.sample-btn {
    background-color: #3498db;
    color: #fff;
}

.sample-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.options-container {
    background-color: #f8fafc;
    border-radius: 6px;
    padding: 20px;
    border: 1px solid #e2e8f0;
}

.option-item {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
}

.option-label {
    min-width: 72px;
}

.option-value {
    color: #7f8c8d;
    min-width: 24px;
    text-align: right;
}

.file-meta {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 8px 16px;
}

.progress-bar {
    height: 10px;
    background: #e5e7eb;
    border-radius: 999px;
    overflow: hidden;
}

.progress {
    height: 100%;
    background: #2ecc71;
    width: 0%;
    transition: width 0.2s linear;
}

.stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 8px 16px;
    margin-top: 10px;
    color: #555;
}

.preview-box {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 12px;
    white-space: pre-wrap;
    word-break: break-word;
}
</style>
