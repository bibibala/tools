<script setup>
import { ref } from "vue";

const { src } = defineProps({
    src: {
        type: String,
    },
    alt: {
        type: String,
    },
});

const handleImageError = (event) => {
    event.target.style.display = "none";
    event.target.parentElement.style.display = "none";
};

function resolveRelativePath(path) {
    return "src/views/HarmfulToPets/" + path;
}

const url = ref(null);
url.value = resolveRelativePath(src);
</script>

<template>
    <img :src="url" :alt="alt" @error="handleImageError" />
</template>

<style scoped></style>
