<template>
    <div class="tool-page">
        <header class="tool-header">
            <h1>文件Accept生成器</h1>
            <p>快速生成文件上传的accept属性，支持多种文件类型选择</p>
        </header>

        <main class="main-content">
            <!-- 文件类型选择区域 -->
            <section class="tool-section">
                <h2 class="section-title">选择文件类型</h2>

                <!-- 快速选择按钮 -->
                <div class="quick-select-buttons">
                    <button class="btn btn-outline" @click="selectAllTypes">
                        全选
                    </button>
                    <button class="btn btn-outline" @click="clearAllTypes">
                        清空
                    </button>
                    <button class="btn btn-outline" @click="selectCommonTypes">
                        常用类型
                    </button>

                    <!-- 代码格式选项 -->
                    <label class="format-option">
                        <input
                            type="checkbox"
                            v-model="useJsObjectFormat"
                            class="format-checkbox"
                        />
                        <span>JS对象格式</span>
                    </label>
                </div>

                <!-- 文件类型分类 -->
                <div class="file-type-categories">
                    <div
                        v-for="category in fileTypeCategories"
                        :key="category.name"
                        class="category-group"
                    >
                        <h3 class="category-title">
                            <input
                                type="checkbox"
                                :id="`category-${category.name}`"
                                :checked="isCategoryFullySelected(category)"
                                @change="toggleCategory(category)"
                                class="category-checkbox"
                            />
                            <label :for="`category-${category.name}`">
                                {{ category.label }}
                            </label>
                        </h3>

                        <div class="file-types-grid">
                            <label
                                v-for="fileType in category.types"
                                :key="fileType.extension"
                                class="file-type-item"
                                :class="{
                                    active: selectedTypes.includes(
                                        fileType.extension,
                                    ),
                                }"
                            >
                                <input
                                    type="checkbox"
                                    :value="fileType.extension"
                                    v-model="selectedTypes"
                                    class="file-type-checkbox"
                                />
                                <div class="file-type-content">
                                    <span class="file-extension">{{
                                        fileType.extension
                                    }}</span>
                                    <span class="file-description">{{
                                        fileType.description
                                    }}</span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 代码显示区域 -->
            <section class="tool-section">
                <h2 class="section-title">生成的代码</h2>

                <!-- 代码显示 -->
                <div class="code-output">
                    <CodeHighlighter
                        :code="generatedCode"
                        :language="'javascript'"
                    />
                </div>

                <!-- 统计信息 -->
                <div class="stats-info">
                    <div class="stat-item">
                        <span class="stat-label">已选择类型：</span>
                        <span class="stat-value">{{ totalSelectedCount }}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">代码格式：</span>
                        <span class="stat-value">{{
                            useJsObjectFormat ? "JS对象" : "字符串"
                        }}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">优化状态：</span>
                        <span class="stat-value">{{ optimizationStatus }}</span>
                    </div>
                </div>
            </section>
        </main>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import CodeHighlighter from "@/components/CodeHighlighter.vue";

// 响应式数据
const selectedTypes = ref([]);
const useJsObjectFormat = ref(false);

