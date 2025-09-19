<template>
    <div class="tab-switcher">
        <div class="tab-header">
            <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="setActiveTab(tab.id)"
                class="tab-btn"
                :class="{ active: activeTab === tab.id }"
            >
                <span class="tab-icon">{{ tab.icon }}</span>
                <span class="tab-label">{{ tab.label }}</span>
            </button>
        </div>
        <div class="tab-content">
            <slot :activeTab="activeTab" />
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({
    defaultTab: {
        type: String,
        default: "prettier",
    },
});

const emit = defineEmits(["tab-change"]);

const activeTab = ref(props.defaultTab);

const tabs = [
    {
        id: "prettier",
        label: "Prettier",
        icon: "🎨",
    },
    {
        id: "eslint",
        label: "ESLint",
        icon: "🔍",
    },
    {
        id: "typescript",
        label: "TypeScript",
        icon: "📘",
    },
];

const setActiveTab = (tabId) => {
    activeTab.value = tabId;
    emit("tab-change", tabId);
};
</script>

<style scoped>
.tab-switcher {
    width: 100%;
}

.tab-header {
    display: flex;
    border-bottom: 1px solid var(--border);
    margin-bottom: var(--space-xl);
    background: var(--bg);
    border-radius: var(--radius-md) var(--radius-md) 0 0;
    overflow-x: auto;
}

.tab-btn {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-md) var(--space-lg);
    border: none;
    background: transparent;
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition: all 0.2s ease;
    border-bottom: 2px solid transparent;
    white-space: nowrap;
    min-width: 120px;
    justify-content: center;
}

.tab-btn:hover {
    color: var(--accent);
    background: var(--hover-bg);
}

.tab-btn.active {
    color: var(--accent);
    border-bottom-color: var(--accent);
    background: var(--bg);
}

.tab-icon {
    font-size: var(--font-size-lg);
}

.tab-label {
    font-weight: var(--font-weight-semibold);
}

.tab-content {
    width: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .tab-header {
        margin-bottom: var(--space-lg);
    }

    .tab-btn {
        padding: var(--space-sm) var(--space-md);
        min-width: 100px;
        font-size: var(--font-size-xs);
    }

    .tab-icon {
        font-size: var(--font-size);
    }
}

@media (max-width: 480px) {
    .tab-btn {
        padding: var(--space-xs) var(--space-sm);
        min-width: 80px;
    }

    .tab-label {
        display: none;
    }

    .tab-icon {
        font-size: var(--font-size-lg);
    }
}
</style>
