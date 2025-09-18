<template>
    <div class="tool-page">
        <header class="tool-header">
            <h1>颜色方案生成器</h1>
            <p>生成协调的颜色体系，支持多种格式导出</p>
        </header>

        <main class="main-content">
            <section class="tool-section">
                <h2 class="section-title">主色调设置</h2>

                <div class="color-input-group">
                    <label for="primary-color" class="section-label"
                        >选择主色</label
                    >
                    <div class="color-input-wrapper">
                        <input
                            id="primary-color"
                            type="color"
                            v-model="primaryColorHex"
                            class="color-picker"
                        />
                        <div class="color-value-inputs">
                            <div class="color-value-input">
                                <label class="section-label">HEX</label>
                                <div class="hex-input-wrapper">
                                    <span class="hex-prefix">#</span>
                                    <input
                                        ref="hexInput"
                                        type="text"
                                        :value="hexValueWithoutHash"
                                        @input="updateColorFromHexInput"
                                        @keydown="handleHexKeydown"
                                        placeholder="165DFF"
                                        class="form-input hex-input"
                                        maxlength="6"
                                    />
                                </div>
                            </div>

                            <div class="color-value-input">
                                <label class="section-label">RGB</label>
                                <div class="rgb-input-wrapper">
                                    <input
                                        ref="rgbRInput"
                                        type="number"
                                        :value="rgb.r"
                                        @input="updateRgbValue('r', $event)"
                                        @keydown="handleRgbKeydown($event, 'r')"
                                        placeholder="R"
                                        class="form-input rgb-input"
                                        min="0"
                                        max="255"
                                    />
                                    <input
                                        ref="rgbGInput"
                                        type="number"
                                        :value="rgb.g"
                                        @input="updateRgbValue('g', $event)"
                                        @keydown="handleRgbKeydown($event, 'g')"
                                        placeholder="G"
                                        class="form-input rgb-input"
                                        min="0"
                                        max="255"
                                    />
                                    <input
                                        ref="rgbBInput"
                                        type="number"
                                        :value="rgb.b"
                                        @input="updateRgbValue('b', $event)"
                                        @keydown="handleRgbKeydown($event, 'b')"
                                        placeholder="B"
                                        class="form-input rgb-input"
                                        min="0"
                                        max="255"
                                    />
                                </div>
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
            <section class="tool-section">
                <h2 class="section-title">颜色方案预览</h2>

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
            <section class="tool-section">
                <h2 class="section-title">代码导出</h2>

                <div class="export-options">
                    <button
                        v-for="(format, index) in exportFormats"
                        :key="index"
                        class="btn"
                        :class="{
                            'btn-primary': activeFormat === index,
                            'btn-secondary': activeFormat !== index,
                        }"
                        @click="activeFormat = index"
                    >
                        {{ format.name }}
                    </button>
                </div>

                <div class="code-output">
                    <CodeHighlighter
                        :code="getExportCode(exportFormats[activeFormat].type)"
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

// 输入框引用
const hexInput = ref(null);
const rgbRInput = ref(null);
const rgbGInput = ref(null);
const rgbBInput = ref(null);

// HEX值不带#号
const hexValueWithoutHash = computed(() => {
    return primaryColorHex.value.substring(1);
});

// 从HEX输入框更新颜色值（不带#号）
const updateColorFromHexInput = (e) => {
    const hexValue = e.target.value.trim().toUpperCase();

    // 验证输入是否为有效的十六进制颜色值
    if (!/^[0-9A-F]{0,6}$/i.test(hexValue)) return;

    // 如果输入长度为3或6，则更新颜色
    if (hexValue.length === 3 || hexValue.length === 6) {
        const fullHex = "#" + hexValue;
        primaryColorHex.value = fullHex;
        updateColorFromHex({ target: { value: fullHex } });
    }
};

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

// 更新单个RGB值
const updateRgbValue = (component, e) => {
    const value = parseInt(e.target.value, 10);

    // 验证值范围
    if (isNaN(value) || value < 0 || value > 255) return;

    // 更新对应的RGB分量
    rgb.value[component] = value;

    // 更新HEX和HSL值
    hsl.value = rgbToHsl(rgb.value.r, rgb.value.g, rgb.value.b);
    primaryColorHex.value = rgbToHex(rgb.value.r, rgb.value.g, rgb.value.b);

    // 自动聚焦下一个输入框（当输入3位数字时）
    const inputValue = e.target.value;
    if (inputValue.length === 3) {
        focusNextRgbInput(component);
    }
};

// 处理RGB输入框的键盘事件
const handleRgbKeydown = (e, component) => {
    const { key, target } = e;

    // Tab键或Enter键：跳转到下一个输入框
    if (key === "Tab" || key === "Enter") {
        if (key === "Enter") {
            e.preventDefault();
            focusNextRgbInput(component);
        }
        return;
    }

    // 方向键导航
    if (key === "ArrowRight") {
        // 如果光标在输入框末尾，跳转到下一个输入框
        if (target.selectionStart === target.value.length) {
            e.preventDefault();
            focusNextRgbInput(component);
        }
    } else if (key === "ArrowLeft") {
        // 如果光标在输入框开头，跳转到上一个输入框
        if (target.selectionStart === 0) {
            e.preventDefault();
            focusPrevRgbInput(component);
        }
    }

    // Backspace键：如果当前输入框为空，跳转到上一个输入框
    if (key === "Backspace" && target.value === "") {
        e.preventDefault();
        focusPrevRgbInput(component);
    }
};

