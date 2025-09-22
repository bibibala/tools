<script setup>
import { ref, computed } from "vue";
import householdData from "../common/HouseholdItems.json";

// 展开所有家居用品数据，包括子分类
const allItems = computed(() => {
    const items = [];
    householdData.household_products_risk_for_pets.forEach((category) => {
        if (category.sub_products) {
            // 如果有子产品，展开每个子产品
            category.sub_products.forEach((subProduct) => {
                items.push({
                    id: `${category.product_name.english}-${subProduct.sub_product_name.english}`,
                    categoryName: category.product_name,
                    productName: subProduct.sub_product_name,
                    riskDescription: subProduct.risk_description,
                    hasSubProducts: false,
                });
            });
        } else {
            // 如果没有子产品，直接添加主产品
            items.push({
                id: category.product_name.english,
                categoryName: category.product_name,
                productName: category.product_name,
                riskDescription: category.risk_description,
                hasSubProducts: false,
            });
        }
    });
    return items;
});

// 分页状态
const currentPage = ref(1);
const itemsPerPage = 12;

// 分页数据
const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return allItems.value.slice(start, end);
});

// 总页数
const totalPages = computed(() => {
    return Math.ceil(allItems.value.length / itemsPerPage);
});

// 可见页码
const visiblePages = computed(() => {
    const pages = [];
    const maxVisible = 5;
    const start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages.value, start + maxVisible - 1);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
});

// 分页函数
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
    <div class="household-content">
        <!-- 原文链接 -->
        <div class="original-link-section">
            <a
                :href="householdData.originalLink"
                target="_blank"
                rel="noopener noreferrer"
                class="original-link-btn"
            >
                🏠 View Original Article 查看原文
            </a>
        </div>

        <!-- 文章式布局 -->
        <div class="household-articles">
            <article
                v-for="item in paginatedItems"
                :key="item.id"
                class="household-article card"
            >
                <header class="article-header">
                    <h2 class="item-title-en">
                        {{ item.productName.english }}
                    </h2>
                    <h3 class="item-title-zh">
                        {{ item.productName.chinese }}
                    </h3>

                    <div
                        class="item-category"
                        v-if="
                            item.categoryName.english !==
                            item.productName.english
                        "
                    >
                        <span class="category-badge">
                            {{ item.categoryName.english }} /
                            {{ item.categoryName.chinese }}
                        </span>
                    </div>
                </header>

                <div class="article-content">
                    <section class="description-section">
                        <h4 class="section-title">Risk Description 风险描述</h4>
                        <div class="description-content">
                            <div class="language-section">
                                <h5 class="language-label">English</h5>
                                <p class="description-text">
                                    {{ item.riskDescription.english }}
                                </p>
                            </div>

                            <div class="language-section">
                                <h5 class="language-label">中文</h5>
                                <p class="description-text">
                                    {{ item.riskDescription.chinese }}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </article>
        </div>

        <!-- 分页 -->
        <div class="pagination" v-if="totalPages > 1">
            <div class="pagination-info">
                Showing
                {{ (currentPage - 1) * itemsPerPage + 1 }}-{{
                    Math.min(currentPage * itemsPerPage, allItems.length)
                }}
                of {{ allItems.length }} household items
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
                                'btn-primary': page === currentPage,
                            },
                            {
                                'btn-secondary': page !== currentPage,
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
</template>

<style scoped>
.household-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

/* 原文链接样式 */
.original-link-section {
    text-align: center;
    margin-bottom: 1rem;
}

.original-link-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: var(--accent);
    color: var(--bg);
    text-decoration: none;
    border-radius: var(--radius);
    font-weight: 500;
    transition: all 0.2s ease;
    box-shadow: var(--shadow-sm);
}

.original-link-btn:hover {
    background: var(--accent, var(--accent));
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

/* 文章式布局 */
.household-articles {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.household-article {
    padding: 2rem;
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
    border-left: 4px solid var(--accent);
}

.household-article:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

/* 文章头部 */
.article-header {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--border);
}

.item-title-en {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 0.5rem;
    line-height: 1.3;
}

.item-title-zh {
    font-size: 1.25rem;
    font-weight: 500;
    color: var(--info);
    margin-bottom: 1rem;
    line-height: 1.4;
}

.item-category {
    margin-top: 1rem;
}

.category-badge {
    display: inline-block;
    padding: 0.375rem 0.75rem;
    background: var(--bg-secondary);
    color: var(--accent);
    border: 1px solid var(--info);
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
    font-weight: 500;
}

/* 文章内容 */
.article-content {
    line-height: 1.7;
}

.description-section {
    margin-bottom: 0;
}

.section-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border);
}

.description-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.language-section {
    background: var(--bg-secondary);
    padding: 1.25rem;
    border-radius: var(--radius);
    border: 1px solid var(--border);
}

.language-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--accent);
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.description-text {
    font-size: 0.95rem;
    line-height: 1.7;
    color: var(--text);
    margin: 0;
    text-align: justify;
}

/* 分页样式 */
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
    .household-article {
        padding: 1.5rem;
    }

    .item-title-en {
        font-size: 1.5rem;
    }

    .item-title-zh {
        font-size: 1.125rem;
    }

    .language-section {
        padding: 1rem;
    }

    .description-content {
        gap: 1rem;
    }

    .pagination-controls {
        flex-direction: column;
        gap: 1rem;
    }

    .page-numbers {
        order: -1;
    }

    .original-link-btn {
        padding: 0.625rem 1.25rem;
        font-size: 0.9rem;
    }
}
</style>
