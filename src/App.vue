<template>
    <div class="app-shell">
        <header class="app-bar">
            <div class="header-left">
                <div class="logo-container">
                    <img :src="logo" alt="MyTools Logo" class="logo-img" />
                </div>

                <div class="dropdown-container">
                    <button
                        class="dropdown-btn"
                        @click.stop="isMenuOpen = !isMenuOpen"
                        aria-label="打开工具菜单"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <line x1="4" x2="20" y1="6" y2="6"></line>
                            <line x1="4" x2="20" y1="12" y2="12"></line>
                            <line x1="4" x2="20" y1="18" y2="18"></line>
                        </svg>
                        <span class="btn-text">工具菜单</span>
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            class="dropdown-arrow"
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                    <div
                        class="dropdown-menu"
                        :class="{ show: isMenuOpen }"
                        ref="dropdownMenu"
                    >
                        <!-- 菜单选项保持不变 -->
                        <RouterLink
                            to="/json-to-interface"
                            class="dropdown-item"
                            active-class="active"
                            @click.stop="isMenuOpen = false"
                        >
                            json转Ts接口
                        </RouterLink>

                        <RouterLink
                            to="/json"
                            class="dropdown-item"
                            active-class="active"
                            @click.stop="isMenuOpen = false"
                        >
                            json格式化
                        </RouterLink>
                        <RouterLink
                            to="/color"
                            class="dropdown-item"
                            active-class="active"
                            @click.stop="isMenuOpen = false"
                        >
                            颜色处理
                        </RouterLink>
                        <RouterLink
                            to="/file"
                            class="dropdown-item"
                            active-class="active"
                            @click.stop="isMenuOpen = false"
                        >
                            文件处理
                        </RouterLink>
                        <RouterLink
                            to="/"
                            class="dropdown-item"
                            active-class="active"
                            @click.stop="isMenuOpen = false"
                        >
                            正则工具
                        </RouterLink>
                        <RouterLink
                            to="/prettier"
                            class="dropdown-item"
                            active-class="active"
                            @click.stop="isMenuOpen = false"
                        >
                            prettier配置
                        </RouterLink>
                        <RouterLink
                            to="/web-meta"
                            class="dropdown-item"
                            active-class="active"
                            @click.stop="isMenuOpen = false"
                        >
                            网站元信息配置
                        </RouterLink>
                    </div>
                </div>
            </div>
            <div class="header-right">
                <a
                    :href="REPO_URL"
                    target="_blank"
                    style="text-decoration: none"
                >
                    <div class="github-info">
                        <img :src="github" alt="GitHub" class="github-img" />
                        <span class="update-time"
                            >Last updated: {{ lastUpdateTime }}</span
                        >
                        <span class="star-count">⭐ {{ star }}</span>
                    </div>
                </a>
            </div>
        </header>

        <main class="content">
            <router-view />
        </main>

        <footer class="footer">© {{ year }} MyTools</footer>
    </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
import github from "@/assets/github.png";
import logo from "@/assets/logo.svg";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { getRepoUpdateTime, getStar, REPO_URL } from "@/utils/useGetRepo.js";

const year = ref(new Date().getFullYear());
const lastUpdateTime = ref("2024-01-01");
const star = ref(0);

onMounted(async () => {
    star.value = await getStar();
    lastUpdateTime.value = await getRepoUpdateTime();
});

const isMenuOpen = ref(false);
const dropdownMenu = ref(null);

const handleClickOutside = (e) => {
    if (
        dropdownMenu.value &&
        !dropdownMenu.value.contains(e.target) &&
        !e.target.closest(".dropdown-btn")
    ) {
        isMenuOpen.value = false;
    }
};

const handleWindowChange = () => {
    if (isMenuOpen.value) isMenuOpen.value = false;
};

onMounted(() => {
    document.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", handleWindowChange);
    window.addEventListener("resize", handleWindowChange);
});

onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
    window.removeEventListener("scroll", handleWindowChange);
    window.removeEventListener("resize", handleWindowChange);
});
</script>

