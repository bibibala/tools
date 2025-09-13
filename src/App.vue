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
    padding: 16px;
    border-top: 1px solid var(--border);
    color: var(--muted);
    text-align: center;
    font-size: 12px;
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
}
</style>
