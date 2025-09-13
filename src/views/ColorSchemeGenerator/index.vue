<template>
    <div class="color-generator">
        <header class="app-header">
            <h1>颜色方案生成器</h1>
            <p>生成协调的颜色体系，支持多种格式导出</p>
        </header>

        <main class="main-content">
            <section class="primary-color-input">
                <h2>主色调设置</h2>

                <div class="color-input-group">
                    <label for="primary-color">选择主色</label>
                    <div class="color-input-wrapper">
                        <input
                            id="primary-color"
                            type="color"
                            v-model="primaryColorHex"
                            class="color-picker"
                        />
                        <div class="color-value-inputs">
                            <div class="color-value-input">
                                <label>HEX</label>
                                <input
                                    type="text"
                                    v-model="primaryColorHex"
                                    @input="updateColorFromHex"
                                    placeholder="#RRGGBB"
                                />
                            </div>

                            <div class="color-value-input">
                                <label>RGB</label>
                                <input
                                    type="text"
                                    :value="rgbString"
                                    @input="updateColorFromRgb"
                                    placeholder="r, g, b"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="color-preview">
                    <div
                        class="color-swatch"
                        :style="{ backgroundColor: primaryColorHex }"
                    ></div>
                    <div class="color-info">
                        <div><strong>HEX:</strong> {{ primaryColorHex }}</div>
                        <div>
                            <strong>RGB:</strong> rgb({{ rgb.r }}, {{ rgb.g }},
                            {{ rgb.b }})
                        </div>
                        <div>
                            <strong>HSL:</strong> hsl({{ hsl.h }}, {{ hsl.s }}%,
                            {{ hsl.l }}%)
                        </div>
                    </div>
                </div>
            </section>

            <!-- 颜色方案预览 -->
            <section class="color-scheme-preview">
                <h2>颜色方案预览</h2>

                <!-- 主色变体 -->
                <div class="color-group">
                    <h3>主色变体</h3>
                    <div class="color-grid">
                        <div
                            v-for="(shade, index) in primaryColorShades"
                            :key="index"
                            class="color-item"
                            :style="{ backgroundColor: shade.color }"
                        >
                            <div class="color-code">{{ shade.color }}</div>
                            <div class="color-name">{{ shade.name }}</div>
                        </div>
                    </div>
                </div>

                <!-- 辅助色 -->
                <div class="color-group">
                    <h3>辅助色</h3>
                    <div class="color-grid">
                        <div
                            v-for="(color, index) in accentColors"
                            :key="index"
                            class="color-item"
                            :style="{ backgroundColor: color.color }"
                        >
                            <div class="color-code">{{ color.color }}</div>
                            <div class="color-name">{{ color.name }}</div>
                        </div>
                    </div>
                </div>

                <!-- 中性色 -->
                <div class="color-group">
                    <h3>中性色</h3>
                    <div class="color-grid">
                        <div
                            v-for="(shade, index) in neutralColors"
                            :key="index"
                            class="color-item"
                            :style="{
                                backgroundColor: shade.color,
                                color: shade.textColor,
                            }"
                        >
                            <div class="color-code">{{ shade.color }}</div>
                            <div class="color-name">{{ shade.name }}</div>
                        </div>
                    </div>
                </div>

                <!-- 功能色 -->
                <div class="color-group">
                    <h3>功能色</h3>
                    <div class="color-grid">
                        <div
                            v-for="(color, index) in functionalColors"
                            :key="index"
                            class="color-item"
                            :style="{
                                backgroundColor: color.color,
                                color: color.textColor,
                            }"
                        >
                            <div class="color-code">{{ color.color }}</div>
                            <div class="color-name">{{ color.name }}</div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 代码导出 -->
            <section class="code-export">
                <h2>代码导出</h2>

                <div class="export-options">
                    <button
                        v-for="(format, index) in exportFormats"
                        :key="index"
                        class="format-btn"
                        :class="{ active: activeFormat === index }"
                        @click="activeFormat = index"
                    >
                        {{ format.name }}
                    </button>
                </div>

                <div class="code-output">
                    <CodeHighlighter
                        :code="getExportCode(exportFormats[activeFormat].type)"
                        :language="
                            getLanguageForFormat(
                                exportFormats[activeFormat].type,
                            )
                        "
                    />
                </div>
            </section>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import CodeHighlighter from "@/components/CodeHighlighter.vue";

// 主色状态
const primaryColorHex = ref("#165DFF");
const rgb = ref({ r: 22, g: 93, b: 255 });
const hsl = ref({ h: 222, s: 100, l: 54 });

// RGB字符串格式化
const rgbString = computed(
    () => `${rgb.value.r}, ${rgb.value.g}, ${rgb.value.b}`,
);

