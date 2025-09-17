<template>
    <div class="tool-page">
        <!-- 工具标题 -->
        <header class="tool-header">
            <h1>网站元信息（SEO）配置工具</h1>
            <p>配置网站SEO元信息、社交预览、图标等，一键导出HTML文件</p>
        </header>

        <!-- 配置分区：基础信息 -->
        <section class="tool-section">
            <h2 class="section-title">1. 基础网站信息</h2>
            <div class="config-grid">
                <!-- 网站标题 -->
                <div class="config-item full-width">
                    <label class="section-label" for="site-title"
                        >网站标题 <span class="required">*</span></label
                    >
                    <input
                        type="text"
                        id="site-title"
                        v-model="metaConfig.title"
                        placeholder="例如：MyTools - 实用工具集合"
                        class="form-input"
                        required
                    />
                    <p class="form-hint">浏览器标签页标题，SEO核心要素</p>
                </div>

                <!-- 网站域名 -->
                <div class="config-item full-width">
                    <label class="section-label" for="site-url"
                        >网站域名 <span class="required">*</span></label
                    >
                    <input
                        type="url"
                        id="site-url"
                        v-model="metaConfig.url"
                        placeholder="例如：https://mytools.example.com"
                        class="form-input"
                        required
                    />
                    <p class="form-hint">
                        网站唯一访问地址，用于社交平台预览和 canonical 标签
                    </p>
                </div>

                <!-- 网站描述 -->
                <div class="config-item full-width">
                    <label class="section-label" for="site-desc"
                        >网站描述 <span class="required">*</span></label
                    >
                    <textarea
                        id="site-desc"
                        v-model="metaConfig.description"
                        placeholder="例如：提供JSON转TS、颜色处理、正则工具等实用在线工具，提升开发效率"
                        class="form-input form-textarea"
                        rows="3"
                        maxlength="160"
                        required
                    ></textarea>
                    <p class="form-hint">
                        搜索引擎结果展示的描述（建议120-160字符）<span
                            class="char-count"
                            >{{ metaConfig.description.length }}/160</span
                        >
                    </p>
                </div>

                <!-- 关键词 -->
                <div class="config-item full-width">
                    <label class="section-label" for="site-keywords"
                        >SEO关键词</label
                    >
                    <input
                        type="text"
                        id="site-keywords"
                        v-model="metaConfig.keywords"
                        placeholder="例如：在线工具,JSON转TS,颜色处理,正则表达式"
                        class="form-input"
                    />
                    <p class="form-hint">
                        用英文逗号分隔，建议3-5个核心关键词，避免堆砌
                    </p>
                </div>

                <!-- 语言 -->
                <div class="config-item">
                    <label class="section-label" for="site-lang"
                        >网站语言</label
                    >
                    <select
                        id="site-lang"
                        v-model="metaConfig.lang"
                        class="form-input form-select"
                    >
                        <option value="zh-CN">中文（中国大陆）</option>
                        <option value="en-US">英文（美国）</option>
                        <option value="zh-TW">中文（中国台湾）</option>
                        <option value="ja-JP">日语（日本）</option>
                        <option value="ko-KR">韩语（韩国）</option>
                    </select>
                </div>

                <!-- 编码格式 -->
                <div class="config-item">
                    <label class="section-label" for="site-charset"
                        >编码格式</label
                    >
                    <select
                        id="site-charset"
                        v-model="metaConfig.charset"
                        class="form-input form-select"
                    >
                        <option value="UTF-8">UTF-8（推荐，支持多语言）</option>
                        <option value="GB2312">GB2312（仅中文，不推荐）</option>
                        <option value="ISO-8859-1">
                            ISO-8859-1（仅英文，不推荐）
                        </option>
                    </select>
                </div>
            </div>
        </section>

        <!-- 配置分区：SEO优化 -->
        <section class="tool-section">
            <h2 class="section-title">2. SEO 高级优化</h2>
            <div class="config-grid">
                <!-- Canonical 标签 -->
                <div class="config-item full-width">
                    <label class="section-label" for="canonical-url"
                        >首选域名（Canonical）</label
                    >
                    <input
                        type="url"
                        id="canonical-url"
                        v-model="metaConfig.canonical"
                        placeholder="默认与网站域名一致，如：https://mytools.example.com"
                        class="form-input"
                    />
                    <p class="config-hint">
                        解决“同一内容多URL”问题，告诉搜索引擎哪个是首选地址
                    </p>
                </div>

                <!-- robots 标签 -->
                <div class="config-item">
                    <label class="section-label" for="robots"
                        >搜索引擎索引（Robots）</label
                    >
                    <select
                        id="robots"
                        v-model="metaConfig.robots"
                        class="form-input form-select"
                    >
                        <option value="index,follow">
                            允许索引+跟踪链接（推荐）
                        </option>
                        <option value="noindex,follow">
                            禁止索引+允许跟踪链接
                        </option>
                        <option value="index,nofollow">
                            允许索引+禁止跟踪链接
                        </option>
                        <option value="noindex,nofollow">
                            禁止索引+禁止跟踪链接
                        </option>
                    </select>
                </div>

                <!-- 作者 -->
                <div class="config-item">
                    <label class="section-label" for="author">网站作者</label>
                    <input
                        type="text"
                        id="author"
                        v-model="metaConfig.author"
                        placeholder="例如：张三 / MyTools Team"
                        class="form-input"
                    />
                </div>

                <!-- 版权信息 -->
                <div class="config-item full-width">
                    <label class="section-label" for="copyright"
                        >版权信息</label
                    >
                    <input
                        type="text"
                        id="copyright"
                        v-model="metaConfig.copyright"
                        placeholder="例如：© 2024 MyTools. 保留所有权利。"
                        class="form-input"
                    />
                </div>
            </div>
        </section>

        <!-- 配置分区：社交平台预览 -->
        <section class="tool-section">
            <h2 class="section-title">
                3. 社交平台预览（Open Graph / Twitter）
            </h2>
            <div class="config-grid">
                <!-- 社交预览标题 -->
                <div class="config-item full-width">
                    <label class="section-label" for="og-title"
                        >预览标题（默认与网站标题一致）</label
                    >
                    <input
                        type="text"
                        id="og-title"
                        v-model="metaConfig.og.title"
                        placeholder="例如：MyTools - 免费在线开发工具"
                        class="form-input"
                    />
                    <p class="config-hint">
                        分享到微信、Facebook、Twitter 等平台时显示的标题
                    </p>
                </div>

                <!-- 社交预览图片 -->
                <div class="config-item full-width">
                    <label class="section-label" for="og-image"
                        >预览图片 <span class="required">*</span></label
                    >
                    <input
                        type="url"
                        id="og-image"
                        v-model="metaConfig.og.image"
                        placeholder="例如：https://mytools.example.com/og-image.jpg"
                        class="form-input"
                        required
                    />
                    <p class="config-hint">
                        推荐尺寸：1200x630px（社交平台最佳比例），支持JPG/PNG/WebP
                    </p>
                </div>

                <!-- 社交预览描述 -->
                <div class="config-item full-width">
                    <label class="section-label" for="og-desc"
                        >预览描述（默认与网站描述一致）</label
                    >
                    <textarea
                        id="og-desc"
                        v-model="metaConfig.og.description"
                        placeholder="例如：免费使用JSON转TS、颜色处理等工具，无需注册，立即上手"
                        class="form-input form-textarea"
                        rows="2"
                        maxlength="200"
                    ></textarea>
                    <p class="config-hint">
                        社交平台分享时显示的描述（建议150-200字符）<span
                            class="char-count"
                            >{{ metaConfig.og.description.length }}/200</span
                        >
                    </p>
                </div>

                <!-- 内容类型 -->
                <div class="config-item">
                    <label class="section-label" for="og-type"
                        >内容类型（Open Graph）</label
                    >
                    <select
                        id="og-type"
                        v-model="metaConfig.og.type"
                        class="form-input form-select"
                    >
                        <option value="website">网站（整体站点，推荐）</option>
                        <option value="article">文章（单篇内容）</option>
                        <option value="product">产品（商品页面）</option>
                        <option value="profile">个人主页</option>
                    </select>
                </div>

                <!-- Twitter 卡片类型 -->
                <div class="config-item">
                    <label class="section-label" for="twitter-card"
                        >Twitter 卡片类型</label
                    >
                    <select
                        id="twitter-card"
                        v-model="metaConfig.twitter.card"
                        class="form-input form-select"
                    >
                        <option value="summary_large_image">
                            大图卡片（推荐）
                        </option>
                        <option value="summary">小图卡片</option>
                        <option value="app">应用卡片</option>
                        <option value="player">视频卡片</option>
                    </select>
                </div>

                <!-- Twitter 作者账号 -->
                <div class="config-item">
                    <label class="section-label" for="twitter-author"
                        >Twitter 作者账号</label
                    >
                    <input
                        type="text"
                        id="twitter-author"
                        v-model="metaConfig.twitter.author"
                        placeholder="例如：@mytools_dev"
                        class="form-input"
                    />
                </div>
            </div>
        </section>

        <!-- 配置分区：图标与移动适配 -->
        <section class="tool-section">
            <h2 class="section-title">4. 图标与移动适配</h2>
            <div class="config-grid">
                <!-- 网站图标（favicon） -->
                <div class="config-item full-width">
                    <label class="section-label" for="favicon"
                        >网站图标（Favicon）</label
                    >
                    <input
                        type="url"
                        id="favicon"
                        v-model="metaConfig.favicon"
                        placeholder="例如：https://mytools.example.com/favicon.ico"
                        class="form-input"
                    />
                    <p class="config-hint">
                        浏览器标签页图标，推荐尺寸：32x32px 或 64x64px
                    </p>
                </div>

                <!-- 苹果触摸图标 -->
                <div class="config-item">
                    <label class="section-label" for="apple-touch-icon"
                        >苹果触摸图标</label
                    >
                    <input
                        type="url"
                        id="apple-touch-icon"
                        v-model="metaConfig.appleTouchIcon"
                        placeholder="例如：https://mytools.example.com/apple-touch-icon.png"
                        class="form-input"
                    />
                    <p class="config-hint">
                        iOS 设备添加到桌面时显示的图标，推荐尺寸：180x180px
                    </p>
                </div>

                <!-- 视口设置（移动适配） -->
                <div class="config-item full-width">
                    <label class="section-label" for="viewport"
                        >视口配置（移动适配）</label
                    >
                    <select
                        id="viewport"
                        v-model="metaConfig.viewport"
                        class="form-input form-select"
                    >
                        <option value="width=device-width, initial-scale=1.0">
                            默认适配（推荐）
                        </option>
                        <option
                            value="width=device-width, initial-scale=1.0, maximum-scale=1.0"
                        >
                            禁止缩放
                        </option>
                        <option value="width=768, initial-scale=1.0">
                            强制平板宽度（不推荐）
                        </option>
                    </select>
                    <p class="config-hint">
                        控制移动设备如何渲染页面，决定是否支持响应式布局
                    </p>
                </div>

                <!-- 主题色 -->
                <div class="config-item">
                    <label class="section-label" for="theme-color"
                        >浏览器主题色</label
                    >
                    <input
                        type="color"
                        id="theme-color"
                        v-model="metaConfig.themeColor"
                        class="form-input color-input"
                    />
                    <p class="config-hint">
                        匹配网站主色调，影响浏览器地址栏/工具栏颜色（部分浏览器支持）
                    </p>
                </div>
            </div>
        </section>

        <!-- HTML 预览区域（用你的高亮组件） -->
        <section class="tool-section">
            <h2 class="section-title">HTML 代码预览</h2>
            <div class="preview-card">
                <CodeHighlighter :code="generatedHtml" language="html" />
            </div>
        </section>

        <!-- 操作按钮 -->
        <div class="action-section">
            <button
                class="btn btn-primary"
                @click="downloadHtml"
                :disabled="!isValidConfig"
            >
                导出 index.html 文件
            </button>
            <button
                class="btn btn-secondary"
                @click="resetConfig"
                :disabled="isDefaultConfig"
            >
                重置配置
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import CodeHighlighter from "@/components/CodeHighlighter.vue";

