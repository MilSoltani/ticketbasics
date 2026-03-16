<script setup lang="ts">
import { useColorMode } from '@vueuse/core';
import { computed } from 'vue';
import { Toaster } from 'vue-sonner';
import 'vue-sonner/style.css';

import AppSidebar from '@/components/AppSidebar.vue';
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';

import AppHeader from './components/AppHeader.vue';

const mode = useColorMode();
const toasterTheme = computed(() => {
  if (mode.value === 'auto')
    return undefined;
  return mode.value as 'light' | 'dark' | undefined;
});
</script>

<template>
  <Toaster position="bottom-right" :theme="toasterTheme" />

  <SidebarProvider
    :style="{
      '--sidebar-width': '350px',
    }"
  >
    <AppSidebar />
    <SidebarInset>
      <AppHeader />

      <div class="m-4">
        <RouterView />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
