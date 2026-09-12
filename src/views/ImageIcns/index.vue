<template>
  <div class="page">
    <RouterLink to="/" class="back">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      返回
    </RouterLink>

    <div class="card">
      <div class="card-header">
        <h1 class="title">图片转图标</h1>
        <p class="subtitle">支持 ICNS、ICO、PNG 格式</p>
      </div>

      <label class="upload" :class="{ active: previewUrl }">
        <input type="file" accept="image/*" @change="handleFileSelect" />
        <template v-if="!previewUrl">
          <svg
            class="upload-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span class="upload-text">选择图片</span>
        </template>
        <template v-else>
          <img :src="previewUrl" alt="预览" class="preview" />
          <div class="file-info">
            <span class="file-name">{{ selectedFile?.name }}</span>
            <span class="file-size">{{
              formatFileSize(selectedFile?.size)
            }}</span>
          </div>
        </template>
      </label>

      <div class="actions">
        <button
          @click="convertToIcns"
          :disabled="!selectedFile || isConverting"
          class="btn"
        >
          <span v-if="isConverting" class="spinner"></span>
          ICNS
        </button>
        <button
          @click="convertToIco"
          :disabled="!selectedFile || isConverting"
          class="btn"
        >
          <span v-if="isConverting" class="spinner"></span>
          ICO
        </button>
        <button
          @click="convertToPngs"
          :disabled="!selectedFile || isConverting"
          class="btn"
        >
          <span v-if="isConverting" class="spinner"></span>
          PNGs
        </button>
        <button
          @click="convertToAll"
          :disabled="!selectedFile || isConverting"
          class="btn primary"
        >
          <span v-if="isConverting" class="spinner"></span>
          全部
        </button>
      </div>

      <div v-if="statusMessage" class="status" :class="statusType">
        {{ statusMessage }}
      </div>

      <div v-if="logMessages.length > 0" class="logs">
        <div class="logs-header">
          <span>日志</span>
          <button @click="clearLogs" class="clear">清除</button>
        </div>
        <div class="logs-body">
          <div v-for="(log, index) in logMessages" :key="index" class="log">
            <span class="log-time">{{ log.time }}</span>
            <span class="log-msg">{{ log.message }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import JSZip from "jszip";
import { getIco, getIcns, getPngs, getImageBoth } from "@bilibaba/ts-lab/wasm";

const selectedFile = ref(null);
const previewUrl = ref("");
const isConverting = ref(false);
const statusMessage = ref("");
const statusType = ref("info");
const logMessages = ref([]);

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  selectedFile.value = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    previewUrl.value = e.target.result;
    addLog(`已选择: ${file.name}`);
  };
  reader.readAsDataURL(file);
};

const convertToIcns = async () => {
  if (!selectedFile.value) return;
  isConverting.value = true;
  showStatus("转换中...", "info");
  addLog("开始转换 ICNS...");
  try {
    const buffer = new Uint8Array(await selectedFile.value.arrayBuffer());
    const icnsData = await getIcns(buffer);
    downloadFile(icnsData, `${getBaseFileName()}.icns`, "image/icns");
    showStatus("ICNS 转换完成", "success");
    addLog("ICNS 生成成功");
  } catch (err) {
    showStatus("ICNS 转换失败", "error");
    addLog(`异常: ${err.message}`);
  } finally {
    isConverting.value = false;
  }
};

const convertToIco = async () => {
  if (!selectedFile.value) return;
  isConverting.value = true;
  showStatus("转换中...", "info");
  addLog("开始转换 ICO...");
  try {
    const buffer = new Uint8Array(await selectedFile.value.arrayBuffer());
    const icoData = await getIco(buffer);
    downloadFile(icoData, `${getBaseFileName()}.ico`, "image/x-icon");
    showStatus("ICO 转换完成", "success");
    addLog("ICO 生成成功");
  } catch (err) {
    showStatus("ICO 转换失败", "error");
    addLog(`异常: ${err.message}`);
  } finally {
    isConverting.value = false;
  }
};

