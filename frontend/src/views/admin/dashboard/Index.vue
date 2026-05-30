<script setup lang="ts">
import LucideIcon from "@/components/LucideIcon.vue";
import { useSidebarStore } from "@/stores/sidebar";

const sidebar = useSidebarStore();

sidebar.setBreadcrumbs([
    {
        title: "Dashboard",
    }
]);
</script>

<template>
    <div class="flex flex-1 flex-col">
        <div class="@container/main flex flex-1 flex-col gap-2">
            <div class="flex flex-1 items-center justify-center py-6">
                <div class="text-center">
                    <div
                        class="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-3xl border bg-card shadow-sm">
                        <LucideIcon icon="diamond" class="h-12 w-12 text-primary" />
                    </div>
                    <h1 class="text-[22px]">
                        Dashboard
                    </h1>
                    <p class="mt-2 text-sm text-muted-foreground">
                        Welcome back to the dashboard
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>