<template>
    <div class="app-shell">
        <header class="app-bar">
            <div class="header-left">
                <div class="logo-container">
                    <img :src="logo" alt="MyTools Logo" class="logo-img" />
                </div>

                <!-- 桌面端和平板的分类菜单 -->
                <div class="desktop-menu">
                    <div
                        v-for="(category, categoryName) in categorizedRoutes"
                        :key="categoryName"
                        class="dropdown-container"
                    >
                        <button
                            class="dropdown-btn"
                            @click.stop="toggleCategory(categoryName)"
                            :aria-label="`打开${categoryName}菜单`"
                        >
                            <span class="btn-text">{{ categoryName }}</span>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                class="dropdown-arrow"
                                :class="{
                                    rotated: openCategory === categoryName,
                                }"
                            >
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>
                        <div
                            class="dropdown-menu"
                            :class="{ show: openCategory === categoryName }"
                        >
                            <RouterLink
                                v-for="item in category"
                                :key="item.path"
                                :to="item.path"
                                class="dropdown-item"
                                active-class="active"
                                @click.stop="openCategory = null"
                            >
                                {{ item.meta.title }}
                            </RouterLink>
                        </div>
                    </div>
                </div>

                <!-- 移动端菜单（保持原有样式） -->
                <div class="mobile-menu">
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
                                :class="{ rotated: isMenuOpen }"
                            >
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>
                        <div
                            class="dropdown-menu"
                            :class="{ show: isMenuOpen }"
                            ref="dropdownMenu"
                        >
                            <div v-for="(item, index) in routes" :key="index">
                                <RouterLink
                                    :to="item.path"
                                    class="dropdown-item"
                                    active-class="active"
                                    @click.stop="isMenuOpen = false"
                                    >{{ item.meta.title }}
                                </RouterLink>
                            </div>
                        </div>
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

        <footer class="footer">© {{ year }} CodeForge</footer>
    </div>
</template>

<script setup>
import { routes } from "@/router/index.js";
import { RouterLink } from "vue-router";
import github from "@/assets/github.png";
import logo from "@/assets/logo.svg";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { getRepoInfo, REPO_URL } from "@/utils/useGetRepo.js";

const year = ref(new Date().getFullYear());
const lastUpdateTime = ref("2024-01-01");
const star = ref(0);

onMounted(async () => {
    try {
        const { time, stars } = await getRepoInfo();
        lastUpdateTime.value = time;
        star.value = stars;
    } catch (error) {
        console.info("GitHub API 获取失败，使用默认值:", error);
        lastUpdateTime.value = new Date().toISOString().split("T")[0];
        star.value = 0;
    }
    initCategorizedRoutes();
});

const isMenuOpen = ref(false);
const dropdownMenu = ref(null);
const openCategory = ref(null);

// 按分类分组路由
const categorizedRoutes = ref({});

// 初始化分类路由
const initCategorizedRoutes = () => {
    const categories = {};
    routes.forEach((route) => {
        const category = route.meta.category || "其他工具";
        if (!categories[category]) {
            categories[category] = [];
        }
        categories[category].push(route);
    });
    categorizedRoutes.value = categories;
};

// 切换分类下拉菜单
const toggleCategory = (categoryName) => {
    openCategory.value =
        openCategory.value === categoryName ? null : categoryName;
};

const handleClickOutside = (e) => {
    // 检查是否点击在移动端菜单外部
    if (
        dropdownMenu.value &&
        !dropdownMenu.value.contains(e.target) &&
        !e.target.closest(".mobile-menu .dropdown-btn")
    ) {
        isMenuOpen.value = false;
    }

    // 检查是否点击在桌面端分类菜单外部
    if (!e.target.closest(".desktop-menu")) {
        openCategory.value = null;
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
.app-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.app-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
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

.dropdown-arrow.rotated {
    transform: rotate(180deg);
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
    box-sizing: border-box;
    overflow-x: hidden;
    padding-top: 72px; /* 为固定的header bar留出空间 */
    padding-left: 16px;
    padding-right: 16px;
    flex: 1;
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
    flex-shrink: 0;
}

/* 桌面端菜单样式 */
.desktop-menu {
    display: flex;
    gap: 8px;
    align-items: center;
}

/* 移动端菜单样式 */
.mobile-menu {
    display: none;
}

/* 桌面端下拉菜单位置调整 */
.desktop-menu .dropdown-container {
    position: relative;
}

.desktop-menu .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 4px;
}

/* 移动端优化 - 防止横向滚动 */
@media (max-width: 768px) {
    .app-shell {
        max-width: 100%;
        overflow-x: hidden;
    }

    .content {
        padding: 12px 16px;
        padding-top: 72px; /* 为固定的header bar留出空间 */
        max-width: 100%;
        width: 100%;
        box-sizing: border-box;
    }

    .app-bar {
        padding: 8px 12px;
        max-width: 100%;
        box-sizing: border-box;
    }

    .header-right {
        max-width: 100%;
    }

    .github-info {
        max-width: 100%;
        overflow: hidden;
    }

    /* 移动端显示移动端菜单，隐藏桌面端菜单 */
    .desktop-menu {
        display: none;
    }

    .mobile-menu {
        display: block;
    }
}

@media (max-width: 480px) {
    .content {
        padding: 8px 12px;
        padding-top: 72px; /* 为固定的header bar留出空间 */
        max-width: 100%;
        width: 100%;
        box-sizing: border-box;
    }

    .app-bar {
        padding: 6px 8px;
        max-width: 100%;
        box-sizing: border-box;
    }

    /* 移动端显示移动端菜单，隐藏桌面端菜单 */
    .desktop-menu {
        display: none;
    }

    .mobile-menu {
        display: block;
    }
}
</style>