<style>
:root {
    /* 基础颜色 */
    --bg: #ffffff;
    --bg-secondary: #f8f9fa;
    --text: #1f2937;
    --text-secondary: #6b7280;
    --text-muted: #9ca3af;
    --border: #e5e7eb;
    --border-light: #f3f4f6;
    --accent: #111827;
    --accent-light: #374151;
    --hover-bg: #f3f4f6;

    /* 功能颜色 */
    --success: #10b981;
    --warning: #f59e0b;
    --error: #ef4444;
    --info: #3b82f6;

    /* 阴影 */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    --shadow-md:
        0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg:
        0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

    /* 圆角 */
    --radius-sm: 4px;
    --radius: 6px;
    --radius-md: 8px;
    --radius-lg: 12px;

    /* 间距 */
    --space-xs: 4px;
    --space-sm: 8px;
    --space: 12px;
    --space-md: 16px;
    --space-lg: 20px;
    --space-xl: 24px;
    --space-2xl: 32px;
    --space-3xl: 40px;

    /* 字体 */
    --font-size-xs: 12px;
    --font-size-sm: 14px;
    --font-size: 16px;
    --font-size-lg: 18px;
    --font-size-xl: 20px;
    --font-size-2xl: 24px;
    --font-size-3xl: 28px;

    /* 字重 */
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html,
body,
#app {
    height: 100%;
}

body {
    background: var(--bg);
    color: var(--text);
    font-family:
        -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
        Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji",
        "Segoe UI Symbol", "Noto Color Emoji", sans-serif;
}

.app-shell {
    min-height: 100vh;
    display: grid;
    grid-template-rows: auto 1fr auto;
}

.app-bar {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px; /* 稍微减少垂直内边距 */
    border-bottom: 1px solid var(--border);
    backdrop-filter: saturate(180%) blur(8px);
    background: rgba(255, 255, 255, 0.8);
    height: 56px;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.logo-container {
    display: flex;
    align-items: center;
}

.logo-img {
    height: 38px;
    width: auto;
    object-fit: contain;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.dropdown-container {
    position: relative;
    display: inline-block;
    z-index: 20;
}

.dropdown-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text);
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
}

.dropdown-btn:hover {
    background: var(--hover-bg);
    border-color: #d1d5db;
}

.dropdown-btn .btn-text {
    font-weight: 500;
}

.dropdown-arrow {
    transition: transform 0.2s ease;
}

.dropdown-container .show + .dropdown-btn .dropdown-arrow {
    transform: rotate(180deg);
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 180px;
    margin-top: 4px;
    padding: 6px 0;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    display: none;
    flex-direction: column;
    overflow: hidden;
}

.dropdown-menu.show {
    display: flex;
}

.dropdown-item {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    color: var(--text-muted);
    text-decoration: none;
    font-size: 14px;
    transition: all 0.15s ease;
}

.dropdown-item:hover {
    background: var(--hover-bg);
    color: var(--accent);
    padding-left: 18px;
}

.dropdown-item.active {
    background: var(--accent);
    color: #fff;
}

.dropdown-item.active:hover {
    background: #1f2937;
    padding-left: 16px;
}

.header-right {
    display: flex;
    align-items: center;
}

.github-info {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-muted);
    font-size: 12px;
}

.github-info svg {
    flex-shrink: 0;
}

.update-time {
    font-size: 13px;
    white-space: nowrap;
    font-weight: 500;
}

.content {
    padding: 16px;
    max-width: 1100px;
    margin: 0 auto;
    width: 100%;
}

.github-img {
    width: 24px;
    height: 24px;
}

.star-count {
    margin-left: 4px;
    font-weight: 500;
    font-size: 16px;
}

.footer {
    padding: var(--space-md);
    border-top: 1px solid var(--border);
    color: var(--text-muted);
    text-align: center;
    font-size: var(--font-size-xs);
}

/* 统一组件样式 */
.tool-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--space-xl);
    color: var(--text);
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

.tool-section {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: var(--space-xl);
    margin-bottom: var(--space-2xl);
    box-shadow: var(--shadow-sm);
}

.section-title {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    color: var(--accent);
    margin-bottom: var(--space-lg);
    padding-bottom: var(--space-sm);
    border-bottom: 1px solid var(--border);
}

.section-label {
    display: block;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--text);
    margin-bottom: var(--space-sm);
}

/* 统一按钮样式 */
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
    background: var(--hover-bg);
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

.btn-primary:hover {
    background: var(--accent-light);
    border-color: var(--accent-light);
}

.btn-secondary {
    background: var(--bg-secondary);
    color: var(--text);
    border-color: var(--border);
}

.btn-success {
    background: var(--success);
    color: white;
    border-color: var(--success);
}

.btn-warning {
    background: var(--warning);
    color: white;
    border-color: var(--warning);
}

