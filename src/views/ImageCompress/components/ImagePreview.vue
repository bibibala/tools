<template>
    <div class="image-preview">
        <div v-if="files.length === 0" class="empty-state">
            <div class="empty-icon">🖼️</div>
            <p>暂无图片</p>
            <p class="empty-subtext">请选择要压缩的图片</p>
        </div>

        <div v-else>
            <div class="preview-header">
                <h3>已选择 {{ files.length }} 张图片</h3>
                <button @click="$emit('clear-all')" class="btn btn-danger">
                    清空所有
                </button>
            </div>

            <div class="images-grid">
                <div
                    v-for="(file, index) in files"
                    :key="index"
                    class="image-card"
                >
                    <div class="image-container">
                        <img
                            v-if="file.preview"
                            :src="file.preview"
                            :alt="file.path"
                            class="preview-image"
                        />
                        <div v-else class="image-placeholder">
                            <span class="file-icon">📷</span>
                        </div>
                    </div>
                    <div class="image-info">
                        <h4 class="file-name" :title="file.path">
                            {{ getFileName(file.path) }}
                        </h4>
                        <div
                            v-if="file.relativePath"
                            class="file-path"
                            :title="file.relativePath"
                        >
                            {{ file.relativePath }}
                        </div>
                        <div class="file-size">
                            {{ formatFileSize(file.size) }}
                        </div>
                        <div v-if="file.compressed" class="compressed-size">
                            {{ formatFileSize(file.compressed.size) }}
                            <span class="compression-ratio">
                                ({{ file.compressionRatio }}% 压缩)
                            </span>
                        </div>
                    </div>
                    <button
                        @click="removeFile(index)"
                        class="remove-btn"
                        title="移除图片"
                    >
                        ×
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    files: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(["remove-file", "clear-all"]);

// 移除文件
const removeFile = (index) => {
    emit("remove-file", index);
};

// 获取文件名
const getFileName = (path) => {
    return path.split("/").pop() || path;
};

// 格式化文件大小
const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};
</script>

<style scoped>
.preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-lg);
    padding-bottom: var(--space-md);
    border-bottom: 1px solid var(--border);
}

.preview-header h3 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--text);
    margin: 0;
}

.images-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: var(--space-lg);
}

.image-card {
    background: var(--bg);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    transition: all 0.3s ease;
    position: relative;
}

.image-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.image-container {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
}

.preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-secondary);
    color: var(--text-muted);
}

.file-icon {
    font-size: 3rem;
}

.image-info {
    padding: var(--space-md);
}

.file-name {
    font-weight: var(--font-weight-medium);
    color: var(--text);
    margin-bottom: var(--space-xs);
    word-break: break-word;
    font-size: var(--font-size-sm);
}

.file-path {
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
    margin-bottom: var(--space-xs);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.file-size {
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
    margin-bottom: var(--space-xs);
}

.compressed-size {
    font-size: var(--font-size-xs);
    color: var(--success);
    font-weight: var(--font-weight-medium);
}

.compression-ratio {
    color: var(--success);
    font-weight: var(--font-weight-semibold);
}

.remove-btn {
    position: absolute;
    top: var(--space-sm);
    right: var(--space-sm);
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 18px;
    color: var(--error);
    transition: all 0.3s ease;
    z-index: 1;
}

.remove-btn:hover {
    background: var(--hover-bg);
    transform: scale(1.1);
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: var(--text-secondary);
}

.empty-icon {
    font-size: 4rem;
    margin-bottom: var(--space-md);
    opacity: 0.5;
}

.empty-subtext {
    font-size: var(--font-size-sm);
    opacity: 0.7;
    margin: 0;
}

@media (max-width: 768px) {
    .images-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: var(--space-md);
    }

    .preview-header {
        flex-direction: column;
        gap: var(--space-md);
        align-items: stretch;
    }

    .preview-header h3 {
        text-align: center;
    }
}
</style>
