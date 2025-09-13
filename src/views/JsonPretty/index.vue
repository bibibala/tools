<script>
import { defineComponent } from "vue";
import JsonEditor from "@/components/JsonEditor.vue";

export default defineComponent({
    components: { JsonEditor },
});
</script>
<template>
    <JsonEditor style="height: 100vh"></JsonEditor>
</template>