// 聚焦下一个RGB输入框
const focusNextRgbInput = (currentComponent) => {
    const inputMap = {
        r: rgbGInput,
        g: rgbBInput,
        b: rgbRInput, // 循环回到第一个
    };

    const nextInput = inputMap[currentComponent];
    if (nextInput?.value) {
        nextInput.value.focus();
        nextInput.value.select(); // 选中所有文本，方便替换
    }
};

// 聚焦上一个RGB输入框
const focusPrevRgbInput = (currentComponent) => {
    const inputMap = {
        r: rgbBInput, // 循环到最后一个
        g: rgbRInput,
        b: rgbGInput,
    };

    const prevInput = inputMap[currentComponent];
    if (prevInput?.value) {
        prevInput.value.focus();
        prevInput.value.select(); // 选中所有文本，方便替换
    }
};

// 处理HEX输入框的键盘事件
const handleHexKeydown = (e) => {
    const { key } = e;

    // Tab键或Enter键：跳转到RGB的R输入框
    if (key === "Tab" || key === "Enter") {
        if (key === "Enter") {
            e.preventDefault();
            if (rgbRInput.value) {
                rgbRInput.value.focus();
                rgbRInput.value.select();
            }
        }
    }

    // 当输入满6位时，自动跳转到RGB输入框
    if (e.target.value.length === 5 && /^[0-9A-Fa-f]$/.test(key)) {
        setTimeout(() => {
            if (rgbRInput.value) {
                rgbRInput.value.focus();
                rgbRInput.value.select();
            }
        }, 0);
    }
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

<style scoped>
/* 使用统一的设计系统，保留颜色生成器特有的样式 */

/* 主内容布局 */
.main-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xl);
}

/* 颜色输入组 */
.color-input-group {
    margin-bottom: var(--space-xl);
}

.color-input-group .section-label {
    margin-bottom: var(--space-md);
}

.color-input-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-lg);
    align-items: center;
    padding: var(--space-lg);
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
}

.color-picker {
    width: 60px;
    height: 60px;
    border: 2px solid var(--border);
    border-radius: var(--radius);
    cursor: pointer;
    padding: 0;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition: all 0.2s ease;
    background: transparent;
}

.color-picker:hover {
    box-shadow: var(--shadow-md);
    transform: scale(1.05);
    border-color: var(--accent);
}

.color-value-inputs {
    flex: 1;
    min-width: 300px;
    display: flex;
    gap: var(--space-lg);
}

.color-value-input {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
}

.color-value-input .section-label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--text);
    margin-bottom: var(--space-xs);
    display: block;
}

/* HEX输入框样式 */
.hex-input-wrapper {
    display: flex;
    align-items: center;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    background: var(--bg);
    transition: all 0.2s ease;
    box-shadow: var(--shadow-sm);
}

.hex-input-wrapper:focus-within {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.1);
    transform: translateY(-1px);
}

.hex-prefix {
    background: var(--bg-secondary);
    padding: var(--space-sm) var(--space);
    font-family: var(--font-mono, monospace);
    font-weight: var(--font-weight-semibold);
    color: var(--text-secondary);
    border-right: 1px solid var(--border);
    user-select: none;
    font-size: var(--font-size-sm);
}

.hex-input {
    border: none !important;
    box-shadow: none !important;
    font-family: var(--font-mono, monospace);
    text-transform: uppercase;
    background: var(--bg);
    color: var(--text);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    letter-spacing: 0.5px;
    padding: var(--space-sm);
    width: 100%;
    transition: all 0.2s ease;
}

.hex-input:focus {
    outline: none;
    border: none !important;
    box-shadow: none !important;
    background: var(--bg-secondary);
}

/* RGB输入框样式 */
.rgb-input-wrapper {
    display: flex;
    gap: var(--space-sm);
}

.rgb-input {
    flex: 1;
    text-align: center;
    font-family: var(--font-mono, monospace);
    min-width: 0;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    box-shadow: var(--shadow-sm);
    padding: var(--space-sm);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    transition: all 0.2s ease;
}

.rgb-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.1);
    transform: translateY(-1px);
    background: var(--bg-secondary);
}

.rgb-input::-webkit-outer-spin-button,
.rgb-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.rgb-input[type="number"] {
    -moz-appearance: textfield;
}

/* 键盘导航优化 */
.hex-input:focus,
.rgb-input:focus {
    transform: translateY(-1px);
    box-shadow:
        0 0 0 3px rgba(17, 24, 39, 0.15),
        var(--shadow) !important;
    transition: all 0.2s ease;
}

.hex-input-wrapper:focus-within {
    transform: translateY(-1px);
    transition: all 0.2s ease;
}

