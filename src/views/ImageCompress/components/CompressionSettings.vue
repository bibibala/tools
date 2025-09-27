<template>
    <div class="config-grid">
        <div class="config-item">
            <label for="quality">压缩质量</label>
            <div class="input-group">
                <input
                    id="quality"
                    :value="quality * 100"
                    @input="updateQuality"
                    type="range"
                    min="1"
                    max="100"
                    class="form-range"
                />
                <span class="value-display">{{ quality }}%</span>
            </div>
        </div>

        <div class="config-item">
            <label for="maxWidth">最大宽度</label>
            <div class="input-group">
                <input
                    id="maxWidth"
                    :value="maxWidth"
                    @input="updateMaxWidth"
                    type="number"
                    placeholder="不限制"
                    min="1"
                    class="form-input"
                />
                <span class="unit">px</span>
            </div>
        </div>

        <div class="config-item">
            <label for="maxHeight">最大高度</label>
            <div class="input-group">
                <input
                    id="maxHeight"
                    :value="maxHeight"
                    @input="updateMaxHeight"
                    type="number"
                    placeholder="不限制"
                    min="1"
                    class="form-input"
                />
                <span class="unit">px</span>
            </div>
        </div>

        <div class="config-item">
            <label for="format">输出格式</label>
            <select
                id="format"
                :value="format"
                @change="updateFormat"
                class="form-select"
            >
                <option value="original">保持原格式</option>
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
            </select>
        </div>
    </div>
</template>

<script setup>
defineProps({
    quality: {
        type: Number,
        default: 0.8,
    },
    maxWidth: {
        type: Number,
        default: 1920,
    },
    maxHeight: {
        type: Number,
        default: 1080,
    },
    format: {
        type: String,
        default: "original",
    },
    isProcessing: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits([
    "update:quality",
    "update:max-width",
    "update:max-height",
    "update:format",
]);

// 更新质量
const updateQuality = (event) => {
    emit("update:quality", parseFloat(event.target.value) / 100);
};

// 更新最大宽度
const updateMaxWidth = (event) => {
    emit("update:max-width", parseInt(event.target.value));
};

// 更新最大高度
const updateMaxHeight = (event) => {
    emit("update:max-height", parseInt(event.target.value));
};

// 更新格式
const updateFormat = (event) => {
    emit("update:format", event.target.value);
};
</script>

<style scoped>
.input-group.quality-slider {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
}

.value-display {
    font-weight: var(--font-weight-semibold);
    color: var(--info);
    min-width: 40px;
    text-align: center;
    font-size: var(--font-size-sm);
}

.input-group {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    flex-wrap: nowrap;
}

.unit {
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    white-space: nowrap;
    flex-shrink: 0;
}

/* 确保数字输入框不会过宽 */
.form-input[type="number"] {
    min-width: 80px;
    max-width: 120px;
}

@media (max-width: 768px) {
    .config-grid {
        grid-template-columns: 1fr;
    }
}
</style>
