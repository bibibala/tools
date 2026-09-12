<script setup>
import * as XLSX from "xlsx";
import { computed, watch, ref, nextTick, onMounted, onUnmounted } from "vue";

const props = defineProps({
  worksheet: { type: Object, default: null },
});

const emit = defineEmits(["renderedHtml"]);

function sanitizeTableHtml(html) {
  const tpl = document.createElement("template");
  tpl.innerHTML = html;
  let table = tpl.content.querySelector("table");
  if (!table) {
    try {
      const doc = new DOMParser().parseFromString(html, "text/html");
      table = doc.querySelector("table");
    } catch {
      table = null;
    }
  }

  if (table) {
    const all = table.querySelectorAll("*");
    all.forEach((el) => {
      const allow = new Set(["rowspan", "colspan"]);
      Array.from(el.attributes).forEach((attr) => {
        if (!allow.has(attr.name.toLowerCase())) {
          el.removeAttribute(attr.name);
        }
      });
    });
    return table.outerHTML;
  }

  return html
    .replace(/\s(id|class|data-t|data-v)=(("[^"]*")|('[^']*')|[^\s>]+)/g, "")
    .replace(/\s"=?""/g, "")
    .replace(/=""/g, "")
    .replace(/\s""/g, "")
    .replace(/\s{2,}/g, " ");
}

const tableHtml = computed(() => {
  if (!props.worksheet) return "";
  const raw = XLSX.utils.sheet_to_html(props.worksheet, {
    editable: false,
  });
  return sanitizeTableHtml(raw);
});

const containerRef = ref(null);
const contentRef = ref(null);
let ro = null;

const containerHeight = ref(null);

async function updateHeight() {
  await nextTick();
  const c = containerRef.value;
  const el = contentRef.value;
  if (!c || !el) return;
  const parent = c.parentElement;
  const parentHeight = parent?.clientHeight ?? c.clientHeight;
  const contentHeight = el.scrollHeight;
  containerHeight.value = Math.min(contentHeight, parentHeight);
}

watch(
  tableHtml,
  async (html) => {
    if (html) emit("renderedHtml", html);
    await updateHeight();
  },
  { immediate: true },
);

onMounted(() => {
  ro = new ResizeObserver(() => updateHeight());
  const target = containerRef.value?.parentElement ?? containerRef.value;
  if (target && ro) ro.observe(target);
});

onUnmounted(() => {
  const target = containerRef.value?.parentElement ?? containerRef.value;
  if (ro && target) ro.unobserve(target);
});
</script>

<template>
  <div v-if="tableHtml" ref="containerRef">
    <div ref="contentRef" v-html="tableHtml"></div>
  </div>
</template>

<style scoped>
:deep(table) {
  border-collapse: collapse;
  width: 100%;
  table-layout: fixed;
}

:deep(td),
:deep(th) {
  border: 1px solid #ddd;
  padding: 8px 12px;
  text-align: center;
  vertical-align: middle;
  word-break: break-word;
  white-space: normal;
}

:deep(tbody tr:nth-child(-n + 2) td) {
  font-weight: 600;
}

:deep(tr:hover) {
  background-color: #27272a;
}
</style>
