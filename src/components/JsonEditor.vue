<script setup>
import { computed } from "vue";
import "@/assets/style/Json-Dark.css";
import JsonEditorVue from "json-editor-vue";

const { json } = defineProps({
    readOnly: {
        default: false,
    },
    json: {},
});

const emits = defineEmits(["update:json"]);

const modelValue = computed({
    get: () => json,
    set: (value) => emits("update:json", value),
});
</script>

<template>
    <JsonEditorVue
        v-model="modelValue"
        mode="text"
        class="jse-theme-dark"
        :readOnly="readOnly"
    ></JsonEditorVue>
</template>

<style scoped></style>