// 从HEX更新颜色值
const updateColorFromHex = (e) => {
    const hex = e.target.value.trim();
    if (!/^#([0-9A-F]{3}){1,2}$/i.test(hex)) return;

    // 转换为RGB
    let r = 0,
        g = 0,
        b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }

    // 更新RGB和HSL值
    rgb.value = { r, g, b };
    hsl.value = rgbToHsl(r, g, b);
};

// 从RGB更新颜色值
const updateColorFromRgb = (e) => {
    const inputValue = e.target.value.trim();
    // 使用更宽松的正则匹配RGB值
    const rgbMatch = inputValue.match(/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*$/);

    if (rgbMatch) {
        const r = parseInt(rgbMatch[1], 10);
        const g = parseInt(rgbMatch[2], 10);
        const b = parseInt(rgbMatch[3], 10);

        // 验证RGB值范围
        if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
            rgb.value = { r, g, b };
            hsl.value = rgbToHsl(r, g, b);
            primaryColorHex.value = rgbToHex(r, g, b);
            return;
        }
    }

    // 输入无效时不更新
    console.warn(
        '无效的RGB格式，请使用 "r, g, b" 格式，其中每个值为0-255之间的整数',
    );
};

// RGB转HSL
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
        s,
        l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // 灰色
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }

        h *= 60;
    }

    return {
        h: Math.round(h),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    };
}

// RGB转HEX
function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

// 生成主色变体
const primaryColorShades = computed(() => {
    const shades = [
        { name: "50", lightness: Math.min(hsl.value.l + 45, 95) },
        { name: "100", lightness: Math.min(hsl.value.l + 30, 90) },
        { name: "200", lightness: Math.min(hsl.value.l + 15, 80) },
        { name: "300", lightness: hsl.value.l + 5 },
        { name: "400", lightness: hsl.value.l - 5 },
        { name: "500", lightness: hsl.value.l }, // 基础主色
        { name: "600", lightness: hsl.value.l - 15 },
        { name: "700", lightness: hsl.value.l - 30 },
        { name: "800", lightness: hsl.value.l - 45 },
        { name: "900", lightness: hsl.value.l - 60 },
    ];

    return shades.map((shade) => ({
        name: `Primary ${shade.name}`,
        color: `hsl(${hsl.value.h}, ${hsl.value.s}%, ${shade.lightness}%)`,
        textColor: getContrastColor(
            `hsl(${hsl.value.h}, ${hsl.value.s}%, ${shade.lightness}%)`,
        ),
    }));
});

// 生成辅助色
const accentColors = computed(() => {
    // 辅助色基于主色的色相偏移
    const offsets = [30, 60, 120, 180, 240, 300];

    return offsets.map((offset, index) => {
        const hue = (hsl.value.h + offset) % 360;
        const color = `hsl(${hue}, ${hsl.value.s}%, ${hsl.value.l}%)`;
        return {
            name: `Accent ${index + 1}`,
            color,
            textColor: getContrastColor(color),
        };
    });
});

// 生成中性色
const neutralColors = computed(() => {
    const shades = [
        { name: "White", lightness: 100 },
        { name: "Gray 50", lightness: 95 },
        { name: "Gray 100", lightness: 90 },
        { name: "Gray 200", lightness: 80 },
        { name: "Gray 300", lightness: 70 },
        { name: "Gray 400", lightness: 60 },
        { name: "Gray 500", lightness: 50 },
        { name: "Gray 600", lightness: 40 },
        { name: "Gray 700", lightness: 30 },
        { name: "Gray 800", lightness: 20 },
        { name: "Gray 900", lightness: 10 },
        { name: "Black", lightness: 0 },
    ];

    return shades.map((shade) => {
        const color = `hsl(0, 0%, ${shade.lightness}%)`;
        return {
            name: shade.name,
            color,
            textColor: getContrastColor(color),
        };
    });
});

// 生成功能色
const functionalColors = computed(() => {
    return [
        { name: "Success", color: "#10B981" }, // 绿色
        { name: "Warning", color: "#F59E0B" }, // 黄色
        { name: "Error", color: "#EF4444" }, // 红色
        { name: "Info", color: "#3B82F6" }, // 蓝色
    ].map((color) => ({
        ...color,
        textColor: getContrastColor(color.color),
    }));
});

