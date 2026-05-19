<script setup lang="ts">
import * as Icons from "lucide-vue-next";

defineProps<{
    icon?: string
}>()

const getIcon = (icon: string) => {
    if (!icon) return undefined;

    // -- transform capitalize
    icon = icon
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');

    return Icons[icon as keyof typeof Icons] as Icons.LucideIcon;
};
</script>

<template>
    <component :is="getIcon(icon)" v-if="icon" />
</template>