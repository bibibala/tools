<template>
    <div class="regex-visualizer">
        <header class="app-header">
            <h1>正则表达式可视化工具</h1>
            <p>实时调试正则表达式，可视化匹配过程</p>
        </header>

        <main class="main-content">
            <section class="input-section">
                <div class="regex-input-group">
                    <label for="regex-pattern">正则表达式</label>
                    <div class="regex-input-wrapper">
                        <input
                            id="regex-pattern"
                            v-model="regexPattern"
                            type="text"
                            placeholder="输入正则表达式，例如: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                        />
                        <div class="regex-flags">
                            <button
                                @click="toggleFlag('g')"
                                class="flag-btn"
                                :class="{ active: flags.includes('g') }"
                            >
                                g
                            </button>
                            <button
                                @click="toggleFlag('i')"
                                class="flag-btn"
                                :class="{ active: flags.includes('i') }"
                            >
                                i
                            </button>
                            <button
                                @click="toggleFlag('m')"
                                class="flag-btn"
                                :class="{ active: flags.includes('m') }"
                            >
                                m
                            </button>
                        </div>
                    </div>
                </div>

                <div class="test-text-group">
                    <label for="test-text">测试文本</label>
                    <textarea
                        id="test-text"
                        v-model="testText"
                        rows="4"
                        placeholder="输入要测试的文本..."
                    ></textarea>
                </div>
            </section>

            <section class="results-section">
                <div class="results-header">
                    <h2>匹配结果</h2>
                    <div class="match-stats">
                        <span>匹配次数: {{ matches.length }}</span>
                        <span v-if="errorMessage" class="error-message">{{
                            errorMessage
                        }}</span>
                    </div>
                </div>

                <div class="highlighted-text">
                    <p v-if="highlightedText.length">
                        <span
                            v-for="(part, index) in highlightedText"
                            :key="index"
                            :class="{ 'match-highlight': part.matched }"
                        >
                            {{ part.text }}
                        </span>
                    </p>
                    <p v-else-if="!errorMessage && testText">没有匹配结果</p>
                </div>

                <div class="match-details">
                    <h3>匹配详情</h3>
                    <div
                        class="match-item"
                        v-for="(match, index) in matches"
                        :key="index"
                    >
                        <div class="match-index">#{{ index + 1 }}</div>
                        <div class="match-value">
                            <strong>匹配值:</strong> {{ match[0] }}
                        </div>
                        <div class="match-position">
                            <strong>位置:</strong> {{ match.index }} -
                            {{ match.index + match[0].length }}
                        </div>
                        <div v-if="match.length > 1" class="match-groups">
                            <strong>分组:</strong>
                            <div class="groups-list">
                                <div
                                    v-for="(group, gIndex) in match.slice(1)"
                                    :key="gIndex"
                                >
                                    分组 {{ gIndex + 1 }}:
                                    {{ group || "无匹配" }}
                                </div>
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

// 切换正则表达式标志
const toggleFlag = (flag) => {
    if (flags.value.includes(flag)) {
        flags.value = flags.value.filter((f) => f !== flag);
    } else {
        flags.value.push(flag);
    }
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

// 监听正则表达式或测试文本变化，重新处理匹配
watch([regexPattern, flags, testText], processMatches, { immediate: true });
</script>

<style>
.regex-visualizer {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    color: #333;
    line-height: 1.6;
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
    gap: 30px;
}

@media (min-width: 768px) {
    .main-content {
        grid-template-columns: 1fr 1fr;
    }
}

.input-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.regex-input-group,
.test-text-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

label {
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.9rem;
}

#regex-pattern,
#test-text {
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: inherit;
    font-size: 1rem;
    transition: border-color 0.2s;
}

#regex-pattern:focus,
#test-text:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

#test-text {
    resize: vertical;
}

.regex-input-wrapper {
    display: flex;
}

#regex-pattern {
    flex: 1;
    border-right: none;
    border-radius: 4px 0 0 4px;
}

.regex-flags {
    display: flex;
    background-color: #f8f9fa;
    border: 1px solid #ddd;
    border-left: none;
    border-radius: 0 4px 4px 0;
    overflow: hidden;
}

.flag-btn {
    border: none;
    background: none;
    padding: 0 12px;
    cursor: pointer;
    font-weight: 600;
    color: #7f8c8d;
    transition: all 0.2s;
}

.flag-btn:hover {
    background-color: #e9ecef;
}

.flag-btn.active {
    background-color: #3498db;
    color: white;
}

.results-section {
    background-color: #f8f9fa;
    border-radius: 6px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e9ecef;
}

.results-header h2 {
    margin: 0;
    color: #2c3e50;
    font-size: 1.3rem;
}

.match-stats {
    font-size: 0.9rem;
    color: #7f8c8d;
}

.error-message {
    color: #e74c3c;
    margin-left: 10px;
}

.highlighted-text {
    background-color: white;
    padding: 15px;
    border-radius: 4px;
    margin-bottom: 20px;
    border: 1px solid #e9ecef;
    min-height: 60px;
    white-space: pre-wrap;
    word-break: break-all;
}

.match-highlight {
    background-color: #fff3cd;
    padding: 2px 0;
    border-radius: 2px;
    color: #856404;
    font-weight: 500;
}

.match-details h3 {
    margin-top: 0;
    color: #2c3e50;
    font-size: 1.1rem;
    margin-bottom: 15px;
}

.match-item {
    background-color: white;
    padding: 12px;
    border-radius: 4px;
    margin-bottom: 10px;
    border: 1px solid #e9ecef;
    transition:
        transform 0.2s,
        box-shadow 0.2s;
}

.match-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.match-index {
    font-weight: bold;
    color: #3498db;
    margin-bottom: 5px;
}

.match-groups {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px dashed #eee;
}

.groups-list {
    margin-top: 5px;
    padding-left: 15px;
    font-size: 0.9rem;
}

.groups-list div {
    margin-bottom: 3px;
    color: #555;
}
</style>
