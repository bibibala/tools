<template>
  <div class="home">
    <header class="hero">
      <h1 class="title">CodeForge</h1>
      <p class="desc">在线工具集合</p>
    </header>

    <div class="grid">
      <RouterLink
        v-for="tool in tools"
        :key="tool.path"
        :to="tool.path"
        class="card"
      >
        <span class="card-icon">{{ tool.icon }}</span>
        <div class="card-body">
          <h2 class="card-title">{{ tool.title }}</h2>
          <p class="card-desc">{{ tool.description }}</p>
        </div>
        <span class="card-tag">{{ tool.category }}</span>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { routes } from "@/router/index.js";

const tools = routes
  .filter((route) => route.name !== "Home")
  .map((route) => ({
    path: route.path,
    title: route.meta.title,
    description: route.meta.description,
    category: route.meta.category,
    icon:
      { "/icns": "🎨", "/sheet2code": "📊", "/profile": "📄", "/year": "🎊" }[
        route.path
      ] || "🔧",
  }));
</script>

<style scoped>
.home {
  max-width: 640px;
  margin: 0 auto;
  padding: 48px 0;
}

.hero {
  margin-bottom: 40px;
}

.title {
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.5px;
  margin-bottom: 6px;
}

.desc {
  color: var(--text-muted);
  font-size: 14px;
}

.grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  text-decoration: none;
  color: inherit;
  transition: all 0.15s ease;
}

.card:hover {
  background: var(--bg-elevated);
  border-color: var(--text-muted);
}

.card-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-hover);
  border-radius: 8px;
  flex-shrink: 0;
}

.card-body {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 2px;
}

.card-desc {
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-tag {
  font-size: 11px;
  color: var(--text-muted);
  padding: 2px 8px;
  background: var(--bg-hover);
  border-radius: 4px;
  flex-shrink: 0;
}
</style>
