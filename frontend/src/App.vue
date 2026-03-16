<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue';
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';

import AppHeader from './components/AppHeader.vue';
</script>

<template>
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
