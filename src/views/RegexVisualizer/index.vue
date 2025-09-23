<template>
    <div class="tool-page">
        <header class="tool-header">
            <h1>正则表达式可视化工具</h1>
            <p>实时调试正则表达式，可视化匹配过程</p>
        </header>

        <main class="main-content">
            <section class="tool-section">
                <!-- 预设正则表达式 -->
                <div class="config-item">
                    <label class="section-label">常用正则表达式</label>
                    <div class="preset-regex-grid">
                        <button
                            v-for="preset in presetRegexes"
                            :key="preset.name"
                            @click="applyPreset(preset)"
                            class="btn btn-secondary preset-btn"
                            :title="preset.description"
                        >
                            {{ preset.name }}
                        </button>
                    </div>
                    <p class="form-hint">
                        点击选择常用正则表达式模板，快速开始调试
                    </p>
                </div>

                <div class="config-item">
                    <label class="section-label" for="regex-pattern"
                        >正则表达式</label
                    >
                    <div class="regex-input-wrapper">
                        <input
                            id="regex-pattern"
                            v-model="regexPattern"
                            type="text"
                            placeholder="输入正则表达式，例如: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                            class="form-input"
                        />
                        <div class="regex-flags">
                            <button
                                @click="toggleFlag('g')"
                                class="flag-btn btn"
                                :class="{ active: flags.includes('g') }"
                            >
                                g
                            </button>
                            <button
                                @click="toggleFlag('i')"
                                class="flag-btn btn"
                                :class="{ active: flags.includes('i') }"
                            >
                                i
                            </button>
                            <button
                                @click="toggleFlag('m')"
                                class="flag-btn btn"
                                :class="{ active: flags.includes('m') }"
                            >
                                m
                            </button>
                        </div>
                    </div>
                </div>

                <div class="config-item">
                    <label class="section-label" for="test-text"
                        >测试文本</label
                    >
                    <input
                        id="test-text"
                        v-model="testText"
                        type="text"
                        placeholder="输入要测试的文本..."
                        class="form-input"
                    />
                </div>
            </section>

            <section class="tool-section">
                <div class="results-header">
                    <h2 class="section-title">匹配结果</h2>
                    <div class="match-stats">
                        <span>匹配次数: {{ matches.length }}</span>
                        <span v-if="errorMessage" class="status-error">{{
                            errorMessage
                        }}</span>
                    </div>
                </div>

                <div class="highlighted-text">
                    <div
                        v-if="highlightedText.length"
                        class="highlight-content"
                    >
                        <span
                            v-for="(part, index) in highlightedText"
                            :key="index"
                            :class="{ 'match-highlight': part.matched }"
                        >
                            {{ part.text }}
                        </span>
                    </div>
                    <div
                        v-else-if="!errorMessage && testText"
                        class="text-muted"
                    >
                        没有匹配结果
                    </div>
                </div>

                <div class="match-details" v-if="matches.length > 0">
                    <h3 class="section-title">匹配详情</h3>
                    <div class="match-list">
                        <div
                            class="match-item"
                            v-for="(match, index) in matches"
                            :key="index"
                        >
                            <span class="match-index status-info"
                                >#{{ index + 1 }}</span
                            >
                            <span class="match-value">{{ match[0] }}</span>
                            <span class="match-position text-muted"
                                >位置: {{ match.index }}-{{
                                    match.index + match[0].length
                                }}</span
                            >
                            <div v-if="match.length > 1" class="match-groups">
                                <span
                                    v-for="(group, gIndex) in match.slice(1)"
                                    :key="gIndex"
                                    class="group-item"
                                >
                                    分组{{ gIndex + 1 }}: {{ group || "无" }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import useToast from "@/utils/useToast.js";

// 正则表达式相关状态
const regexPattern = ref("");
const flags = ref([]);
const testText = ref("");
const matches = ref([]);
const errorMessage = ref("");
const highlightedText = ref([]);

// 预设正则表达式
const presetRegexes = ref([
    {
        name: "邮箱地址",
        pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
        flags: [],
        description: "匹配标准邮箱地址格式",
    },
    {
        name: "手机号码",
        pattern: "^1[3-9]\\d{9}$",
        flags: [],
        description: "匹配中国大陆手机号码",
    },
    {
        name: "身份证号",
        pattern:
            "^[1-9]\\d{5}(18|19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$",
        flags: [],
        description: "匹配18位身份证号码",
    },
    {
        name: "URL链接",
        pattern:
            "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)",
        flags: ["g"],
        description: "匹配HTTP/HTTPS URL链接",
    },
    {
        name: "IP地址",
        pattern:
            "^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",
        flags: [],
        description: "匹配IPv4地址",
    },
    {
        name: "中文字符",
        pattern: "[\\u4e00-\\u9fa5]+",
        flags: ["g"],
        description: "匹配中文字符",
    },
    {
        name: "数字",
        pattern: "\\d+",
        flags: ["g"],
        description: "匹配连续数字",
    },
    {
        name: "小数",
        pattern: "\\d+\\.\\d+",
        flags: ["g"],
        description: "匹配小数格式",
    },
    {
        name: "HTML标签",
        pattern: "<[^>]+>",
        flags: ["g"],
        description: "匹配HTML标签",
    },
    {
        name: "日期格式",
        pattern: "\\d{4}-\\d{2}-\\d{2}",
        flags: ["g"],
        description: "匹配YYYY-MM-DD日期格式",
    },
]);

// 切换正则表达式标志
const toggleFlag = (flag) => {
    if (flags.value.includes(flag)) {
        flags.value = flags.value.filter((f) => f !== flag);
    } else {
        flags.value.push(flag);
    }
};

// 应用预设正则表达式
const applyPreset = (preset) => {
    regexPattern.value = preset.pattern;
    flags.value = [...preset.flags];
};

// 计算当前正则表达式
const currentRegex = computed(() => {
    try {
        if (!regexPattern.value) return null;
        return new RegExp(regexPattern.value, flags.value.join(""));
    } catch (err) {
        useToast.showInfo(`正则表达式错误: ${err.message}`);
        return null;
    }
});

// 处理匹配并生成高亮文本
const processMatches = () => {
    errorMessage.value = "";
    matches.value = [];
    highlightedText.value = [];

    if (!currentRegex.value || !testText.value) return;

    try {
        // 重置正则表达式的lastIndex，确保每次都从开头匹配
        currentRegex.value.lastIndex = 0;

        // 获取所有匹配
        let match;
        const allMatches = [];
        while ((match = currentRegex.value.exec(testText.value)) !== null) {
            allMatches.push(match);
            // 如果没有全局标志，只匹配一次
            if (!flags.value.includes("g")) break;
        }
        matches.value = allMatches;

        // 生成高亮文本
        if (allMatches.length > 0) {
            let lastIndex = 0;
            const parts = [];

            allMatches.forEach((match) => {
                // 添加匹配前的文本
                if (match.index > lastIndex) {
                    parts.push({
                        text: testText.value.substring(lastIndex, match.index),
                        matched: false,
                    });
                }

                // 添加匹配的文本
                parts.push({
                    text: match[0],
                    matched: true,
                });

                lastIndex = match.index + match[0].length;
            });

            // 添加剩余的文本
            if (lastIndex < testText.value.length) {
                parts.push({
                    text: testText.value.substring(lastIndex),
                    matched: false,
                });
            }

            highlightedText.value = parts;
        }
    } catch (err) {
        errorMessage.value = `匹配错误: ${err.message}`;
    }
};

watch([regexPattern, flags, testText], processMatches, { immediate: true });
</script>

<style scoped>
.main-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-2xl);
}

