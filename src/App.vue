<template>
  <div class="app-shell">
    <header class="header">
      <RouterLink to="/" class="logo">
        <img :src="logo" alt="CodeForge" class="logo-icon" />
      </RouterLink>
      <nav class="nav">
        <a
          :href="REPO_URL"
          target="_blank"
          class="nav-link repo-link"
          rel="noopener noreferrer"
        >
          <img :src="github" alt="GitHub" class="nav-icon" />
          <span class="repo-meta">
            <span v-if="repoInfo" class="repo-stars"
              >★ {{ repoInfo.stars }}</span
            >
            <span v-if="repoInfo" class="repo-time">{{ repoInfo.time }}</span>
          </span>
        </a>
      </nav>
    </header>

    <main class="main">
      <router-view />
    </main>

    <footer class="footer">© {{ year }} CodeForge</footer>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router";
import github from "@/assets/github.png";
import logo from "@/assets/logo.svg";
import { ref, onMounted } from "vue";
import { REPO_URL, getRepoInfo } from "@/utils/useGetRepo.js";
import { useRouteMetaHead } from "@/utils/useRouteMetaHead.js";

const year = ref(new Date().getFullYear());
const repoInfo = ref(null);

onMounted(async () => {
  const cacheKey = "repo_info_cache";
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      repoInfo.value = JSON.parse(cached);
    } catch {
      // ignore parse error
    }
  }
  try {
    const info = await getRepoInfo();
    repoInfo.value = info;
    localStorage.setItem(cacheKey, JSON.stringify(info));
  } catch {
    // ignore API error
  }
});

useRouteMetaHead();
</script>

<style>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 48px;
  background: rgba(17, 17, 19, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-subtle);
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo-icon {
  height: 28px;
  width: 28px;
}

.nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 32px;
  padding: 0 8px;
  border-radius: 6px;
  transition: background 0.15s ease;
}

.nav-link:hover {
  background: var(--bg-hover);
}

.nav-icon {
  width: 18px;
  height: 18px;
  filter: invert(1);
  opacity: 0.7;
  transition: opacity 0.15s ease;
  flex-shrink: 0;
}

.nav-link:hover .nav-icon {
  opacity: 1;
}

.repo-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--text-secondary);
  white-space: nowrap;
}

.repo-stars {
  color: #facc15;
}

.repo-time {
  color: var(--text-muted);
}

.main {
  flex: 1;
  padding: 68px 20px 20px;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
}

.footer {
  padding: 16px 20px;
  text-align: center;
  color: var(--text-muted);
  font-size: 12px;
  border-top: 1px solid var(--border-subtle);
}

@media (max-width: 640px) {
  .main {
    padding: 60px 16px 16px;
  }
  .repo-meta {
    display: none;
  }
}
</style>
