<template>
    <div class="tool-page">
        <header class="tool-header">
            <h1>图片压缩工具</h1>
            <p>
                支持批量压缩图片，保留原本的目录结构，支持多层级嵌套，支持多种输出格式
            </p>
        </header>

        <main class="main-content">
            <!-- 文件上传区域 -->
            <section class="tool-section">
                <h2 class="section-title">选择文件</h2>
                <FileUploader
                    @files-selected="handleFilesSelected"
                    @directory-selected="handleDirectorySelected"
                    :is-processing="isProcessing"
                />
            </section>

            <!-- 压缩设置 -->
            <section class="tool-section">
                <h2 class="section-title">压缩设置</h2>
                <CompressionSettings
                    v-model:quality="quality"
                    v-model:max-width="maxWidth"
                    v-model:max-height="maxHeight"
                    v-model:format="outputFormat"
                    :is-processing="isProcessing"
                />
            </section>

            <!-- 进度显示 -->
            <section v-if="isProcessing" class="tool-section">
                <h2 class="section-title">压缩进度</h2>
                <ProgressDisplay
                    :progress="progress"
                    :current-file="currentFile"
                    :processed-count="processedCount"
                    :total-count="totalCount"
                />
            </section>

            <!-- 操作按钮 -->
            <section class="tool-section">
                <div class="config-grid">
                    <div class="config-item full-width">
                        <div class="actions">
                            <button
                                @click="startCompression"
                                :disabled="
                                    isProcessing || imageFiles.length === 0
                                "
                                class="btn btn-primary"
                            >
                                {{ isProcessing ? "压缩中..." : "开始压缩" }}
                            </button>
                            <button
                                @click="clearAll"
                                :disabled="isProcessing"
                                class="btn btn-secondary"
                            >
                                清空所有
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 图片预览 -->
            <section class="tool-section">
                <h2 class="section-title">图片预览</h2>
                <ImagePreview
                    :files="imageFiles"
                    @remove-file="removeFile"
                    :is-processing="isProcessing"
                />
            </section>
        </main>
    </div>
</template>

<script setup>
import { ref } from "vue";
import useToast from "@/utils/useToast.js";
import FileUploader from "./components/FileUploader.vue";
import CompressionSettings from "./components/CompressionSettings.vue";
import ImagePreview from "./components/ImagePreview.vue";
import ProgressDisplay from "./components/ProgressDisplay.vue";
import {
    compressImage,
    downloadCompressedFiles,
    validateImageFile,
} from "./utils/imageCompressor";
import {
    processDirectoryStructure,
    buildDirectoryTree,
    getDirectoryStats,
} from "./utils/directoryProcessor.js";

// 状态管理
const imageFiles = ref([]);
const isProcessing = ref(false);
const progress = ref(0);
const currentFile = ref("");
const processedCount = ref(0);
const totalCount = ref(0);

// 压缩设置
const quality = ref(0.8);
const maxWidth = ref(1920);
const maxHeight = ref(1080);
const outputFormat = ref("original");

// 直接使用 useToast 对象的方法
const { showSuccess, showError, showInfo } = useToast;

// 处理文件选择
const handleFilesSelected = (files) => {
    const imageFileList = Array.from(files).filter((file) =>
        file.type.startsWith("image/"),
    );

    if (imageFileList.length === 0) {
        showInfo("请选择图片文件");
        return;
    }

    // 验证每个图片文件
    const validFiles = [];
    const invalidFiles = [];

    imageFileList.forEach((file) => {
        const validation = validateImageFile(file);
        if (validation.valid) {
            validFiles.push(file);
        } else {
            invalidFiles.push({ name: file.name, error: validation.error });
        }
    });

    if (invalidFiles.length > 0) {
        console.warn("以下文件验证失败:", invalidFiles);
        invalidFiles.forEach((invalidFile) => {
            showError(`${invalidFile.name}: ${invalidFile.error}`);
        });
    }

    if (validFiles.length === 0) {
        showError("没有有效的图片文件被添加");
        return;
    }

    // 添加验证通过的文件到列表
    const newFiles = validFiles.map((file) => ({
        file,
        path: file.name,
        relativePath: file.name,
        size: file.size,
        type: file.type,
        preview: URL.createObjectURL(file), // 创建预览URL
        compressed: null,
        compressionRatio: 0,
    }));

    imageFiles.value = [...imageFiles.value, ...newFiles];
    showSuccess(
        `已添加 ${newFiles.length} 张图片${invalidFiles.length > 0 ? `，${invalidFiles.length} 个文件验证失败` : ""}`,
    );
};