@media (min-width: 768px) {
    .main-content {
        grid-template-columns: 1fr;
    }
}

.regex-input-wrapper {
    display: flex;
}

#regex-pattern {
    flex: 1;
    border-right: none;
    border-radius: var(--radius) 0 0 var(--radius);
}

.regex-flags {
    display: flex;
    background-color: var(--bg-secondary);
    border: 1px solid var(--border);
    border-left: none;
    border-radius: 0 var(--radius) var(--radius) 0;
    overflow: hidden;
}

.flag-btn {
    border: none;
    background: none;
    padding: 0 var(--space);
    cursor: pointer;
    font-weight: var(--font-weight-semibold);
    color: var(--text-secondary);
    transition: all 0.2s ease;
    min-height: auto;
}

.flag-btn:hover {
    background-color: var(--hover-bg);
}

.flag-btn.active {
    background-color: var(--info);
    color: white;
}

.preset-regex-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: var(--space-sm);
    margin-bottom: var(--space-sm);
    width: 100%;
    box-sizing: border-box;
}

.preset-btn {
    font-size: var(--font-size-xs);
    padding: var(--space-xs) var(--space-sm);
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.preset-btn:hover {
    background-color: var(--accent);
    color: white;
    border-color: var(--accent);
}

/* 移动端适配 */
@media (max-width: 768px) {
    .preset-regex-grid {
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
        gap: var(--space-xs);
    }

    .preset-btn {
        font-size: 11px;
        padding: var(--space-xs);
        min-height: 32px;
    }

    .regex-input-wrapper {
        flex-direction: column;
    }

    #regex-pattern {
        border-right: 1px solid var(--border);
        border-radius: var(--radius);
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
    }

    .regex-flags {
        border-left: 1px solid var(--border);
        border-top: none;
        border-radius: 0 0 var(--radius) var(--radius);
        justify-content: center;
    }

    .flag-btn {
        flex: 1;
        padding: var(--space-sm);
    }
}

@media (max-width: 480px) {
    .preset-regex-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 6px;
    }

    .preset-btn {
        font-size: 10px;
        padding: 6px 4px;
        min-height: 28px;
    }
}

/* 优化匹配结果显示 */
.highlighted-text {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px;
    min-height: 40px;
    display: flex;
    align-items: center;
}

.highlight-content {
    line-height: 1.5;
    word-break: break-all;
}

/* 优化匹配详情 */
.match-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.match-item {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 8px 12px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    font-size: 14px;
}

.match-index {
    font-weight: bold;
    min-width: 30px;
}

.match-value {
    font-family: monospace;
    background: var(--bg-secondary);
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 500;
}

.match-position {
    font-size: 12px;
}

.match-groups {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    width: 100%;
    margin-top: 4px;
}

.group-item {
    background: var(--bg-secondary);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    font-family: monospace;
}

.results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-lg);
}

.results-header .section-title {
    margin: 0;
    padding: 0;
    border: none;
}

.match-stats {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
}

.highlighted-text {
    min-height: 60px;
    white-space: pre-wrap;
    word-break: break-all;
    margin-bottom: var(--space-xl);
}

.match-highlight {
    padding: 2px 3px;
    border-radius: var(--radius-sm);
    color: var(--info);
    font-weight: var(--font-weight-medium);
}

.text-muted {
    color: var(--error);
}

.match-details .section-title {
    margin-top: 0;
    margin-bottom: var(--space-lg);
}

.match-item {
    margin-bottom: var(--space-md);
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
}

.match-item:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.match-index {
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--space-xs);
}

.match-value,
.match-position {
    margin-bottom: var(--space-xs);
}

.match-groups {
    margin-top: var(--space-sm);
    padding-top: var(--space-sm);
    border-top: 1px dashed var(--border);
}

.groups-list div {
    margin-bottom: var(--space-xs);
    color: var(--text-secondary);
}
</style>
