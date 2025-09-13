<template>
    <div class="app-shell">
        <header class="app-bar">
            <div class="brand">MyTools</div>
            <nav class="nav">
                <RouterLink
                    to="/json-to-interface"
                    class="nav-link"
                    active-class="active"
                    >json转Ts接口
                </RouterLink>
                <RouterLink to="/color" class="nav-link" active-class="active"
                    >颜色处理
                </RouterLink>
                <RouterLink to="/file" class="nav-link" active-class="active"
                    >文件处理
                </RouterLink>
                <RouterLink to="/regex" class="nav-link" active-class="active"
                    >正则工具
                </RouterLink>
            </nav>
        </header>
        <main class="content">
            <router-view />
        </main>
        <footer class="footer">© {{ year }} MyTools</footer>
    </div>
</template>
<script setup>
import { RouterLink } from "vue-router";
import { ref } from "vue";

const year = ref(new Date().getFullYear());
</script>

<style>
:root {
    --bg: #ffffff;
    --text: #1f2937;
    --muted: #6b7280;
    --border: #e5e7eb;
    --accent: #111827;
}

* {
    box-sizing: border-box;
}

html,
body,
#app {
    height: 100%;
}

body {
    margin: 0;
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

.brand {
    font-weight: 700;
    letter-spacing: 0.2px;
}

.nav {
    display: flex;
    gap: 8px;
}

.nav-link {
    display: inline-block;
    padding: 6px 10px;
    color: var(--muted);
    text-decoration: none;
    border-radius: 6px;
    border: 1px solid transparent;
    transition: all 0.15s ease;
}

.nav-link:hover {
    color: var(--accent);
    border-color: var(--border);
}

.nav-link.active {
    color: #fff;
    background: var(--accent);
    border-color: var(--accent);
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
</style>
