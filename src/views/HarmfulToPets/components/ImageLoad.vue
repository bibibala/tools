<script setup>
import { ref } from "vue";

const { src, alt } = defineProps({
    src: String,
    alt: String,
});

const url = ref(null);

url.value = new URL(`../views/HarmfulToPets/${src}`, import.meta.url).href;

const handleImageError = (event) => {
    event.target.style.display = "none";
    event.target.parentElement.style.display = "none";
};
</script>

<template>
    <img :src="url" :alt="alt" @error="handleImageError" />
</template>
