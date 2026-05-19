<script setup lang="ts">
import 'vue-sonner/style.css'
import { useColorMode } from "@vueuse/core";
import { Toaster } from '@/components/ui/sonner'

useColorMode();
</script>

<template>
  <RouterView />
  <Toaster position="top-center"/>
</template>