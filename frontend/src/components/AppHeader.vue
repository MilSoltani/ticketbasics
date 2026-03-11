<script setup lang="ts">
import ModeToggle from './ModeToggle.vue';
</script>

<template>
  <header class="">
    <div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
      <div class="font-semibold tracking-tight">
        ticketbasics
      </div>

      <nav class="flex items-center gap-6 text-sm text-muted-foreground">
        <a href="/" class="hover:text-foreground">Home</a>
        <a href="/docs" class="hover:text-foreground">Docs</a>
        <ModeToggle />
      </nav>
    </div>
  </header>
</template>