// 1. 初始化默认配置（带合理默认值，覆盖所有核心字段）
const defaultConfig = {
    title: "",
    url: "",
    description: "",
    keywords: "",
    lang: "zh-CN",
    charset: "UTF-8",
    canonical: "",
    robots: "index,follow",
    author: "",
    copyright: `© ${new Date().getFullYear()} 网站名称. 保留所有权利.`,
    og: {
        title: "",
        image: "",
        description: "",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        author: "",
    },
    favicon: "",
    appleTouchIcon: "",
    viewport: "width=device-width, initial-scale=1.0",
    themeColor: "#111827", // 与项目主题色（--accent）一致
};

const metaConfig = ref({ ...defaultConfig });

// 2. 转义HTML特殊字符（避免生成的HTML出现语法错误）
const escapeHtml = (str) => {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

// 3. 校验配置合法性（必填项是否填写）
const isValidConfig = computed(() => {
    return !!(
        metaConfig.value.title.trim() &&
        metaConfig.value.url.trim() &&
        metaConfig.value.description.trim() &&
        metaConfig.value.og.image.trim()
    );
});

// 4. 判断是否为默认配置（用于禁用重置按钮）
const isDefaultConfig = computed(() => {
    return JSON.stringify(metaConfig.value) === JSON.stringify(defaultConfig);
});

// 5. 自动同步默认值（提升用户体验，减少重复输入）
watch(
    () => metaConfig.value.title,
    (newTitle) => {
        // 若社交预览标题未填写，自动同步网站标题
        if (!metaConfig.value.og.title.trim()) {
            metaConfig.value.og.title = newTitle;
        }
    },
);

watch(
    () => metaConfig.value.description,
    (newDesc) => {
        // 若社交预览描述未填写，自动同步网站描述
        if (!metaConfig.value.og.description.trim()) {
            metaConfig.value.og.description = newDesc;
        }
    },
);

watch(
    () => metaConfig.value.url,
    (newUrl) => {
        // 若首选域名未填写，自动同步网站域名
        if (!metaConfig.value.canonical.trim()) {
            metaConfig.value.canonical = newUrl;
        }
    },
);

// 6. 生成最终的HTML代码（核心逻辑）
const generatedHtml = computed(() => {
    const c = metaConfig.value;
    const indent = "  "; // 缩进字符，确保代码美观
    const tags = [];

    // 基础元信息
    tags.push(`<!DOCTYPE html>`);
    tags.push(`<html lang="${c.lang}">`);
    tags.push(`${indent}<head>`);

    // 编码与视口设置
    tags.push(`${indent}${indent}<meta charset="${c.charset}">`);
    tags.push(
        `${indent}${indent}<meta name="viewport" content="${c.viewport}">`,
    );

    // 基础SEO标签
    tags.push(`${indent}${indent}<title>${escapeHtml(c.title)}</title>`);
    tags.push(
        `${indent}${indent}<meta name="description" content="${escapeHtml(c.description)}">`,
    );

    // 可选标签：关键词
    if (c.keywords.trim()) {
        tags.push(
            `${indent}${indent}<meta name="keywords" content="${escapeHtml(c.keywords)}">`,
        );
    }

    // 可选标签：作者
    if (c.author.trim()) {
        tags.push(
            `${indent}${indent}<meta name="author" content="${escapeHtml(c.author)}">`,
        );
    }

    // 可选标签：版权
    if (c.copyright.trim()) {
        tags.push(
            `${indent}${indent}<meta name="copyright" content="${escapeHtml(c.copyright)}">`,
        );
    }

    // 搜索引擎索引控制
    tags.push(`${indent}${indent}<meta name="robots" content="${c.robots}">`);

    // 可选标签：首选域名
    if (c.canonical.trim()) {
        tags.push(
            `${indent}${indent}<link rel="canonical" href="${escapeHtml(c.canonical)}">`,
        );
    }

    // 浏览器主题色
    tags.push(
        `${indent}${indent}<meta name="theme-color" content="${c.themeColor}">`,
    );

    // 图标设置
    if (c.favicon.trim()) {
        tags.push(
            `${indent}${indent}<link rel="icon" href="${escapeHtml(c.favicon)}">`,
        );
    }
    if (c.appleTouchIcon.trim()) {
        tags.push(
            `${indent}${indent}<link rel="apple-touch-icon" href="${escapeHtml(c.appleTouchIcon)}">`,
        );
    }

    // Open Graph 标签（社交平台通用）
    tags.push(`${indent}${indent}<!-- Open Graph 社交分享标签 -->`);
    tags.push(
        `${indent}${indent}<meta property="og:title" content="${escapeHtml(c.og.title || c.title)}">`,
    );
    tags.push(
        `${indent}${indent}<meta property="og:description" content="${escapeHtml(c.og.description || c.description)}">`,
    );
    tags.push(
        `${indent}${indent}<meta property="og:image" content="${escapeHtml(c.og.image)}">`,
    );
    tags.push(
        `${indent}${indent}<meta property="og:type" content="${c.og.type}">`,
    );
    tags.push(
        `${indent}${indent}<meta property="og:url" content="${escapeHtml(c.url)}">`,
    );

    // Twitter 特定标签
    tags.push(`${indent}${indent}<!-- Twitter 分享标签 -->`);
    tags.push(
        `${indent}${indent}<meta name="twitter:card" content="${c.twitter.card}">`,
    );
    tags.push(
        `${indent}${indent}<meta name="twitter:title" content="${escapeHtml(c.og.title || c.title)}">`,
    );
    tags.push(
        `${indent}${indent}<meta name="twitter:description" content="${escapeHtml(c.og.description || c.description)}">`,
    );
    tags.push(
        `${indent}${indent}<meta name="twitter:image" content="${escapeHtml(c.og.image)}">`,
    );
    if (c.twitter.author.trim()) {
        tags.push(
            `${indent}${indent}<meta name="twitter:creator" content="${escapeHtml(c.twitter.author)}">`,
        );
    }

    // 闭合头部和HTML结构
    tags.push(`${indent}</head>`);
    tags.push(`${indent}<body>`);
    tags.push(`${indent}${indent}<!-- 网站内容 -->`);
    tags.push(`${indent}${indent}<h1>${escapeHtml(c.title)}</h1>`);
    tags.push(`${indent}${indent}<p>${escapeHtml(c.description)}</p>`);
    tags.push(`${indent}</body>`);
    tags.push(`</html>`);

    return tags.join("\n");
});

// 7. 下载HTML文件
const downloadHtml = () => {
    const htmlContent = generatedHtml.value;
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "index.html";
    document.body.appendChild(a);
    a.click();

    // 清理资源
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

// 8. 重置配置
const resetConfig = () => {
    metaConfig.value = { ...defaultConfig };
};
</script>

<style scoped>
/* 使用统一的设计系统，保留必要的自定义样式 */
.required {
    color: var(--error);
    font-weight: var(--font-weight-bold);
}

.char-count {
    color: var(--accent);
    font-family: monospace;
}

.color-input {
    padding: 2px;
    height: 40px;
}

.preview-card {
    padding: var(--space-sm);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--bg);
    box-shadow: var(--shadow-sm);
    overflow-x: auto;
}

.action-section {
    display: flex;
    gap: var(--space-md);
    justify-content: center;
    margin-top: var(--space-md);
}

/* 手机端特殊适配 */
@media (max-width: 768px) {
    .tool-page {
        padding: var(--space-sm);
        max-width: 100vw;
        width: 100vw;
        margin: 0;
        overflow-x: hidden;
    }

    .tool-section {
        padding: var(--space-md);
        margin-bottom: var(--space-md);
        width: 100%;
        box-sizing: border-box;
    }

    .config-grid {
        grid-template-columns: 1fr;
        gap: var(--space-sm);
        width: 100%;
        min-width: 0;
    }

    .config-item {
        width: 100%;
        box-sizing: border-box;
    }

    .form-input {
        width: 100%;
        box-sizing: border-box;
        font-size: var(--font-size);
    }

    .form-hint {
        font-size: var(--font-size-xs);
        line-height: 1.3;
        word-break: break-word;
    }

    .action-section {
        flex-direction: column;
        align-items: stretch;
        gap: var(--space);
        margin-top: var(--space-lg);
    }

    .color-input {
        height: 48px;
        padding: 4px;
    }
}

@media (max-width: 480px) {
    .tool-page {
        padding: var(--space-xs);
    }

    .tool-section {
        padding: var(--space-sm);
    }

    .form-input {
        padding: var(--space-sm);
        font-size: var(--font-size-sm);
    }

    .color-input {
        height: 44px;
    }

    .form-hint {
        font-size: 10px;
    }
}

/* 横屏手机优化 */
@media (max-width: 768px) and (orientation: landscape) {
    .config-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-sm);
    }

    .full-width {
        grid-column: 1 / -1;
    }

    .action-section {
        flex-direction: row;
        gap: var(--space);
    }
}
</style>