const convertToPngs = async () => {
  if (!selectedFile.value) return;
  isConverting.value = true;
  showStatus("转换中...", "info");
  addLog("开始转换 PNGs...");
  try {
    const buffer = new Uint8Array(await selectedFile.value.arrayBuffer());
    const pngs = await getPngs(buffer);
    const sizes = Object.keys(pngs);
    if (sizes.length > 0) {
      const zip = new JSZip();
      for (const [size, data] of Object.entries(pngs)) {
        zip.file(`${size}.png`, data);
      }
      const zipBlob = await zip.generateAsync({ type: "blob" });
      downloadFile(zipBlob, `${getBaseFileName()}_pngs.zip`, "application/zip");
      showStatus(`PNGs 完成 (${sizes.length} 个)`, "success");
      addLog(`${sizes.length} 个 PNG 生成成功`);
    } else {
      showStatus("没有生成 PNG", "error");
    }
  } catch (err) {
    showStatus("PNGs 转换失败", "error");
    addLog(`异常: ${err.message}`);
  } finally {
    isConverting.value = false;
  }
};

const convertToAll = async () => {
  if (!selectedFile.value) return;
  isConverting.value = true;
  showStatus("转换中...", "info");
  addLog("开始转换所有格式...");
  try {
    const buffer = new Uint8Array(await selectedFile.value.arrayBuffer());
    const { ico, icns, pngs } = await getImageBoth(buffer);
    const zip = new JSZip();
    let fileCount = 0;
    zip.file(`${getBaseFileName()}.icns`, icns);
    zip.file(`${getBaseFileName()}.ico`, ico);
    fileCount += 2;
    for (const [size, data] of Object.entries(pngs)) {
      zip.file(`${size}.png`, data);
      fileCount++;
    }
    const zipBlob = await zip.generateAsync({ type: "blob" });
    downloadFile(zipBlob, `${getBaseFileName()}_all.zip`, "application/zip");
    showStatus(`全部完成 (${fileCount} 个)`, "success");
    addLog(`${fileCount} 个文件生成成功`);
  } catch (err) {
    showStatus("转换失败", "error");
    addLog(`异常: ${err.message}`);
  } finally {
    isConverting.value = false;
  }
};

const getBaseFileName = () =>
  selectedFile.value?.name.replace(/\.[^/.]+$/, "") || "output";

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
  addLog(`已下载: ${filename}`);
};

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
.page {
  max-width: 480px;
  margin: 0 auto;
  padding: 48px 0;
}

.back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 13px;
  margin-bottom: 24px;
  padding: 4px 8px;
  margin-left: -8px;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.back:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.back svg {
  width: 14px;
  height: 14px;
}

.card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.card-header {
  padding: 20px 20px 0;
}

.title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.subtitle {
  color: var(--text-muted);
  font-size: 13px;
}

.upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px;
  padding: 32px;
  border: 1px dashed var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.15s ease;
  background: var(--bg-base);
}

.upload:hover {
  border-color: var(--text-muted);
}

.upload.active {
  border-style: solid;
}

.upload input {
  display: none;
}

.upload-icon {
  width: 32px;
  height: 32px;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.upload-text {
  font-size: 13px;
  color: var(--text-muted);
}

.preview {
  max-width: 80px;
  max-height: 80px;
  object-fit: contain;
  border-radius: 4px;
  margin-bottom: 8px;
}

.file-info {
  text-align: center;
}

.file-name {
  display: block;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 2px;
}

.file-size {
  font-size: 12px;
  color: var(--text-muted);
}

.actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 0 20px 20px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  background: var(--bg-base);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn:hover:not(:disabled) {
  background: var(--bg-hover);
  border-color: var(--text-muted);
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn.primary {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--bg-base);
}

.btn.primary:hover:not(:disabled) {
  background: #06b6d4;
  border-color: #06b6d4;
}

.spinner {
  width: 12px;
  height: 12px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.status {
  margin: 0 20px 16px;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.status.success {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.status.error {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.status.info {
  background: var(--accent-dim);
  color: var(--accent);
}

.logs {
  margin: 0 20px 20px;
  background: var(--bg-base);
  border: 1px solid var(--border);
  border-radius: 6px;
  overflow: hidden;
}

.logs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
  font-size: 12px;
  color: var(--text-muted);
}

.clear {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 11px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
}

.clear:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.logs-body {
  max-height: 100px;
  overflow-y: auto;
  padding: 8px 12px;
}

.log {
  display: flex;
  gap: 8px;
  font-size: 11px;
  font-family: "SF Mono", "Monaco", monospace;
  margin-bottom: 2px;
}

.log-time {
  color: var(--text-muted);
  white-space: nowrap;
}

.log-msg {
  color: var(--text-secondary);
}

@media (max-width: 480px) {
  .actions {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
