<script setup>
const props = defineProps({
  sheets: { type: Array, required: true },
  modelValue: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue"]);

function onChange(e) {
  emit("update:modelValue", e.target.value);
}
</script>

<template>
  <div v-if="props.sheets && props.sheets.length" style="margin-left: 8px">
    <select
      :value="props.modelValue"
      @change="onChange"
      style="
        border: 1px solid #ddd;
        border-radius: 6px;
        padding: 4px 6px;
        font-size: 13px;
      "
    >
      <option v-for="name in props.sheets" :key="name" :value="name">
        {{ name }}
      </option>
    </select>
  </div>
</template>

<style scoped></style>