// 文件类型分类数据
const fileTypeCategories = ref([
    {
        name: "images",
        label: "图片文件",
        key: "image",
        mimeType: "image/*",
        types: [
            { extension: ".jpg", description: "JPEG图片" },
            { extension: ".jpeg", description: "JPEG图片" },
            { extension: ".png", description: "PNG图片" },
            { extension: ".gif", description: "GIF动图" },
            { extension: ".webp", description: "WebP图片" },
            { extension: ".svg", description: "SVG矢量图" },
            { extension: ".bmp", description: "BMP图片" },
            { extension: ".ico", description: "图标文件" },
            { extension: ".tiff", description: "TIFF图片" },
        ],
    },
    {
        name: "documents",
        label: "文档处理",
        key: "documents",
        mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,application/vnd.apple.pages",
        types: [
            { extension: ".doc", description: "Word文档(旧版)" },
            { extension: ".docx", description: "Word文档" },
            { extension: ".docm", description: "Word宏文件" },
            { extension: ".pages", description: "Pages文档" },
            { extension: ".template", description: "Pages模板" },
        ],
    },
    {
        name: "spreadsheets",
        label: "表格处理",
        key: "spreadsheets",
        mimeType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/vnd.apple.numbers",
        types: [
            { extension: ".xls", description: "Excel表格(旧版)" },
            { extension: ".xlsx", description: "Excel表格" },
            { extension: ".xlsm", description: "Excel宏文件" },
            { extension: ".xlsb", description: "Excel二进制文件" },
            { extension: ".numbers", description: "Numbers表格" },
            { extension: ".nmbtemplate", description: "Numbers模板" },
        ],
    },
    {
        name: "presentations",
        label: "演示文稿",
        key: "presentations",
        mimeType:
            "application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint,application/vnd.apple.keynote",
        types: [
            { extension: ".ppt", description: "PowerPoint(旧版)" },
            { extension: ".pptx", description: "PowerPoint演示文稿" },
            { extension: ".pptm", description: "PowerPoint宏文件" },
            { extension: ".keynote", description: "Keynote演示文稿" },
            { extension: ".key", description: "Keynote演示文稿(旧版)" },
            { extension: ".kth", description: "Keynote主题" },
        ],
    },
    {
        name: "pdf",
        label: "PDF文档",
        key: "pdf",
        mimeType: "application/pdf",
        types: [{ extension: ".pdf", description: "PDF文档" }],
    },
    {
        name: "text",
        label: "文本文档",
        key: "text",
        mimeType: "text/*",
        types: [
            { extension: ".txt", description: "纯文本文件" },
            { extension: ".rtf", description: "富文本格式" },
            { extension: ".md", description: "Markdown文档" },
            { extension: ".tex", description: "LaTeX文档" },
        ],
    },
    {
        name: "opendocument",
        label: "OpenDocument格式",
        key: "opendocument",
        mimeType:
            "application/vnd.oasis.opendocument.text,application/vnd.oasis.opendocument.spreadsheet,application/vnd.oasis.opendocument.presentation",
        types: [
            { extension: ".odt", description: "OpenDocument文本" },
            { extension: ".ods", description: "OpenDocument表格" },
            { extension: ".odp", description: "OpenDocument演示" },
        ],
    },
    {
        name: "cad",
        label: "CAD设计文件",
        key: "cad",
        mimeType: "application/acad,application/x-autocad,application/dwg",
        types: [
            { extension: ".dwg", description: "AutoCAD图纸" },
            { extension: ".dxf", description: "CAD交换格式" },
            { extension: ".dwf", description: "设计Web格式" },
            { extension: ".step", description: "STEP 3D模型" },
            { extension: ".stp", description: "STEP 3D模型" },
            { extension: ".iges", description: "IGES 3D模型" },
            { extension: ".igs", description: "IGES 3D模型" },
            { extension: ".3dm", description: "Rhino 3D模型" },
            { extension: ".skp", description: "SketchUp模型" },
        ],
    },
    {
        name: "audio",
        label: "音频文件",
        key: "audio",
        mimeType: "audio/*",
        types: [
            { extension: ".mp3", description: "MP3音频" },
            { extension: ".wav", description: "WAV音频" },
            { extension: ".ogg", description: "OGG音频" },
            { extension: ".m4a", description: "M4A音频" },
            { extension: ".aac", description: "AAC音频" },
            { extension: ".flac", description: "FLAC音频" },
            { extension: ".wma", description: "WMA音频" },
        ],
    },
    {
        name: "video",
        label: "视频文件",
        key: "video",
        mimeType: "video/*",
        types: [
            { extension: ".mp4", description: "MP4视频" },
            { extension: ".avi", description: "AVI视频" },
            { extension: ".mov", description: "MOV视频" },
            { extension: ".wmv", description: "WMV视频" },
            { extension: ".flv", description: "FLV视频" },
            { extension: ".webm", description: "WebM视频" },
            { extension: ".mkv", description: "MKV视频" },
            { extension: ".m4v", description: "M4V视频" },
        ],
    },
    {
        name: "archives",
        label: "压缩文件",
        key: "archive",
        mimeType:
            "application/zip,application/x-rar-compressed,application/x-7z-compressed",
        types: [
            { extension: ".zip", description: "ZIP压缩包" },
            { extension: ".rar", description: "RAR压缩包" },
            { extension: ".7z", description: "7Z压缩包" },
            { extension: ".tar", description: "TAR归档" },
            { extension: ".gz", description: "GZ压缩" },
            { extension: ".bz2", description: "BZ2压缩" },
        ],
    },
    {
        name: "code",
        label: "代码文件",
        key: "code",
        mimeType:
            "text/javascript,text/typescript,text/html,text/css,application/json,text/xml",
        types: [
            { extension: ".js", description: "JavaScript" },
            { extension: ".ts", description: "TypeScript" },
            { extension: ".html", description: "HTML文件" },
            { extension: ".css", description: "CSS样式" },
            { extension: ".json", description: "JSON数据" },
            { extension: ".xml", description: "XML文件" },
            { extension: ".py", description: "Python脚本" },
            { extension: ".java", description: "Java源码" },
            { extension: ".cpp", description: "C++源码" },
            { extension: ".c", description: "C源码" },
        ],
    },
    {
        name: "applications",
        label: "应用程序文件",
        key: "application",
        mimeType: "application/octet-stream",
        types: [
            { extension: ".exe", description: "Windows可执行文件" },
            { extension: ".msi", description: "Windows安装包" },
            { extension: ".dmg", description: "macOS磁盘镜像" },
            { extension: ".pkg", description: "macOS安装包" },
            { extension: ".app", description: "macOS应用程序" },
            { extension: ".deb", description: "Debian安装包" },
            { extension: ".rpm", description: "RPM安装包" },
            { extension: ".apk", description: "Android应用包" },
            { extension: ".ipa", description: "iOS应用包" },
            { extension: ".jar", description: "Java应用程序" },
            { extension: ".war", description: "Web应用归档" },
            { extension: ".ear", description: "企业应用归档" },
        ],
    },
]);

