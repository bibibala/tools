<script setup>
import { ref, computed, watch } from "vue";
import catsData from "./plants/aspca-plants-cats-data.json";
import dogsData from "./plants/aspca-toxic-to-dogs-data.json";
import horsesData from "./plants/aspca-toxic-to-horses-data.json";
import FoodsList from "./components/FoodsList.vue";
import HouseholdItemsList from "./components/HouseholdItemsList.vue";

const mainTabs = [
    { id: "pets", name: "Harmful Plants 有害植物" },
    { id: "foods", name: "Harmful Foods 有害食品" },
    { id: "household", name: "Harmful Household Items 有害家居用品" },
];
const activeMainTab = ref("pets");

const petTabs = [
    { id: "cats", name: "Cats 猫" },
    { id: "dogs", name: "Dogs 狗" },
    { id: "horses", name: "Horses 马" },
];
const activePetTab = ref("cats");

// Pagination state
const currentPage = ref(1);
const itemsPerPage = 12;

// Data mapping
const petDataMap = {
    cats: catsData,
    dogs: dogsData,
    horses: horsesData,
};

// Computed data for current pet type
const currentPlants = computed(() => {
    return petDataMap[activePetTab.value] || [];
});

// Paginated plants
const paginatedPlants = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return currentPlants.value.slice(start, end);
});

// Total pages
const totalPages = computed(() => {
    return Math.ceil(currentPlants.value.length / itemsPerPage);
});

// Visible pages for pagination
const visiblePages = computed(() => {
    const pages = [];
    const maxVisible = 5; // 最多显示5个页码
    const start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages.value, start + maxVisible - 1);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
});

// Reset page when tab changes
watch(activePetTab, () => {
    currentPage.value = 1;
});

// Pagination functions
const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};
</script>

<template>
    <div class="tool-page">
        <div class="tool-header">
            <h1 class="tool-title">Pet Safety Guide 养宠物注意指南</h1>
            <div class="disclaimer">
                <p class="disclaimer-text">
                    <strong>Disclaimer 免责声明:</strong>
                    The information provided on this page is for educational
                    purposes only and should not replace professional veterinary
                    advice. Data source:
                    <a
                        href="https://www.aspca.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="source-link"
                        >ASPCA (American Society for the Prevention of Cruelty
                        to Animals)</a
                    >
                </p>
                <p class="disclaimer-text-zh">
                    <strong>中文说明:</strong>
                    本页面提供的信息仅供教育目的，不应替代专业兽医建议。数据来源：<a
                        href="https://www.aspca.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="source-link"
                        >ASPCA (美国防止虐待动物协会)</a
                    >
                </p>
            </div>
        </div>

        <div class="main-content">
            <!-- Main Tabs -->
            <div class="tabs-container">
                <div class="tabs-nav">
                    <button
                        v-for="tab in mainTabs"
                        :key="tab.id"
                        @click="activeMainTab = tab.id"
                        :class="[
                            'tab-btn',
                            { active: activeMainTab === tab.id },
                        ]"
                    >
                        {{ tab.name }}
                    </button>
                </div>

                <!-- Pet Type Sub-tabs -->
                <div class="sub-tabs-nav" v-if="activeMainTab === 'pets'">
                    <button
                        v-for="tab in petTabs"
                        :key="tab.id"
                        @click="activePetTab = tab.id"
                        :class="[
                            'sub-tab-btn',
                            { active: activePetTab === tab.id },
                        ]"
                    >
                        {{ tab.name }}
                    </button>
                </div>

                <!-- Content -->
                <div class="tab-content">
                    <!-- Pet Safety Tab -->
                    <div
                        v-if="activeMainTab === 'pets'"
                        class="content-wrapper"
                    >
                        <div class="plants-grid">
                            <!-- 直接在模板中使用植物卡片结构 -->
                            <div
                                v-for="plant in paginatedPlants"
                                :key="plant.index"
                                class="plant-card card"
                            >
                                <div
                                    class="plant-image-container"
                                    v-if="plant.imageUrl"
                                >
                                    <img
                                        :src="plant.imageUrl"
                                        :alt="
                                            plant.imageAlt || plant.commonName
                                        "
                                        class="plant-image"
                                        @error="handleImageError"
                                    />
                                </div>
                                <div class="plant-info">
                                    <div class="plant-names">
                                        <h3 class="plant-name-en">
                                            {{ plant.commonName }}
                                        </h3>
                                        <h4
                                            class="plant-name-zh"
                                            v-if="plant.chineseName"
                                        >
                                            {{ plant.chineseName }}
                                        </h4>
                                    </div>
                                    <p class="plant-scientific">
                                        {{ plant.scientificName }}
                                    </p>
                                    <div
                                        class="plant-link"
                                        v-if="plant.detailLink"
                                    >
                                        <a
                                            :href="plant.detailLink"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="btn btn-sm"
                                        >
                                            More Info 更多信息
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Pagination -->
                        <div class="pagination" v-if="totalPages > 1">
                            <div class="pagination-info">
                                Showing
                                {{ (currentPage - 1) * itemsPerPage + 1 }}-{{
                                    Math.min(
                                        currentPage * itemsPerPage,
                                        currentPlants.length,
                                    )
                                }}
                                of {{ currentPlants.length }} plants
                            </div>
                            <div class="pagination-controls">
                                <button
                                    @click="prevPage"
                                    :disabled="currentPage === 1"
                                    class="btn btn-secondary"
                                >
                                    Previous
                                </button>

                                <div class="page-numbers">
                                    <button
                                        v-for="page in visiblePages"
                                        :key="page"
                                        @click="goToPage(page)"
                                        :class="[
                                            'btn',
                                            {
                                                'btn-primary':
                                                    page === currentPage,
                                            },
                                            {
                                                'btn-secondary':
                                                    page !== currentPage,
                                            },
                                        ]"
                                    >
                                        {{ page }}
                                    </button>
                                </div>

                                <button
                                    @click="nextPage"
                                    :disabled="currentPage === totalPages"
                                    class="btn btn-secondary"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Harmful Foods Tab -->
                    <div
                        v-if="activeMainTab === 'foods'"
                        class="content-wrapper"
                    >
                        <FoodsList />
                    </div>

                    <!-- Harmful Household Items Tab -->
                    <div
                        v-if="activeMainTab === 'household'"
                        class="content-wrapper"
                    >
                        <HouseholdItemsList />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.tool-header {
    margin-bottom: 2rem;
}