// 处理目录选择
const handleDirectorySelected = async (items) => {
    try {
        // 处理目录结构，保持原有层级
        const processedFiles = await processDirectoryStructure(items);

        // 验证每个图片文件
        const validFiles = [];
        const invalidFiles = [];

        processedFiles.forEach((item) => {
            const validation = validateImageFile(item.file);
            if (validation.valid) {
                validFiles.push(item);
            } else {
                invalidFiles.push({ name: item.path, error: validation.error });
            }
        });

        if (invalidFiles.length > 0) {
            console.warn("目录中以下文件验证失败:", invalidFiles);
            invalidFiles.forEach((invalidFile) => {
                showError(`${invalidFile.name}: ${invalidFile.error}`);
            });
        }

        if (validFiles.length === 0) {
            showError("目录中没有有效的图片文件");
            return;
        }

        // 为每个验证通过的图片文件创建预览URL
        const filesWithPreview = validFiles.map((file) => ({
            ...file,
            preview: URL.createObjectURL(file.file), // 创建预览URL
        }));

        // 保存文件信息和目录结构
        imageFiles.value = [...imageFiles.value, ...filesWithPreview];

        // 显示目录统计信息
        const stats = getDirectoryStats(filesWithPreview);
        showSuccess(
            `已添加 ${validFiles.length} 张图片${invalidFiles.length > 0 ? `，${invalidFiles.length} 个文件验证失败` : ""}，共 ${formatFileSize(stats.totalSize)}`,
        );

        console.log("目录结构:", buildDirectoryTree(filesWithPreview));
    } catch (error) {
        showError("处理目录失败: " + error.message);
    }
};

// 移除文件
const removeFile = (index) => {
    imageFiles.value.splice(index, 1);
};

// 清空全部
const clearAll = () => {
    // 清理预览URL
    imageFiles.value.forEach((file) => {
        if (file.preview) {
            URL.revokeObjectURL(file.preview);
        }
    });

    imageFiles.value = [];
    progress.value = 0;
    currentFile.value = "";
    processedCount.value = 0;
    totalCount.value = 0;
    showSuccess("已清空所有文件");
};

// 格式化文件大小
const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// 开始压缩
const startCompression = async () => {
    if (imageFiles.value.length === 0) {
        showInfo("请先选择图片");
        return;
    }

    isProcessing.value = true;
    progress.value = 0;
    processedCount.value = 0;
    totalCount.value = imageFiles.value.length;

    try {
        const compressionOptions = {
            quality: quality.value,
            maxWidth: maxWidth.value,
            maxHeight: maxHeight.value,
            format: outputFormat.value,
        };

        const startTime = Date.now();

        // 压缩所有图片
        for (let i = 0; i < imageFiles.value.length; i++) {
            const fileItem = imageFiles.value[i];
            currentFile.value = fileItem.path;

            try {
                const compressedBlob = await compressImage(
                    fileItem.file,
                    compressionOptions,
                );
                fileItem.compressed = compressedBlob;
                fileItem.compressionRatio = (
                    ((fileItem.size - compressedBlob.size) / fileItem.size) *
                    100
                ).toFixed(1);

                processedCount.value++;
                progress.value =
                    (processedCount.value / totalCount.value) * 100;
            } catch (error) {
                console.error("压缩失败:", fileItem.path, error);
                fileItem.compressionError = error.message;
            }
        }

        const compressionTime = Date.now() - startTime;

        // 下载压缩后的文件
        const successfulFiles = imageFiles.value.filter(
            (item) => item.compressed,
        );
        if (successfulFiles.length > 0) {
            await downloadCompressedFiles(
                successfulFiles,
                outputFormat.value,
                false,
            );
            showSuccess(
                `压缩完成！成功压缩 ${successfulFiles.length} 张图片，用时 ${(compressionTime / 1000).toFixed(1)} 秒`,
            );
        } else {
            showError("没有图片被成功压缩");
        }
    } catch (error) {
        console.error("压缩过程失败:", error);
        showError("压缩过程失败: " + error.message);
    } finally {
        isProcessing.value = false;
        currentFile.value = "";
    }
};
</script>

<style scoped>
.actions {
    display: flex;
    gap: var(--space-md);
    justify-content: center;
    margin-top: var(--space-lg);
}

@media (max-width: 768px) {
    .actions {
        flex-direction: column;
        align-items: center;
    }

    .actions .btn {
        width: 100%;
        max-width: 300px;
    }
}
</style>