// 计算属性
const totalSelectedCount = computed(() => {
    return selectedTypes.value.length;
});

// 检查某个分类是否完全选中
const isCategoryFullySelected = (category) => {
    return category.types.every((type) =>
        selectedTypes.value.includes(type.extension),
    );
};

// 生成按分类的文件类型对象（智能MIME类型）
const categorizedFileTypes = computed(() => {
    const result = {};

    fileTypeCategories.value.forEach((category) => {
        const selectedInCategory = category.types.filter((type) =>
            selectedTypes.value.includes(type.extension),
        );

        if (selectedInCategory.length > 0) {
            // 如果该分类的所有类型都被选中，使用MIME类型
            if (selectedInCategory.length === category.types.length) {
                result[category.key] = category.mimeType;
            } else {
                // 否则使用具体的扩展名
                result[category.key] = selectedInCategory
                    .map((type) => type.extension)
                    .join(",");
            }
        }
    });

    return result;
});

// 生成字符串格式（智能MIME类型）
const acceptString = computed(() => {
    const acceptValues = [];

    fileTypeCategories.value.forEach((category) => {
        const selectedInCategory = category.types.filter((type) =>
            selectedTypes.value.includes(type.extension),
        );

        if (selectedInCategory.length > 0) {
            // 如果该分类的所有类型都被选中，使用MIME类型
            if (selectedInCategory.length === category.types.length) {
                acceptValues.push(category.mimeType);
            } else {
                // 否则使用具体的扩展名
                acceptValues.push(
                    ...selectedInCategory.map((type) => type.extension),
                );
            }
        }
    });

    return acceptValues.join(",");
});

// 优化状态统计
const optimizationStatus = computed(() => {
    let optimizedCategories = 0;
    let totalCategories = 0;

    fileTypeCategories.value.forEach((category) => {
        const selectedInCategory = category.types.filter((type) =>
            selectedTypes.value.includes(type.extension),
        );

        if (selectedInCategory.length > 0) {
            totalCategories++;
            // 如果该分类的所有类型都被选中，则为优化状态
            if (selectedInCategory.length === category.types.length) {
                optimizedCategories++;
            }
        }
    });

    if (totalCategories === 0) {
        return "无选择";
    }

    return `${optimizedCategories}/${totalCategories} 分类使用MIME类型`;
});