.tool-title {
    text-align: center;
    font-size: 2rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 1rem;
}

.disclaimer {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem 1.5rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    border-left: 4px solid var(--accent);
}

.disclaimer-text,
.disclaimer-text-zh {
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--text-secondary);
    margin: 0 0 0.75rem 0;
}

.disclaimer-text:last-child,
.disclaimer-text-zh:last-child {
    margin-bottom: 0;
}

.disclaimer strong {
    color: var(--text);
    font-weight: 600;
}

.source-link {
    color: var(--accent);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
}

.source-link:hover {
    color: var(--hover-bg);
    text-decoration: underline;
}

.tabs-container {
    margin-bottom: 2rem;
}

.tabs-nav {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    border-bottom: 2px solid var(--border);
}

.tab-btn {
    padding: 0.75rem 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    color: var(--text-secondary);
    transition: all 0.2s ease;
    border-bottom: 2px solid transparent;
}

.tab-btn:hover {
    color: var(--text);
}

.tab-btn.active {
    color: var(--accent);
    border-bottom-color: var(--accent);
}

.sub-tabs-nav {
    display: flex;
    gap: 0.25rem;
    margin-bottom: 1.5rem;
    padding: 0.5rem;
    background: var(--bg-secondary);
    border-radius: var(--radius);
}

.sub-tab-btn {
    padding: 0.5rem 1rem;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.9rem;
    color: var(--text-secondary);
    border-radius: var(--radius-sm);
    transition: all 0.2s ease;
}

.sub-tab-btn:hover {
    color: var(--text);
    background: var(--hover-bg);
}

.sub-tab-btn.active {
    color: var(--bg);
    background: var(--accent);
}

.content-wrapper {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.plants-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}

.plant-card {
    padding: 1.5rem;
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
}

.plant-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

.plant-image-container {
    width: 100%;
    height: 200px;
    margin-bottom: 1rem;
    border-radius: var(--radius);
    overflow: hidden;
}

.plant-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.plant-info {
    text-align: center;
}

.plant-names {
    margin-bottom: 0.75rem;
}

.plant-name-en {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 0.25rem;
}

.plant-name-zh {
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--text-secondary);
    margin-bottom: 0.25rem;
}

.plant-scientific {
    font-style: italic;
    color: var(--text-secondary);
    margin-bottom: 1rem;
}

.plant-link {
    margin-top: 1rem;
}

/* Pagination styles */
.pagination {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: var(--bg-secondary);
    border-radius: var(--radius);
    border: 1px solid var(--border);
}

.pagination-info {
    font-size: 0.9rem;
    color: var(--text-secondary);
    text-align: center;
}

.pagination-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
}

.page-numbers {
    display: flex;
    gap: 0.25rem;
}

.page-numbers .btn {
    min-width: 36px;
    padding: 0.5rem;
    justify-content: center;
}

.pagination-controls .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

@media (max-width: 768px) {
    .plants-grid {
        grid-template-columns: 1fr;
    }

    .pagination-controls {
        flex-direction: column;
        gap: 1rem;
    }

    .page-numbers {
        order: -1;
    }

    .disclaimer {
        padding: 0.875rem 1rem;
        margin: 0 1rem;
    }

    .disclaimer-text,
    .disclaimer-text-zh {
        font-size: 0.8rem;
    }

    .tool-title {
        font-size: 1.75rem;
    }
}
</style>
