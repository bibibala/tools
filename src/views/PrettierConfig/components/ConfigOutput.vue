<template>
    <div class="config-output">
        <div class="output-header">
            <h3 class="section-title">生成的配置文件</h3>
            <div class="output-actions">
                <button
                    v-for="file in outputFiles"
                    :key="file.name"
                    @click="setActiveFile(file.name)"
                    class="btn btn-secondary file-tab"
                    :class="{ active: activeFile === file.name }"
                >
                    {{ file.name }}
                </button>
            </div>
        </div>

        <div class="output-content">
            <div v-if="activeFileContent" class="code-output">
                <CodeHighlighter
                    :code="activeFileContent"
                    :language="getLanguage(activeFile)"
                />
            </div>
            <div v-else class="no-content">
                <p>请选择配置选项以生成配置文件</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, defineProps } from "vue";
import CodeHighlighter from "@/components/CodeHighlighter.vue";
import { copyToClipboard as copyToClipboardUtil } from "@/utils/useToClipboard.js";
import useToast from "@/utils/useToast.js";

const props = defineProps({
    prettierConfig: {
        type: Object,
        default: () => ({}),
    },
    eslintConfig: {
        type: Object,
        default: () => ({}),
    },
    typescriptConfig: {
        type: Object,
        default: () => ({}),
    },
    activeTab: {
        type: String,
        default: "prettier",
    },
});

const activeFile = ref("");

// 输出文件列表
const outputFiles = computed(() => {
    const files = [];

    // Prettier配置
    if (Object.keys(props.prettierConfig).length > 0) {
        files.push({ name: ".prettierrc", type: "prettier" });

        // 如果选择了LF或CRLF，生成.editorconfig
        if (
            props.prettierConfig.endOfLine === "lf" ||
            props.prettierConfig.endOfLine === "crlf"
        ) {
            files.push({ name: ".editorconfig", type: "editorconfig" });
        }

        // 如果选择了LF，生成.gitattributes
        if (props.prettierConfig.endOfLine === "lf") {
            files.push({ name: ".gitattributes", type: "gitattributes" });
        }
    }

    // ESLint配置 - 只显示规则部分
    if (
        props.eslintConfig.rules &&
        Object.keys(props.eslintConfig.rules).length > 0
    ) {
        files.push({ name: ".eslintrc.json", type: "eslint" });
    }

    // TypeScript配置 - 只显示编译选项
    if (
        props.typescriptConfig.compilerOptions &&
        Object.keys(props.typescriptConfig.compilerOptions).length > 0
    ) {
        files.push({ name: "tsconfig.json", type: "typescript" });
    }

    return files;
});

// 当前活动文件内容
const activeFileContent = computed(() => {
    if (!activeFile.value) return "";

    const file = outputFiles.value.find((f) => f.name === activeFile.value);
    if (!file) return "";

    switch (file.type) {
        case "prettier":
            return generatePrettierConfig();
        case "editorconfig":
            return generateEditorConfig();
        case "gitattributes":
            return generateGitAttributes();
        case "eslint":
            return generateESLintConfig();
        case "typescript":
            return generateTypeScriptConfig();
        default:
            return "";
    }
});

// 生成Prettier配置
const generatePrettierConfig = () => {
    const config = props.prettierConfig || {};
    return JSON.stringify(config, null, 2);
};

// 生成.editorconfig
const generateEditorConfig = () => {
    const config = props.prettierConfig || {};
    const eol = config.endOfLine === "crlf" ? "crlf" : "lf";
    const indent = config.useTabs ? "tab" : "space";
    const indentSize = config.useTabs ? "" : (config.tabWidth || 2).toString();
    const tabWidth = config.tabWidth || 2;

    return `root = true

[*]
charset = utf-8
end_of_line = ${eol}
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = ${indent}${indentSize ? "\nindent_size = " + indentSize : ""}

[*.{js,jsx,ts,tsx}]
indent_size = ${tabWidth}

[*.{json,yml,yaml}]
indent_size = 2

[*.md]
trim_trailing_whitespace = false`;
};

