<script setup lang="ts">
import 'vue-sonner/style.css';

import { Toaster } from '@/components/ui/sonner';

import AppHeader from './components/AppHeader.vue';
</script>

<template>
  <Toaster position="bottom-right" />

  <AppHeader />

  <main class="pt-4 mx-auto flex max-w-6xl items-center justify-between px-4">
    <RouterView />
  </main>
</template>

<style scoped>
</style>
