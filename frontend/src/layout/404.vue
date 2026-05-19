<script setup lang="ts">
import { RouterLink } from "vue-router";
import LucideIcon from "@/components/LucideIcon.vue";
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-background px-6">
        <div class="w-full max-w-xl text-center">
            <div class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border bg-card">
                <LucideIcon icon="triangle-alert" class="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 class="text-7xl font-black tracking-tight text-foreground">
                404
            </h1>
            <h2 class="mt-4 text-2xl font-semibold text-foreground">
                Page Not Found
            </h2>
            <p class="mt-3 text-muted-foreground leading-relaxed">
                The page you are looking for does not exist,
                may have been moved, or is temporarily unavailable.
            </p>
            <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <RouterLink to="/"
                    class="inline-flex items-center justify-center rounded-lg border px-5 py-2.5 text-sm font-medium transition hover:bg-muted">
                    <LucideIcon icon="house" class="mr-2 h-4 w-4" />
                    Back to Dashboard
                </RouterLink>
                <button type="button" onclick="history.back()"
                    class="inline-flex items-center justify-center rounded-lg border px-5 py-2.5 text-sm font-medium transition hover:bg-muted">
                    <LucideIcon icon="arrow-left" class="mr-2 h-4 w-4" />
                    Go Back
                </button>
            </div>
            <div class="mt-12 text-xs text-muted-foreground">
                ElainaNode + Shadcn • Resource not found
            </div>
        </div>
    </div>
</template>