// 计算对比度文本颜色
function getContrastColor(hexColor) {
    // 解析颜色
    let r, g, b;

    // 处理HSL颜色
    if (hexColor.startsWith("hsl")) {
        const hslMatch = hexColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        if (hslMatch) {
            const h = parseInt(hslMatch[1]),
                s = parseInt(hslMatch[2]) / 100,
                l = parseInt(hslMatch[3]) / 100;
            [r, g, b] = hslToRgb(h, s, l);
        }
    }
    // 处理HEX颜色
    else if (hexColor.startsWith("#")) {
        if (hexColor.length === 4) {
            r = parseInt(hexColor[1] + hexColor[1], 16);
            g = parseInt(hexColor[2] + hexColor[2], 16);
            b = parseInt(hexColor[3] + hexColor[3], 16);
        } else if (hexColor.length === 7) {
            r = parseInt(hexColor[1] + hexColor[2], 16);
            g = parseInt(hexColor[3] + hexColor[4], 16);
            b = parseInt(hexColor[5] + hexColor[6], 16);
        }
    }

    // 计算亮度
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // 返回对比度最高的颜色
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

// HSL转RGB（用于对比度计算）
function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // 灰色
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h / 360 + 1 / 3);
        g = hue2rgb(p, q, h / 360);
        b = hue2rgb(p, q, h / 360 - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

const exportFormats = [
    { name: "CSS变量", type: "css" },
    { name: "SCSS变量", type: "scss" },
    { name: "JavaScript", type: "js" },
    { name: "Tailwind", type: "tailwind" },
];

const activeFormat = ref(0);

const getLanguageForFormat = (format) => {
    switch (format) {
        case "css":
            return "css";
        case "scss":
            return "scss";
        case "js":
            return "javascript";
        case "tailwind":
            return "javascript";
        default:
            return "text";
    }
};

// 生成导出代码
const getExportCode = (format) => {
    switch (format) {
        case "css":
            return generateCssVariables();
        case "scss":
            return generateScssVariables();
        case "js":
            return generateJsObject();
        case "tailwind":
            return generateTailwindConfig();
        default:
            return "";
    }
};

// 生成CSS变量
function generateCssVariables() {
    let css = ":root {\n";

    // 主色
    primaryColorShades.value.forEach((shade) => {
        const varName = shade.name.toLowerCase().replace(/ /g, "-");
        css += `  --${varName}: ${shade.color};\n`;
        css += `  --${varName}-text: ${shade.textColor};\n`;
    });

    // 辅助色
    accentColors.value.forEach((color, index) => {
        css += `  --accent-${index + 1}: ${color.color};\n`;
        css += `  --accent-${index + 1}-text: ${color.textColor};\n`;
    });

    // 中性色
    neutralColors.value.forEach((shade) => {
        const varName = shade.name.toLowerCase().replace(/ /g, "-");
        css += `  --${varName}: ${shade.color};\n`;
        css += `  --${varName}-text: ${shade.textColor};\n`;
    });

    // 功能色
    functionalColors.value.forEach((color) => {
        const varName = color.name.toLowerCase();
        css += `  --${varName}: ${color.color};\n`;
        css += `  --${varName}-text: ${color.textColor};\n`;
    });

    css += "}";
    return css;
}

// 生成SCSS变量
function generateScssVariables() {
    let scss = "";

    // 主色
    primaryColorShades.value.forEach((shade) => {
        const varName = shade.name.toLowerCase().replace(/ /g, "_");
        scss += `$${varName}: ${shade.color};\n`;
        scss += `$${varName}_text: ${shade.textColor};\n`;
    });

    scss += "\n";

    // 辅助色
    accentColors.value.forEach((color, index) => {
        scss += `$accent_${index + 1}: ${color.color};\n`;
        scss += `$accent_${index + 1}_text: ${color.textColor};\n`;
    });

    scss += "\n";

    // 中性色
    neutralColors.value.forEach((shade) => {
        const varName = shade.name.toLowerCase().replace(/ /g, "_");
        scss += `$${varName}: ${shade.color};\n`;
        scss += `$${varName}_text: ${shade.textColor};\n`;
    });

    scss += "\n";

    // 功能色
    functionalColors.value.forEach((color) => {
        const varName = color.name.toLowerCase();
        scss += `$${varName}: ${color.color};\n`;
        scss += `$${varName}_text: ${color.textColor};\n`;
    });

    return scss;
}

// 生成JavaScript对象
function generateJsObject() {
    const colorObj = {
        primary: {},
        accent: {},
        neutral: {},
        functional: {},
    };

    // 主色
    primaryColorShades.value.forEach((shade) => {
        const key = shade.name.toLowerCase().replace("primary ", "");
        colorObj.primary[key] = {
            color: shade.color,
            textColor: shade.textColor,
        };
    });

    // 辅助色
    accentColors.value.forEach((color, index) => {
        colorObj.accent[index + 1] = {
            color: color.color,
            textColor: color.textColor,
        };
    });

    // 中性色
    neutralColors.value.forEach((shade) => {
        const key = shade.name.toLowerCase().replace(" ", "-");
        colorObj.neutral[key] = {
            color: shade.color,
            textColor: shade.textColor,
        };
    });

    // 功能色
    functionalColors.value.forEach((color) => {
        const key = color.name.toLowerCase();
        colorObj.functional[key] = {
            color: color.color,
            textColor: color.textColor,
        };
    });

    return `const colorScheme = ${JSON.stringify(colorObj, null, 2)};`;
}

// 生成Tailwind配置
function generateTailwindConfig() {
    let config =
        "module.exports = {\n  theme: {\n    extend: {\n      colors: {\n";

    // 主色
    config += "        primary: {\n";
    primaryColorShades.value.forEach((shade) => {
        const key = shade.name.toLowerCase().replace("primary ", "");
        config += `          '${key}': '${shade.color}',\n`;
    });
    config += "        },\n";

    // 辅助色
    config += "        accent: {\n";
    accentColors.value.forEach((color, index) => {
        config += `          '${index + 1}': '${color.color}',\n`;
    });
    config += "        },\n";

    // 中性色
    config += "        neutral: {\n";
    neutralColors.value.forEach((shade) => {
        const key = shade.name
            .toLowerCase()
            .replace("gray ", "")
            .replace("white", "1000")
            .replace("black", "0");
        config += `          '${key}': '${shade.color}',\n`;
    });
    config += "        },\n";

    // 功能色
    config +=
        "        success: {\n          DEFAULT: '" +
        functionalColors.value[0].color +
        "'\n        },\n";
    config +=
        "        warning: {\n          DEFAULT: '" +
        functionalColors.value[1].color +
        "'\n        },\n";
    config +=
        "        error: {\n          DEFAULT: '" +
        functionalColors.value[2].color +
        "'\n        },\n";
    config +=
        "        info: {\n          DEFAULT: '" +
        functionalColors.value[3].color +
        "'\n        }\n";

    config += "      }\n    }\n  }\n};";
    return config;
}

watch(primaryColorHex, (newVal) => {
    const inputEvent = { target: { value: newVal } };
    updateColorFromHex(inputEvent);
});
</script>

<style>
/* 样式保持不变 */
.color-generator {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
    color: #333;
    line-height: 1.6;
}

.app-header {
    text-align: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
}

.app-header h1 {
    color: #2c3e50;
    margin-bottom: 10px;
    font-size: 2rem;
}

.app-header p {
    color: #7f8c8d;
    font-size: 1.1rem;
}

.main-content {
    display: flex;
    flex-direction: column;
    gap: 40px;
}

section h2 {
    color: #2c3e50;
    font-size: 1.5rem;
    margin-top: 0;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

/* 主色输入区域 */
.primary-color-input {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 25px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.color-input-group {
    margin-bottom: 25px;
}

.color-input-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #2c3e50;
}

.color-input-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    align-items: center;
}

.color-picker {
    width: 60px;
    height: 60px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    padding: 0;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.color-value-inputs {
    flex: 1;
    min-width: 300px;
    display: flex;
    gap: 15px;
}

.color-value-input {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.color-value-input label {
    font-size: 0.85rem;
    color: #666;
    margin-bottom: 0;
}

.color-value-input input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: monospace;
}

.color-value-input input:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.color-preview {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-top: 10px;
}

.color-swatch {
    width: 80px;
    height: 80px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.color-info {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.color-info div {
    font-size: 0.95rem;
}

.color-info strong {
    color: #2c3e50;
    width: 50px;
    display: inline-block;
}

/* 颜色方案预览 */
.color-scheme-preview {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 25px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.color-group {
    margin-bottom: 35px;
}

.color-group:last-child {
    margin-bottom: 0;
}

.color-group h3 {
    color: #34495e;
    font-size: 1.2rem;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.color-group h3::before {
    content: "";
    width: 4px;
    height: 18px;
    background-color: #3498db;
    border-radius: 2px;
}

.color-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 15px;
}

.color-item {
    border-radius: 6px;
    padding: 15px;
    min-height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition:
        transform 0.2s,
        box-shadow 0.2s;
}

.color-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.color-code {
    font-family: monospace;
    font-size: 0.9rem;
    font-weight: 500;
    word-break: break-all;
}

.color-name {
    font-size: 0.85rem;
    opacity: 0.9;
    margin-top: 8px;
}

/* 代码导出区域 */
.code-export {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 25px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.export-options {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 15px;
}

.format-btn {
    padding: 8px 16px;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s;
}

.format-btn:hover {
    background-color: #f1f5f9;
    border-color: #b8c2cc;
}

.format-btn.active {
    background-color: #3498db;
    color: white;
    border-color: #3498db;
}

@media (max-width: 768px) {
    .color-value-inputs {
        flex-direction: column;
        min-width: auto;
    }

    .color-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }

    .color-item {
        min-height: 100px;
        padding: 12px;
    }

    .color-code,
    .color-name {
        font-size: 0.8rem;
    }
}
</style>