// 生成的代码
const generatedCode = computed(() => {
    if (useJsObjectFormat.value) {
        // JS对象格式 - 生成不带引号的键
        const entries = Object.entries(categorizedFileTypes.value);
        if (entries.length === 0) {
            return "const accept = {};";
        }

        const objectContent = entries
            .map(([key, value]) => `  ${key}: "${value}"`)
            .join(",\n");

        return `const accept = {\n${objectContent}\n};`;
    } else {
        // 字符串格式 - 只返回纯字符串
        return acceptString.value;
    }
});

// 方法
const selectAllTypes = () => {
    selectedTypes.value = fileTypeCategories.value.flatMap((category) =>
        category.types.map((type) => type.extension),
    );
};

const clearAllTypes = () => {
    selectedTypes.value = [];
};

const selectCommonTypes = () => {
    selectedTypes.value = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".pdf",
        ".doc",
        ".docx",
        ".pages",
        ".xls",
        ".xlsx",
        ".numbers",
        ".ppt",
        ".pptx",
        ".keynote",
        ".txt",
    ];
};

const toggleCategory = (category) => {
    const isSelected = isCategoryFullySelected(category);
    const categoryExtensions = category.types.map((type) => type.extension);

    if (isSelected) {
        selectedTypes.value = selectedTypes.value.filter(
            (type) => !categoryExtensions.includes(type),
        );
    } else {
        const newTypes = categoryExtensions.filter(
            (ext) => !selectedTypes.value.includes(ext),
        );
        selectedTypes.value.push(...newTypes);
    }
};
</script>

<style scoped>
.main-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xl);
}

.quick-select-buttons {
    display: flex;
    gap: var(--space-sm);
    margin-bottom: var(--space-xl);
    flex-wrap: wrap;
    align-items: center;
}

.format-option {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-sm) var(--space-md);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--bg);
    cursor: pointer;
    transition: all 0.2s ease;
    margin-left: auto;
}

.format-option:hover {
    border-color: var(--info);
}

.format-checkbox {
    width: 16px;
    height: 16px;
    accent-color: var(--info);
}

.format-option span {
    font-size: var(--font-size-sm);
    color: var(--text);
    font-weight: var(--font-weight-medium);
}

.file-type-categories {
    display: flex;
    flex-direction: column;
    gap: var(--space-xl);
}

.category-group {
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: var(--space-lg);
    background: var(--bg-secondary);
}

.category-title {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--text);
}

.category-checkbox {
    width: 18px;
    height: 18px;
    accent-color: var(--info);
}

.file-types-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--space-sm);
}

.file-type-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--bg);
    cursor: pointer;
    transition: all 0.2s ease;
}

.file-type-item:hover {
    border-color: var(--info);
    background: var(--hover-bg);
}

.file-type-item.active {
    border-color: var(--info);
    background: rgba(59, 130, 246, 0.1);
}

.file-type-checkbox {
    width: 16px;
    height: 16px;
    accent-color: var(--info);
}

.file-type-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.file-extension {
    font-weight: var(--font-weight-medium);
    color: var(--text);
}

.file-description {
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
}

.code-output {
    margin-bottom: var(--space-lg);
}

.stats-info {
    display: flex;
    gap: var(--space-xl);
    padding: var(--space-md);
    background: var(--bg-secondary);
    border-radius: var(--radius);
    border: 1px solid var(--border);
}

.stat-item {
    display: flex;
    gap: var(--space-xs);
}

.stat-label {
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
}

.stat-value {
    color: var(--info);
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-sm);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .file-types-grid {
        grid-template-columns: 1fr;
    }

    .quick-select-buttons {
        justify-content: center;
    }

    .format-option {
        margin-left: 0;
        margin-top: var(--space-sm);
    }

    .stats-info {
        flex-direction: column;
        gap: var(--space-sm);
    }
}
</style>
