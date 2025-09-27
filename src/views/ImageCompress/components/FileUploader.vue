<template>
    <div class="file-uploader">
        <div
            class="upload-area"
            :class="{ 'drag-over': isDragOver, processing: isProcessing }"
            @drop="handleDrop"
            @dragover.prevent="handleDragOver"
            @dragleave="handleDragLeave"
        >
            <div class="upload-content">
                <div class="upload-icon">
                    <svg
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                </div>
                <div class="upload-text">
                    <h3>
                        {{
                            isProcessing
                                ? "正在处理文件..."
                                : "拖拽文件或目录到这里"
                        }}
                    </h3>
                    <p>支持 JPG、PNG、WebP 等格式</p>
                    <p class="directory-hint">支持拖拽目录，保持原有结构</p>
                </div>
                <div class="upload-actions">
                    <button
                        @click="selectFiles"
                        class="btn btn-primary"
                        :disabled="isProcessing"
                    >
                        选择文件
                    </button>
                    <button
                        @click="selectDirectory"
                        class="btn btn-secondary"
                        :disabled="isProcessing"
                    >
                        选择目录
                    </button>
                </div>
            </div>
        </div>
        <input
            ref="fileInput"
            type="file"
            multiple
            accept="image/*"
            @change="handleFileInput"
            class="file-input"
        />
        <input
            ref="directoryInput"
            type="file"
            webkitdirectory
            multiple
            @change="handleDirectoryInput"
            class="file-input"
        />
    </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
    isProcessing: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["files-selected", "directory-selected"]);

const fileInput = ref(null);
const directoryInput = ref(null);
const isDragOver = ref(false);

// 选择文件
const selectFiles = () => {
    fileInput.value?.click();
};

// 选择目录
const selectDirectory = () => {
    directoryInput.value?.click();
};

// 处理文件输入
const handleFileInput = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
        emit("files-selected", files);
    }
    // 清空input，允许重复选择相同文件
    event.target.value = "";
};

// 处理目录选择
const handleDirectoryInput = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
        emit("directory-selected", files);
    }
    // 清空input，允许重复选择相同目录
    event.target.value = "";
};

// 处理拖拽
const handleDrop = async (event) => {
    event.preventDefault();
    isDragOver.value = false;

    if (props.isProcessing) return;

    const items = event.dataTransfer.items;
    const files = event.dataTransfer.files;

    if (items && items.length > 0) {
        // 检查是否有目录
        const hasDirectory = Array.from(items).some(
            (item) =>
                item.kind === "file" && item.webkitGetAsEntry()?.isDirectory,
        );

        if (hasDirectory) {
            // 处理目录
            emit("directory-selected", files);
        } else {
            // 处理文件
            emit("files-selected", files);
        }
    } else if (files && files.length > 0) {
        // 降级处理，直接处理文件
        emit("files-selected", files);
    }
};

// 拖拽悬停事件处理
const handleDragOver = (event) => {
    event.preventDefault();
    if (!props.isProcessing) {
        isDragOver.value = true;
    }
};

const handleDragLeave = (event) => {
    event.preventDefault();
    isDragOver.value = false;
};
</script>

<style scoped>
.file-uploader {
    width: 100%;
}

.upload-area {
    border: 2px dashed var(--border);
    border-radius: var(--radius-lg);
    padding: 40px;
    text-align: center;
    transition: all 0.3s ease;
    background: var(--bg-secondary);
    cursor: pointer;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.upload-area:hover {
    border-color: var(--info);
    background: var(--bg-secondary);
}

.upload-area.drag-over {
    border-color: var(--info);
    background: var(--bg-secondary);
    transform: scale(1.02);
}

.upload-area.processing {
    opacity: 0.6;
    cursor: not-allowed;
}

.upload-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-md);
}

.upload-icon {
    color: var(--info);
    margin-bottom: var(--space-sm);
}

.upload-text h3 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-medium);
    color: var(--text);
    margin: 0 0 var(--space-xs) 0;
}

.upload-text p {
    color: var(--text-secondary);
    margin: 0;
    font-size: var(--font-size-sm);
}

.directory-hint {
    font-size: var(--font-size-xs) !important;
    color: var(--text-muted) !important;
    margin-top: var(--space-xs) !important;
}

.upload-actions {
    display: flex;
    gap: var(--space-md);
    margin-top: var(--space-lg);
}

.file-input {
    display: none;
}

@media (max-width: 768px) {
    .upload-area {
        padding: 30px 20px;
    }

    .upload-actions {
        flex-direction: column;
        width: 100%;
    }

    .upload-actions .btn {
        width: 100%;
    }
}
</style>