// 生成.gitattributes
const generateGitAttributes = () => {
    return `# 设置默认行为，以防人们没有设置 core.autocrlf
* text=auto

# 明确声明文本文件你想要的行尾结束符
# （通常是 LF，即使在 Windows 上）
*.js text eol=lf
*.jsx text eol=lf
*.ts text eol=lf
*.tsx text eol=lf
*.json text eol=lf
*.css text eol=lf
*.scss text eol=lf
*.html text eol=lf
*.md text eol=lf
*.yml text eol=lf
*.yaml text eol=lf

# 声明二进制文件（所有其他文件）
# - 二进制文件通常不需要行尾转换
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.svg binary
*.woff binary
*.woff2 binary
*.ttf binary
*.eot binary`;
};

// 生成ESLint配置 - 只显示规则部分
const generateESLintConfig = () => {
    const config = props.eslintConfig || {};
    return JSON.stringify(config.rules || {}, null, 2);
};

// 生成TypeScript配置 - 只显示编译选项
const generateTypeScriptConfig = () => {
    const config = props.typescriptConfig || {};
    return JSON.stringify(config.compilerOptions || {}, null, 2);
};

// 获取文件语言类型
const getLanguage = (filename) => {
    if (filename.endsWith(".json")) return "json";
    // 对于不支持的语言类型，使用json作为fallback
    if (filename.endsWith(".editorconfig")) return "json";
    if (filename.endsWith(".gitattributes")) return "json";
    return "json";
};

// 设置活动文件
const setActiveFile = (filename) => {
    activeFile.value = filename;
};

// 复制到剪贴板
const copyToClipboard = async () => {
    try {
        await copyToClipboardUtil(activeFileContent.value);
        useToast.showSuccess("代码已复制到剪贴板");
    } catch (error) {
        useToast.showError("复制失败: " + error.message);
    }
};

// 监听输出文件变化，自动选择第一个文件
watch(
    outputFiles,
    (newFiles) => {
        if (newFiles.length > 0 && !activeFile.value) {
            activeFile.value = newFiles[0].name;
        }
    },
    { immediate: true },
);

// 监听activeTab变化，自动选择对应的文件
watch(
    () => props.activeTab,
    (newTab) => {
        const fileMap = {
            prettier: ".prettierrc",
            eslint: ".eslintrc.json",
            typescript: "tsconfig.json",
        };

        const targetFile = fileMap[newTab];

        if (targetFile) {
            // 检查目标文件是否存在
            const fileExists = outputFiles.value.some(
                (file) => file.name === targetFile,
            );

            if (fileExists) {
                activeFile.value = targetFile;
            } else {
                // 如果目标文件不存在，选择第一个可用文件
                if (outputFiles.value.length > 0) {
                    activeFile.value = outputFiles.value[0].name;
                }
            }
        }
    },
    { immediate: true },
);

// 暴露方法给父组件
defineExpose({
    setActiveFile,
    copyToClipboard,
});
</script>

<style scoped>
.config-output {
    width: 100%;
}

.output-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-lg);
    padding-bottom: var(--space-md);
    border-bottom: 1px solid var(--border);
}

.output-header .section-title {
    margin: 0;
    padding: 0;
    border: none;
}

.output-actions {
    display: flex;
    gap: var(--space-xs);
    flex-wrap: wrap;
}

.file-tab {
    font-size: var(--font-size-xs);
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-sm);
    white-space: nowrap;
}

.file-tab.active {
    background-color: var(--accent);
    color: white;
    border-color: var(--accent);
}

.output-content {
    min-height: 200px;
    margin-bottom: var(--space-lg);
}

.code-output {
    width: 100%;
}

.no-content {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    color: var(--text-muted);
    font-style: italic;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .output-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-md);
    }

    .output-actions {
        width: 100%;
        justify-content: flex-start;
    }

    .file-tab {
        font-size: var(--font-size-xs);
        padding: var(--space-xs) var(--space-sm);
    }
}

@media (max-width: 480px) {
    .output-actions {
        flex-direction: column;
    }

    .file-tab {
        width: 100%;
        text-align: center;
    }
}
</style>
