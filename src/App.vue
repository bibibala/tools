<template>
    <div class="app-shell">
        <header class="app-bar">
            <div class="header-left">
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
                        <span class="btn-text">MyTools</span>
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
                        <RouterLink
                            to="/json-to-interface"
                            class="dropdown-item"
                            active-class="active"
                            @click.stop="isMenuOpen = false"
                        >
                            json转Ts接口
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
                            to="/regex"
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

            <a
                href="https://github.com/bibibala/tools"
                target="_blank"
                style="text-decoration: none"
            >
                <div class="header-right">
                    <div class="github-info">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path
                                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                            />
                        </svg>
                        <span class="update-time"
                            >Last updated: {{ lastUpdateTime }}</span
                        >
                    </div>
                </div>
            </a>
        </header>
        <main class="content">
            <router-view />
        </main>
        <footer class="footer">© {{ year }} MyTools</footer>
    </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { getRepoUpdateTime } from "@/utils/useGetRepo.js";
import { ref, onMounted, onBeforeUnmount } from "vue";

const year = ref(new Date().getFullYear());
const lastUpdateTime = ref("2024-01-01");

onMounted(async () => {
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
    --bg: #ffffff;
    --text: #1f2937;
    --muted: #6b7280;
    --border: #e5e7eb;
    --accent: #111827;
    --hover-bg: #f3f4f6;
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
    padding: 10px 16px;
    border-bottom: 1px solid var(--border);
    backdrop-filter: saturate(180%) blur(8px);
    background: rgba(255, 255, 255, 0.8);
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
    font-weight: 700;
    letter-spacing: 0.2px;
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
    color: var(--muted);
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
    color: var(--muted);
    font-size: 12px;
}

.github-info svg {
    flex-shrink: 0;
}

.update-time {
    white-space: nowrap;
}

.content {
    padding: 16px;
    max-width: 1100px;
    margin: 0 auto;
    width: 100%;
}

.footer {
    padding: 16px;
    border-top: 1px solid var(--border);
    color: var(--muted);
    text-align: center;
    font-size: 12px;
}

/* 响应式优化（小屏适配） */
@media (max-width: 480px) {
    .app-bar {
        padding: 8px 12px;
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
}
</style>