.btn-error {
    background: var(--error);
    color: white;
    border-color: var(--error);
}

/* 统一输入框样式 */
.form-input {
    width: 100%;
    padding: var(--space-sm) var(--space);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--bg);
    color: var(--text);
    font-size: var(--font-size);
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
    box-sizing: border-box;
}

.form-input:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.1);
}

.form-input::placeholder {
    color: var(--text-muted);
}

.form-textarea {
    resize: vertical;
    min-height: 100px;
}

.form-select {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
    background-position: right var(--space-sm) center;
    background-repeat: no-repeat;
    background-size: 16px 12px;
    padding-right: var(--space-2xl);
}

/* 统一网格布局 */
.config-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--space-lg);
}

.config-item {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
}

.full-width {
    grid-column: 1 / -1;
}

/* 统一卡片样式 */
.card {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: var(--space-xl);
    box-shadow: var(--shadow-sm);
}

.card-header {
    margin-bottom: var(--space-lg);
    padding-bottom: var(--space-sm);
    border-bottom: 1px solid var(--border);
}

.card-title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--accent);
    margin: 0;
}

.card-body {
    margin-bottom: var(--space-lg);
}

.card-footer {
    padding-top: var(--space-sm);
    border-top: 1px solid var(--border);
}

/* 统一提示文本 */
.form-hint {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
    margin-top: var(--space-xs);
    line-height: 1.4;
}

.form-error {
    font-size: var(--font-size-xs);
    color: var(--error);
    margin-top: var(--space-xs);
}

/* 统一状态指示器 */
.status-success {
    color: var(--success);
}

.status-warning {
    color: var(--warning);
}

.status-error {
    color: var(--error);
}

.status-info {
    color: var(--info);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .tool-page {
        padding: var(--space-md);
        max-width: 100vw;
        width: 100vw;
        margin: 0;
        box-sizing: border-box;
        overflow-x: hidden;
    }

    .tool-header h1 {
        font-size: var(--font-size-2xl);
    }

    .tool-header p {
        font-size: var(--font-size);
    }

    .tool-section {
        padding: var(--space-lg);
        margin-bottom: var(--space-lg);
        width: 100%;
        box-sizing: border-box;
    }

    .config-grid {
        grid-template-columns: 1fr;
        gap: var(--space-md);
        width: 100%;
        min-width: 0;
    }

    .config-item {
        width: 100%;
        box-sizing: border-box;
    }

    .btn {
        padding: var(--space) var(--space-md);
        font-size: var(--font-size-sm);
        min-height: 44px; /* 增加触摸区域 */
    }

    .form-input {
        padding: var(--space) var(--space-sm);
        font-size: var(--font-size); /* 防止iOS缩放 */
        width: 100%;
        box-sizing: border-box;
    }

    .section-label {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-semibold);
    }

    .form-hint {
        font-size: var(--font-size-xs);
        line-height: 1.3;
    }
}

@media (max-width: 480px) {
    .app-bar {
        padding: 6px 12px;
        height: 50px;
    }

    .header-left {
        gap: 8px;
    }

    .logo-img {
        height: 30px;
    }

    .dropdown-btn {
        padding: 4px 8px;
        font-size: 13px;
    }

    .dropdown-btn svg {
        width: 18px;
        height: 18px;
    }

    .dropdown-menu {
        min-width: 150px;
    }

    .content {
        padding: 12px;
    }

    .github-info svg {
        width: 16px;
        height: 16px;
    }

    .update-time {
        display: none;
    }

    .tool-page {
        padding: var(--space-sm);
        max-width: 100vw;
        width: 100vw;
        margin: 0;
    }

    .tool-header {
        margin-bottom: var(--space-xl);
        padding-bottom: var(--space-md);
    }

    .tool-header h1 {
        font-size: var(--font-size-xl);
    }

    .tool-header p {
        font-size: var(--font-size-sm);
    }

    .tool-section {
        padding: var(--space-md);
        width: 100%;
        box-sizing: border-box;
    }

    .section-title {
        font-size: var(--font-size-lg);
    }

    .config-grid {
        gap: var(--space-sm);
    }

    .form-input {
        padding: var(--space-sm) var(--space-xs);
        font-size: var(--font-size-sm);
    }

    .section-label {
        font-size: var(--font-size-xs);
    }

    .form-hint {
        font-size: 10px;
    }
}
</style>
