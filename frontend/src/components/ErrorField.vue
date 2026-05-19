<script lang="ts">
export interface ErrorMessage {
    property: string;
    message: string;
}
</script>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
    name?: string;
    data: ErrorMessage[];
}>();

const errorMessage = computed(() => {
    return props.data.find(
        item => item.property === props.name
    )?.message;
});
</script>

<template>
    <small v-if="errorMessage" class="text-red-800 dark:text-red-400 mt-[-6px]">
        {{ errorMessage }}
    </small>
</template>