/* 输入框选中状态 */
.hex-input::selection,
.rgb-input::selection {
    background-color: rgba(17, 24, 39, 0.2);
}

/* 提示用户可以使用键盘导航 */
.color-value-inputs::after {
    content: "💡 提示：使用 Tab、Enter 或方向键快速切换输入框";
    display: block;
    font-size: var(--font-size-xs);
    color: var(--text-muted);
    margin-top: var(--space-sm);
    text-align: center;
    opacity: 0.8;
}

/* 颜色预览 */
.color-preview {
    display: flex;
    align-items: center;
    gap: var(--space-lg);
    margin-top: var(--space-lg);
    padding: var(--space-xl);
    background: var(--bg);
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
}

.color-swatch {
    width: 80px;
    height: 80px;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    border: 2px solid var(--border-light);
    transition: all 0.2s ease;
}

.color-swatch:hover {
    transform: scale(1.05);
    box-shadow: var(--shadow-lg);
}

.color-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    flex: 1;
}

.color-info div {
    font-size: var(--font-size-sm);
    color: var(--text);
    padding: var(--space-xs) 0;
    border-bottom: 1px solid var(--border-light);
}

.color-info div:last-child {
    border-bottom: none;
}

.color-info strong {
    color: var(--accent);
    width: 60px;
    display: inline-block;
    font-weight: var(--font-weight-semibold);
}

/* 颜色组 */
.color-group {
    margin-bottom: var(--space-3xl);
    padding: var(--space-xl);
    background: var(--bg);
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
}

.color-group:last-child {
    margin-bottom: 0;
}

.color-group h3 {
    color: var(--accent);
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    margin-bottom: var(--space-lg);
    padding-bottom: var(--space-sm);
    border-bottom: 2px solid var(--border);
    display: flex;
    align-items: center;
    gap: var(--space-sm);
}

.color-group h3::before {
    content: "";
    width: 4px;
    height: 20px;
    background: linear-gradient(135deg, var(--accent), var(--accent-light));
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-sm);
}

.color-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: var(--space-lg);
}

.color-item {
    border-radius: var(--radius-md);
    padding: var(--space-lg);
    min-height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: var(--shadow-sm);
    transition: all 0.3s ease;
    border: 2px solid transparent;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.color-item::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.1),
        rgba(255, 255, 255, 0)
    );
    opacity: 0;
    transition: opacity 0.3s ease;
}

.color-item:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: rgba(255, 255, 255, 0.2);
}

.color-item:hover::before {
    opacity: 1;
}

.color-code {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    word-break: break-all;
    background: rgba(0, 0, 0, 0.1);
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius);
    backdrop-filter: blur(4px);
}

.color-name {
    font-size: var(--font-size-xs);
    opacity: 0.9;
    margin-top: var(--space-sm);
    font-weight: var(--font-weight-medium);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* 导出选项 */
.export-options {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
}

.code-output {
    border-radius: var(--radius-md);
    overflow: hidden;
    border: 1px solid var(--border);
    background: var(--bg);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .color-input-wrapper {
        flex-direction: column;
        gap: var(--space-lg);
        padding: var(--space-lg);
    }

    .color-picker {
        width: 50px;
        height: 50px;
        align-self: center;
    }

    .color-value-inputs {
        flex-direction: column;
        min-width: auto;
        gap: var(--space-lg);
    }

    .color-preview {
        flex-direction: column;
        text-align: center;
        gap: var(--space-lg);
        padding: var(--space-lg);
    }

    .color-swatch {
        width: 60px;
        height: 60px;
        align-self: center;
    }

    .color-info {
        gap: var(--space-sm);
        width: 100%;
    }

    .color-group {
        margin-bottom: var(--space-2xl);
        padding: var(--space-lg);
    }

    .color-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-md);
    }

    .color-item {
        min-height: 100px;
        padding: var(--space-md);
    }

    .color-code {
        font-size: var(--font-size-xs);
        padding: var(--space-xs);
    }

    .color-name {
        font-size: var(--font-size-xs);
        margin-top: var(--space-xs);
    }

    .export-options {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-sm);
    }

    .color-value-inputs::after {
        font-size: 10px;
        margin-top: var(--space-xs);
    }
}

/* 超小屏幕优化 */
@media (max-width: 480px) {
    .color-input-wrapper {
        padding: var(--space-md);
        gap: var(--space-md);
    }

    .color-grid {
        grid-template-columns: 1fr;
        gap: var(--space-sm);
    }

    .color-item {
        min-height: 90px;
        padding: var(--space-sm);
    }

    .color-code {
        font-size: 10px;
        padding: var(--space-xs);
    }

    .color-name {
        font-size: 9px;
    }

    .color-preview {
        padding: var(--space-md);
        gap: var(--space-md);
    }

    .color-group {
        padding: var(--space-md);
        margin-bottom: var(--space-xl);
    }

    .export-options {
        grid-template-columns: 1fr;
    }

    .rgb-input-wrapper {
        gap: var(--space-xs);
    }

    .hex-input-wrapper {
        max-width: 100%;
    }

    .color-value-inputs::after {
        display: none; /* 在小屏幕上隐藏提示文本 */
    }
}
</style>
