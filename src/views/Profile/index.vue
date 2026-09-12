<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { RouterLink } from "vue-router";

const SEC_META = {
  summary: { label: "个人简介", title: "个人简介" },
  skill: { label: "技术技能", title: "技术技能" },
  exp: { label: "工作经历", title: "工作经历" },
  proj: { label: "项目经历", title: "项目经历" },
  edu: { label: "教育背景", title: "教育背景" },
  cert: { label: "证书 / 荣誉", title: "证书 / 荣誉" },
};

const STORAGE_KEY = "rv_dev2";

const d = reactive({
  name: "",
  pos: "",
  phone: "",
  email: "",
  city: "",
  web: "",
  summary: "",
  skilltext: "",
  cert: "",
  photo: "",
  exp: [],
  proj: [],
  edu: [],
  sectionOrder: ["summary", "skill", "exp", "proj", "edu", "cert"],
});

const activeTab = ref("basic");
const showExportModal = ref(false);
const exportFilename = ref("");
const photoInput = ref(null);
const dragSrc = ref(null);

// ── Persistence ──
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    const parsed = JSON.parse(raw);
    Object.assign(d, parsed);
  }
  if (!d.sectionOrder || d.sectionOrder.length !== 6) {
    d.sectionOrder = ["summary", "skill", "exp", "proj", "edu", "cert"];
  }
}

// ── Tabs ──
function switchTab(tab) {
  activeTab.value = tab;
}

// ── Photo ──
function uploadPhoto(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    d.photo = ev.target.result;
    saveState();
  };
  reader.readAsDataURL(file);
}

function removePhoto() {
  d.photo = "";
  saveState();
  if (photoInput.value) photoInput.value.value = "";
}

// ── Entries ──
function addExp() {
  d.exp.push({ co: "", role: "", s: "", e: "", desc: "" });
  saveState();
}

function rmExp(i) {
  d.exp.splice(i, 1);
  saveState();
}

function addProj() {
  d.proj.push({ name: "", stack: "", link: "", s: "", e: "", desc: "" });
  saveState();
}

function rmProj(i) {
  d.proj.splice(i, 1);
  saveState();
}

function addEdu() {
  d.edu.push({ school: "", major: "", deg: "", s: "", e: "" });
  saveState();
}

function rmEdu(i) {
  d.edu.splice(i, 1);
  saveState();
}

