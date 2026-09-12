<script setup>
import { ref, computed } from "vue";
import { RouterLink } from "vue-router";
import ExcelUploader from "./ExcelUploader.vue";
import SheetSelector from "./SheetSelector.vue";
import TableViewer from "./TableViewer.vue";
import CodeHighlighter from "./CodeHighlighter.vue";

const workbook = ref(null);
const fileName = ref("");
const sheets = ref([]);
const selectedSheet = ref("");
const tableSource = ref("");
const showCode = ref(false);
const activeLang = ref("html");

function openCodeModal(lang) {
  activeLang.value = lang;
  showCode.value = true;
}

function onLoaded(payload) {
  workbook.value = payload.workbook;
  fileName.value = payload.fileName;
  sheets.value = payload.workbook.SheetNames;
  selectedSheet.value = sheets.value[0] || "";
}

const currentWorksheet = computed(() => {
  if (!workbook.value || !selectedSheet.value) return null;
  return workbook.value.Sheets[selectedSheet.value];
});

function onRenderedHtml(html) {
  tableSource.value = html;
}

function extractTable(html) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const table = doc.querySelector("table");
    if (table) return table.outerHTML;
  } catch {
    // fallback to regex
  }
  const match = html.match(/<table[\s\S]*?<\/table>/i);
  return match ? match[0] : html;
}

function buildStandaloneHtml(tableHtml) {
  const safeTable = extractTable(tableHtml);
  const style = `
    table { border-collapse: collapse; width: 100%; }
    td, th { border: 1px solid #ddd; padding: 8px 12px; text-align: center; vertical-align: middle; }
    tbody tr:nth-child(-n+2) td { font-weight: 600; }
    tr:hover { background-color: #f9f9f9; }
  `;
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Excel 表格预览</title>
  <style>${style}</style>
</head>
<body>
${safeTable}
</body>
</html>`;
}

const fullHtmlDoc = computed(() =>
  tableSource.value ? buildStandaloneHtml(tableSource.value) : "",
);

function buildVueSfc(tableHtml) {
  const safeTable = extractTable(tableHtml);
  const style = `
    table { border-collapse: collapse; width: 100%; }
    td, th { border: 1px solid #ddd; padding: 8px 12px; text-align: center; vertical-align: middle; }
    tbody tr:nth-child(-n+2) td { font-weight: 600; }
    tr:hover { background-color: #f9f9f9; }
  `;
  const openScript = "<" + "script setup>";
  const closeScript = "<" + "/script>";
  const openStyle = "<" + "style>";
  const closeStyle = "<" + "/style>";
  return `<template>
  <div class="excel-preview">\n${safeTable}\n  </div>
</template>

${openScript}
${closeScript}

${openStyle}
${style}
${closeStyle}`;
}

const vueCode = computed(() =>
  tableSource.value ? buildVueSfc(tableSource.value) : "",
);

async function copyFullHtml() {
  try {
    await navigator.clipboard.writeText(fullHtmlDoc.value);
    alert("已复制到剪贴板");
  } catch (e) {
    console.error(e);
  }
}
</script>

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

    <div class="toolbar">
      <div class="left">
        <ExcelUploader @loaded="onLoaded" />
        <span v-if="workbook" class="file">{{ fileName }}</span>
        <SheetSelector
          v-if="workbook"
          v-model="selectedSheet"
          :sheets="sheets"
        />
      </div>
      <div class="right">
        <button class="btn" :disabled="!fullHtmlDoc" @click="copyFullHtml">
          复制完整HTML
        </button>
        <button
          class="btn secondary"
          :disabled="!tableSource"
          @click="openCodeModal('html')"
        >
          查看代码
        </button>
      </div>
    </div>

    <div class="viewer">
      <TableViewer
        :worksheet="currentWorksheet"
        @renderedHtml="onRenderedHtml"
      />
    </div>

    <div v-if="showCode" class="modal-overlay" @click.self="showCode = false">
      <div class="modal">
        <div class="modal-header">
          <div class="tabs">
            <button
              class="tab"
              :class="{ active: activeLang === 'html' }"
              @click="activeLang = 'html'"
            >
              HTML
            </button>
            <button
              class="tab"
              :class="{ active: activeLang === 'vue' }"
              @click="activeLang = 'vue'"
            >
              Vue
            </button>
          </div>
          <button class="close-btn" @click="showCode = false">✕</button>
        </div>
        <div class="modal-body">
          <CodeHighlighter
            :code="activeLang === 'html' ? fullHtmlDoc : vueCode"
            :language="activeLang"
            theme="vitesse-dark"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 13px;
  padding: 4px 8px;
  margin-left: -8px;
  border-radius: 6px;
  transition: all 0.15s ease;
  width: fit-content;
}

.back:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.back svg {
  width: 14px;
  height: 14px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-surface);
  flex-wrap: wrap;
  gap: 8px;
}

.left {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.file {
  color: var(--text-muted);
  font-size: 12px;
}

.btn {
  background: var(--accent);
  color: #fff;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: opacity 0.15s;
}

.btn:hover:not(:disabled) {
  opacity: 0.85;
}

.btn.secondary {
  background: #10b981;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.viewer {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px;
  flex: 1;
  min-height: 300px;
  overflow: auto;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  width: min(900px, 92vw);
  max-height: 80vh;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid #eee;
}

.tabs {
  display: flex;
  gap: 8px;
}

.tab {
  border: 1px solid #ddd;
  background: #f8f8f8;
  color: #374151;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
}

.tab.active {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
}

.close-btn {
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  color: #6b7280;
}

.modal-body {
  padding: 12px;
  overflow: auto;
}
</style>
