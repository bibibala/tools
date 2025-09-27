<template>
    <div class="progress-container">
        <div class="progress-header">
            <h3>压缩进度</h3>
            <span class="progress-percentage">{{ Math.round(progress) }}%</span>
        </div>

        <div class="progress-bar-wrapper">
            <div class="progress-bar">
                <div
                    class="progress-fill"
                    :style="{ width: progress + '%' }"
                ></div>
            </div>
            <div class="progress-text">
                {{ processedCount }} / {{ totalCount }} 文件
            </div>
        </div>

        <div v-if="etaTime" class="progress-stats">
            <div class="stat-item">
                <span class="stat-label">预计剩余时间:</span>
                <span class="stat-value">{{ etaTime }}</span>
            </div>
        </div>

        <div v-if="currentFile" class="current-file">
            <div class="file-icon">📄</div>
            <div class="file-name">{{ truncateFileName(currentFile) }}</div>
        </div>

        <div class="processing-indicator" :class="{ spinning: isProcessing }">
            <div class="spinner"></div>
            <span>正在处理...</span>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";

const props = defineProps({
    progress: {
        type: Number,
        default: 0,
    },
    currentFile: {
        type: String,
        default: "",
    },
    processedCount: {
        type: Number,
        default: 0,
    },
    totalCount: {
        type: Number,
        default: 0,
    },
});

const startTime = ref(Date.now());
const etaTime = ref("");

// 是否正在处理
const isProcessing = computed(() => {
    return props.progress > 0 && props.progress < 100;
});

// 截断文件名
const truncateFileName = (fileName) => {
    if (!fileName) return "";
    const maxLength = 50;
    return fileName.length > maxLength
        ? "..." + fileName.slice(-maxLength + 3)
        : fileName;
};

// 计算预计剩余时间
const calculateETA = () => {
    if (
        props.processedCount === 0 ||
        props.processedCount >= props.totalCount
    ) {
        etaTime.value = "";
        return;
    }

    const elapsed = (Date.now() - startTime.value) / 1000; // 秒
    const processed = props.processedCount;
    const total = props.totalCount;
    const remaining = total - processed;

    if (processed > 0) {
        const timePerItem = elapsed / processed;
        const remainingTime = remaining * timePerItem;

        if (remainingTime < 60) {
            etaTime.value = `${Math.ceil(remainingTime)}秒`;
        } else if (remainingTime < 3600) {
            etaTime.value = `${Math.ceil(remainingTime / 60)}分钟`;
        } else {
            etaTime.value = `${(remainingTime / 3600).toFixed(1)}小时`;
        }
    }
};

// 监听进度变化
watch(
    () => props.processedCount,
    () => {
        calculateETA();
    },
);

watch(
    () => props.progress,
    (newProgress) => {
        if (newProgress === 100) {
            etaTime.value = "";
        }
    },
);

// 重置开始时间
const resetTimer = () => {
    startTime.value = Date.now();
    etaTime.value = "";
};

// 暴露方法给父组件
defineExpose({ resetTimer });

onMounted(() => {
    resetTimer();
});

onUnmounted(() => {
    // 清理工作
});
</script>

<style scoped>
.progress-container {
    background: var(--bg);
    border-radius: var(--radius-lg);
    padding: var(--space-xl);
    box-shadow: var(--shadow-sm);
}

.progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-lg);
}

.progress-header h3 {
    margin: 0;
    color: var(--text);
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
}

.progress-percentage {
    font-size: 1.5rem;
    font-weight: var(--font-weight-bold);
    color: var(--info);
}

.progress-bar-wrapper {
    color: var(--info);
    margin-bottom: var(--space-lg);
}

.progress-bar {
    width: 100%;
    height: 8px;
    background: var(--bg-secondary);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: var(--space-sm);
}

.progress-fill {
    height: 100%;
    background: var(--info);
    border-radius: var(--radius-sm);
    transition: width 0.3s ease;
    position: relative;
    overflow: hidden;
}

.progress-text {
    text-align: center;
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
}

.progress-stats {
    display: flex;
    justify-content: space-around;
    margin-bottom: var(--space-lg);
    padding: var(--space-md);
    background: var(--bg-secondary);
    border-radius: var(--radius);
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-xs);
}

.stat-label {
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
}

.stat-value {
    font-weight: var(--font-weight-semibold);
    color: var(--text);
}

.current-file {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
    padding: var(--space-md);
    background: var(--bg-secondary);
    border-radius: var(--radius);
}

.file-icon {
    font-size: 1.2rem;
}

.file-name {
    font-size: var(--font-size-sm);
    color: var(--text);
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.processing-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    padding: var(--space-md);
    background: var(--info);
    border-radius: var(--radius);
    color: var(--text);
    font-size: var(--font-size-sm);
}

.processing-indicator.spinning .spinner {
    animation: spin 1s linear infinite;
}

.spinner {
    width: 20px;
    height: 20px;
    border: 2px solid var(--border);
    border-top: 2px solid var(--info);
    border-radius: 50%;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

@media (max-width: 768px) {
    .progress-container {
        padding: var(--space-lg);
    }

    .progress-stats {
        flex-direction: column;
        gap: var(--space-md);
    }

    .current-file {
        flex-direction: column;
        text-align: center;
    }
}
</style>