// ── Escape HTML ──
function escHtml(s) {
  return (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ── Resume Sections ──
function buildSection(key) {
  switch (key) {
    case "summary":
      if (!d.summary.trim()) return "";
      return `<div class="rv-summary">${escHtml(d.summary)}</div>`;

    case "skill":
      if (!d.skilltext.trim()) return "";
      return `<div class="rv-skill-txt">${escHtml(d.skilltext).replace(/\n/g, "<br>")}</div>`;

    case "exp": {
      const items = d.exp.filter((e) => e.co || e.role);
      if (!items.length) return `<div class="rv-empty">暂无工作经历</div>`;
      return items
        .map((e) => {
          const date = [e.s, e.e].filter(Boolean).join(" – ");
          const desc = e.desc.trim()
            ? `<div class="rv-edesc"><ul>${e.desc
                .split("\n")
                .filter((l) => l.trim())
                .map((l) => `<li>${escHtml(l.replace(/^·\s*/, ""))}</li>`)
                .join("")}</ul></div>`
            : "";
          return `<div class="rv-entry"><div class="rv-erow"><div class="rv-etitle">${escHtml(e.co)}</div><div class="rv-edate">${escHtml(date)}</div></div><div class="rv-esub">${escHtml(e.role)}</div>${desc}</div>`;
        })
        .join("");
    }

    case "proj": {
      const items = d.proj.filter((p) => p.name);
      if (!items.length) return `<div class="rv-empty">暂无项目经历</div>`;
      return items
        .map((p) => {
          const date = [p.s, p.e].filter(Boolean).join(" – ");
          const stack = p.stack
            ? `<div class="rv-estack">技术栈：${escHtml(p.stack)}</div>`
            : "";
          const link = p.link
            ? `<div class="rv-elink">🔗 ${escHtml(p.link)}</div>`
            : "";
          const desc = p.desc.trim()
            ? `<div class="rv-edesc"><ul>${p.desc
                .split("\n")
                .filter((l) => l.trim())
                .map((l) => `<li>${escHtml(l.replace(/^·\s*/, ""))}</li>`)
                .join("")}</ul></div>`
            : "";
          return `<div class="rv-entry"><div class="rv-erow"><div class="rv-etitle">${escHtml(p.name)}</div><div class="rv-edate">${escHtml(date)}</div></div>${stack}${link}${desc}</div>`;
        })
        .join("");
    }

    case "edu": {
      const items = d.edu.filter((e) => e.school);
      if (!items.length) return `<div class="rv-empty">暂无教育经历</div>`;
      return items
        .map((e) => {
          const date = [e.s, e.e].filter(Boolean).join(" – ");
          const sub = [e.major, e.deg].filter(Boolean).join(" · ");
          return `<div class="rv-entry"><div class="rv-erow"><div class="rv-etitle">${escHtml(e.school)}</div><div class="rv-edate">${escHtml(date)}</div></div>${sub ? `<div class="rv-esub">${escHtml(sub)}</div>` : ""}</div>`;
        })
        .join("");
    }

    case "cert":
      if (!d.cert.trim()) return "";
      return `<div class="rv-cert-txt">${escHtml(d.cert)}</div>`;

    default:
      return "";
  }
}

const sectionsHtml = computed(() => {
  return d.sectionOrder
    .map((key) => {
      const html = buildSection(key);
      if (!html) return "";
      return `<div class="rv-sec"><div class="rv-sec-label">${SEC_META[key].title}</div><div class="rv-sec-rule"></div>${html}</div>`;
    })
    .filter(Boolean)
    .join("");
});

const metaHtml = computed(() => {
  const meta = [];
  if (d.phone) meta.push(`<span>📱 ${d.phone}</span>`);
  if (d.email) meta.push(`<span>✉ ${d.email}</span>`);
  if (d.city) meta.push(`<span>📍 ${d.city}</span>`);
  if (d.web) meta.push(`<span>🔗 ${d.web}</span>`);
  return meta.join("");
});

// ── Drag & Drop ──
function onDragStart(k) {
  dragSrc.value = k;
}

function onDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

function onDrop(e, key) {
  e.preventDefault();
  if (dragSrc.value && dragSrc.value !== key) {
    const srcIdx = d.sectionOrder.indexOf(dragSrc.value);
    const dstIdx = d.sectionOrder.indexOf(key);
    d.sectionOrder.splice(srcIdx, 1);
    d.sectionOrder.splice(dstIdx, 0, dragSrc.value);
    saveState();
  }
  dragSrc.value = null;
}

// ── Export PDF ──
function openExportModal() {
  exportFilename.value = d.name ? `${d.name}_简历` : "简历";
  showExportModal.value = true;
}

function closeModal() {
  showExportModal.value = false;
}

async function doExport() {
  const fname = exportFilename.value.trim() || "简历";
  closeModal();

  const resumeEl = document.getElementById("resume");
  if (!resumeEl) return;

  const { default: html2pdf } = await import("html2pdf.js");
  html2pdf()
    .set({
      margin: 0,
      filename: `${fname}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, allowTaint: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .from(resumeEl)
    .save();
}

// ── Init ──
onMounted(() => {
  loadState();
});
</script>

<template>
  <div class="profile-page">
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

    <!-- Export Modal -->
    <div
      class="modal-overlay"
      :class="{ show: showExportModal }"
      @click.self="closeModal"
    >
      <div class="modal">
        <h3>导出 PDF</h3>
        <div class="fg">
          <label class="fg-label">文件名</label>
          <input
            v-model="exportFilename"
            type="text"
            placeholder="如：张三_前端工程师_简历"
            @keydown.enter="doExport"
          />
        </div>
        <div class="modal-btns">
          <button class="btn-cancel" @click="closeModal">取消</button>
          <button class="btn-ok" @click="doExport">确认导出</button>
        </div>
      </div>
    </div>

    <div class="layout">
      <!-- ── EDITOR ── -->
      <div class="editor">
        <div class="editor-header">
          <button class="btn-export" @click="openExportModal">导出 PDF</button>
        </div>
        <div class="ed-tabs">
          <button
            v-for="tab in [
              { key: 'basic', label: '基本' },
              { key: 'skill', label: '技能' },
              { key: 'exp', label: '经历' },
              { key: 'proj', label: '项目' },
              { key: 'edu', label: '教育' },
              { key: 'order', label: '排序' },
            ]"
            :key="tab.key"
            class="ed-tab"
            :class="{ on: activeTab === tab.key }"
            @click="switchTab(tab.key)"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Basic -->
        <div class="tab-body" :class="{ on: activeTab === 'basic' }">
          <div class="photo-row">
            <div class="photo-fields">
              <div class="fg">
                <label class="fg-label">姓名</label>
                <input v-model="d.name" type="text" placeholder="你的名字" />
              </div>
              <div class="fg">
                <label class="fg-label">职位 / 求职意向</label>
                <input v-model="d.pos" type="text" placeholder="前端工程师" />
              </div>
            </div>
            <div>
              <div class="fg" style="margin-bottom: 4px">
                <label class="fg-label">照片</label>
              </div>
              <div class="photo-upload-area" @click="$refs.photoInput.click()">
                <template v-if="d.photo">
                  <img
                    :src="d.photo"
                    style="
                      width: 100%;
                      height: 100%;
                      object-fit: cover;
                      border-radius: 4px;
                    "
                  />
                </template>
                <template v-else>
                  <span class="ph-icon">📷</span>
                  <span class="ph-text">点击上传</span>
                </template>
              </div>
              <input
                ref="photoInput"
                type="file"
                accept="image/*"
                style="display: none"
                @change="uploadPhoto"
              />
              <button v-if="d.photo" class="btn-rm-photo" @click="removePhoto">
                ✕ 删除照片
              </button>
            </div>
          </div>
          <div class="g2">
            <div class="fg">
              <label class="fg-label">电话</label>
              <input v-model="d.phone" type="tel" placeholder="138xxxx8888" />
            </div>
            <div class="fg">
              <label class="fg-label">邮箱</label>
              <input v-model="d.email" type="email" placeholder="hi@me.com" />
            </div>
          </div>
          <div class="g2">
            <div class="fg">
              <label class="fg-label">城市</label>
              <input v-model="d.city" type="text" placeholder="上海" />
            </div>
            <div class="fg">
              <label class="fg-label">GitHub / 个人网站</label>
              <input v-model="d.web" type="text" placeholder="github.com/xxx" />
            </div>
          </div>
          <div class="fg">
            <label class="fg-label">个人简介</label>
            <textarea
              v-model="d.summary"
              placeholder="简述技术方向、年限及核心优势，2~3句即可…"
            ></textarea>
          </div>
        </div>

        <!-- Skill -->
        <div class="tab-body" :class="{ on: activeTab === 'skill' }">
          <div class="fg">
            <label class="fg-label">技术技能描述</label>
            <textarea
              v-model="d.skilltext"
              rows="10"
              placeholder="例如：&#10;编程语言：Go、Python、TypeScript&#10;后端框架：Gin、FastAPI、NestJS&#10;数据库：MySQL、PostgreSQL、Redis&#10;云服务：AWS、Docker、K8s&#10;其他：Git、CI/CD、微服务架构设计"
            ></textarea>
            <div class="field-hint">每行一类，直接展示在简历中。</div>
          </div>
          <div class="fg">
            <label class="fg-label">证书 / 荣誉</label>
            <textarea
              v-model="d.cert"
              rows="4"
              placeholder="例如：&#10;· AWS Solutions Architect Associate（2023）&#10;· 阿里云 ACA 云计算认证"
            ></textarea>
          </div>
        </div>

        <!-- Work Exp -->
        <div class="tab-body" :class="{ on: activeTab === 'exp' }">
          <div v-for="(item, i) in d.exp" :key="i" class="ecard">
            <div class="ecard-head">
              <span>经历 {{ i + 1 }}</span>
              <button class="btn-rm" @click="rmExp(i)">×</button>
            </div>
            <div class="fg">
              <label class="fg-label">公司名称</label>
              <input v-model="item.co" type="text" placeholder="字节跳动" />
            </div>
            <div class="fg">
              <label class="fg-label">职位</label>
              <input
                v-model="item.role"
                type="text"
                placeholder="高级前端工程师"
              />
            </div>
            <div class="g2">
              <div class="fg">
                <label class="fg-label">开始</label>
                <input v-model="item.s" type="text" placeholder="2022.03" />
              </div>
              <div class="fg">
                <label class="fg-label">结束</label>
                <input v-model="item.e" type="text" placeholder="至今" />
              </div>
            </div>
            <div class="fg">
              <label class="fg-label">工作内容（每行一条）</label>
              <textarea
                v-model="item.desc"
                placeholder="· 负责…&#10;· 优化…&#10;· 设计…"
              ></textarea>
            </div>
          </div>
          <button class="btn-add" @click="addExp">＋ 添加工作经历</button>
        </div>

        <!-- Projects -->
        <div class="tab-body" :class="{ on: activeTab === 'proj' }">
          <div v-for="(item, i) in d.proj" :key="i" class="ecard">
            <div class="ecard-head">
              <span>项目 {{ i + 1 }}</span>
              <button class="btn-rm" @click="rmProj(i)">×</button>
            </div>
            <div class="fg">
              <label class="fg-label">项目名称</label>
              <input
                v-model="item.name"
                type="text"
                placeholder="分布式任务调度平台"
              />
            </div>
            <div class="fg">
              <label class="fg-label">技术栈</label>
              <input
                v-model="item.stack"
                type="text"
                placeholder="Go · Kafka · Redis · K8s"
              />
            </div>
            <div class="fg">
              <label class="fg-label">项目链接（可选）</label>
              <input
                v-model="item.link"
                type="text"
                placeholder="github.com/xxx/project"
              />
            </div>
            <div class="g2">
              <div class="fg">
                <label class="fg-label">开始</label>
                <input v-model="item.s" type="text" placeholder="2023.06" />
              </div>
              <div class="fg">
                <label class="fg-label">结束</label>
                <input v-model="item.e" type="text" placeholder="2023.12" />
              </div>
            </div>
            <div class="fg">
              <label class="fg-label">项目描述（每行一条）</label>
              <textarea
                v-model="item.desc"
                placeholder="· 实现了…&#10;· 将…性能提升了…%&#10;· 负责…模块的设计与开发"
              ></textarea>
            </div>
          </div>
          <button class="btn-add" @click="addProj">＋ 添加项目经历</button>
        </div>

        <!-- Education -->
        <div class="tab-body" :class="{ on: activeTab === 'edu' }">
          <div v-for="(item, i) in d.edu" :key="i" class="ecard">
            <div class="ecard-head">
              <span>教育 {{ i + 1 }}</span>
              <button class="btn-rm" @click="rmEdu(i)">×</button>
            </div>
            <div class="fg">
              <label class="fg-label">学校</label>
              <input
                v-model="item.school"
                type="text"
                placeholder="上海交通大学"
              />
            </div>
            <div class="g2">
              <div class="fg">
                <label class="fg-label">专业</label>
                <input
                  v-model="item.major"
                  type="text"
                  placeholder="计算机科学与技术"
                />
              </div>
              <div class="fg">
                <label class="fg-label">学历</label>
                <input v-model="item.deg" type="text" placeholder="本科" />
              </div>
            </div>
            <div class="g2">
              <div class="fg">
                <label class="fg-label">开始</label>
                <input v-model="item.s" type="text" placeholder="2018.09" />
              </div>
              <div class="fg">
                <label class="fg-label">结束</label>
                <input v-model="item.e" type="text" placeholder="2022.06" />
              </div>
            </div>
          </div>
          <button class="btn-add" @click="addEdu">＋ 添加教育经历</button>
        </div>

        <!-- Section Order -->
        <div class="tab-body" :class="{ on: activeTab === 'order' }">
          <div class="order-panel">
            <h3>栏目顺序</h3>
            <div class="order-list">
              <div
                v-for="key in d.sectionOrder"
                :key="key"
                class="order-item"
                draggable="true"
                @dragstart="onDragStart(key)"
                @dragover="onDragOver($event, key)"
                @drop="onDrop($event, key)"
              >
                <span class="drag-handle">⠿</span>
                <span class="order-item-name">{{ SEC_META[key].label }}</span>
              </div>
            </div>
            <p class="order-hint">拖动调整顺序，预览实时更新。</p>
          </div>
        </div>
      </div>

      <!-- ── PREVIEW ── -->
      <div class="preview">
        <div id="resume">
          <div class="rv-inner">
            <div class="rv-head">
              <div class="rv-head-left">
                <div class="rv-name">
                  {{ d.name || "你的名字" }}
                </div>
                <div class="rv-pos">
                  {{ d.pos || "求职岗位" }}
                </div>
                <div class="rv-meta" v-html="metaHtml"></div>
              </div>
              <img v-if="d.photo" class="rv-photo" :src="d.photo" alt="" />
            </div>
            <div v-html="sectionsHtml"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 48px);
  margin: 0 -20px -20px;
  padding: 12px 20px 0;
  overflow: hidden;
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

/* ── LAYOUT ── */
.layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 0;
  flex: 1;
  min-height: 0;
}

/* ── EDITOR ── */
.editor {
  background: var(--bg-surface);
  border-right: 1px solid var(--border);
  overflow-y: auto;
  min-height: 0;
}

.editor-header {
  display: flex;
  justify-content: flex-end;
  padding: 10px 14px 0;
}

.btn-export {
  background: var(--text-primary);
  color: var(--bg-surface);
  font-size: 12px;
  padding: 6px 18px;
  border-radius: 5px;
  letter-spacing: 0.5px;
  border: none;
  cursor: pointer;
  transition: opacity 0.15s;
}

.btn-export:hover {
  opacity: 0.75;
}

.ed-tabs {
  display: flex;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  background: var(--bg-surface);
  z-index: 10;
}

.ed-tab {
  flex: 1;
  padding: 11px 4px;
  font-size: 11px;
  letter-spacing: 0.3px;
  color: var(--text-muted);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.15s;
}

.ed-tab:hover {
  color: var(--text-primary);
}

.ed-tab.on {
  color: var(--accent);
  border-bottom-color: var(--accent);
  font-weight: 500;
}

.tab-body {
  display: none;
  padding: 20px 18px 28px;
}

.tab-body.on {
  display: block;
}

.fg {
  margin-bottom: 14px;
}

.fg-label {
  display: block;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 5px;
}

input[type="text"],
input[type="email"],
input[type="tel"],
textarea {
  width: 100%;
  background: var(--bg-base, var(--bg-hover));
  border: 1px solid var(--border);
  border-radius: 5px;
  padding: 8px 11px;
  font-family: inherit;
  font-size: 13px;
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.15s;
}

input:focus,
textarea:focus {
  border-color: var(--accent);
  background: var(--bg-surface);
}

textarea {
  resize: vertical;
  min-height: 68px;
  line-height: 1.6;
}

.g2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.field-hint {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 5px;
  line-height: 1.4;
}

/* Entry cards */
.ecard {
  border: 1px solid var(--border);
  border-radius: 7px;
  padding: 13px;
  margin-bottom: 10px;
  background: var(--bg-hover);
}

.ecard-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 11px;
}

.ecard-head span {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
}

.btn-rm {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fee2e2;
  color: #dc2626;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
}

.btn-rm:hover {
  background: #fecaca;
}

.btn-add {
  width: 100%;
  padding: 9px;
  background: none;
  border: 1.5px dashed var(--border);
  border-radius: 6px;
  color: var(--text-muted);
  font-size: 12px;
  letter-spacing: 0.5px;
  transition: all 0.15s;
  margin-top: 2px;
  cursor: pointer;
}

.btn-add:hover {
  border-color: var(--accent);
  color: var(--accent);
}

/* Section order manager */
.order-panel {
  padding: 0;
}

.order-panel h3 {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-hover);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 9px 12px;
  cursor: grab;
  user-select: none;
  transition:
    box-shadow 0.15s,
    border-color 0.15s;
  font-size: 13px;
}

.order-item:active {
  cursor: grabbing;
}

.drag-handle {
  color: var(--text-muted);
  font-size: 16px;
  line-height: 1;
  flex-shrink: 0;
}

.order-item-name {
  flex: 1;
  font-weight: 500;
}

.order-hint {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 10px;
  line-height: 1.5;
}

/* Photo upload */
.photo-upload-area {
  width: 100%;
  aspect-ratio: 3 / 4;
  max-width: 120px;
  border: 1.5px dashed var(--border);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.15s;
  background: var(--bg-hover);
  overflow: hidden;
  position: relative;
}

.photo-upload-area:hover {
  border-color: var(--accent);
}

.ph-icon {
  font-size: 24px;
  color: var(--text-muted);
}

.ph-text {
  font-size: 11px;
  color: var(--text-muted);
  text-align: center;
}

.photo-row {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.photo-row .photo-fields {
  flex: 1;
}

.btn-rm-photo {
  font-size: 11px;
  color: #dc2626;
  background: none;
  border: none;
  margin-top: 4px;
  padding: 2px 0;
  cursor: pointer;
}

/* Export modal */
.modal-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 500;
  align-items: center;
  justify-content: center;
}

.modal-overlay.show {
  display: flex;
}

.modal {
  background: var(--bg-surface);
  border-radius: 10px;
  padding: 24px 28px;
  width: 340px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.18);
}

.modal h3 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 16px;
}

.modal .fg {
  margin-bottom: 16px;
}

.modal-btns {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
}

.btn-cancel {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 8px 18px;
  border-radius: 5px;
  font-size: 13px;
  cursor: pointer;
}

.btn-ok {
  background: var(--text-primary);
  color: var(--bg-surface);
  padding: 8px 20px;
  border-radius: 5px;
  font-size: 13px;
  border: none;
  cursor: pointer;
}

/* ── PREVIEW ── */
.preview {
  background: #dddbd4;
  padding: 36px 32px;
  display: flex;
  justify-content: center;
  overflow-y: auto;
  min-height: 0;
}

@media (max-width: 768px) {
  .profile-page {
    height: auto;
    min-height: calc(100vh - 48px);
    overflow: visible;
  }

  .layout {
    grid-template-columns: 1fr;
  }

  .editor {
    border-right: none;
    border-bottom: 1px solid var(--border);
    max-height: 50vh;
  }

  .preview {
    padding: 16px;
  }

  #resume {
    width: 100%;
    min-height: auto;
  }
}
</style>

<style>
/* ══ RESUME ══ */
#resume {
  width: 210mm;
  min-height: 297mm;
  background: #fff;
  box-shadow: 0 2px 32px rgba(0, 0, 0, 0.15);
  padding: 0;
  font-family: "DM Sans", "Noto Sans SC", sans-serif;
  font-size: 11pt;
  color: #18181b;
}

.rv-inner {
  padding: 40px 50px 52px;
}

.rv-head {
  margin-bottom: 22px;
  padding-bottom: 16px;
  border-bottom: 2px solid #18181b;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.rv-head-left {
  flex: 1;
}

.rv-name {
  font-family: "Noto Serif SC", serif;
  font-size: 26pt;
  font-weight: 600;
  color: #18181b;
  line-height: 1.15;
}

.rv-pos {
  font-size: 12pt;
  font-weight: 500;
  color: #3f3f46;
  margin-top: 5px;
}

.rv-meta {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 3px 20px;
  font-size: 10pt;
  color: #52525b;
}

.rv-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.rv-photo {
  width: 80px;
  height: 107px;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid #e4e4e7;
}

.rv-sec {
  margin-bottom: 20px;
}

.rv-sec-label {
  display: block;
  font-size: 12pt;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #18181b;
  margin-bottom: 4px;
  padding-left: 10px;
  border-left: 3px solid #18181b;
}

.rv-sec-rule {
  height: 1px;
  background: #e4e4e7;
  margin-bottom: 11px;
}

.rv-summary,
.rv-skill-txt,
.rv-cert-txt {
  font-size: 10.5pt;
  color: #3f3f46;
  line-height: 1.85;
  white-space: pre-wrap;
}

.rv-entry {
  margin-bottom: 13px;
  padding-bottom: 13px;
  border-bottom: 1px solid #f0f0f0;
}

.rv-entry:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.rv-erow {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.rv-etitle {
  font-size: 11pt;
  font-weight: 700;
  color: #18181b;
}

.rv-edate {
  font-size: 10pt;
  color: #71717a;
  white-space: nowrap;
  margin-left: 8px;
}

.rv-esub {
  font-size: 10.5pt;
  font-weight: 500;
  color: #3f3f46;
  margin: 3px 0 5px;
}

.rv-elink {
  font-size: 10pt;
  color: #3f3f46;
  margin-bottom: 5px;
  word-break: break-all;
}

.rv-estack {
  font-size: 10pt;
  color: #52525b;
  margin-bottom: 5px;
}

.rv-edesc {
  font-size: 10pt;
  color: #3f3f46;
  line-height: 1.7;
}

.rv-edesc ul {
  padding-left: 15px;
}

.rv-edesc li {
  margin-bottom: 3px;
}

.rv-empty {
  color: #d4d4d8;
  font-size: 10pt;
  font-style: italic;
}
</style>
