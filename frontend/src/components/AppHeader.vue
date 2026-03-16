<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

const route = useRoute();

const parent = computed(() => {
  const { parentName, parentPath } = route.meta ?? {};
  if (!parentName || !parentPath)
    return null;
  return { name: parentName, path: parentPath };
});
</script>

<template>
  <header class="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
    <SidebarTrigger class="-ml-1" />
    <Separator
      orientation="vertical"
      class="mr-2 data-[orientation=vertical]:h-4"
    />

    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem class="hidden md:block">
          <template v-if="parent">
            <BreadcrumbLink as-child>
              <RouterLink :to="parent.path">
                {{ parent.name }}
              </RouterLink>
            </BreadcrumbLink>
          </template>
          <template v-else>
            <BreadcrumbPage>{{ route.name }}</BreadcrumbPage>
          </template>
        </BreadcrumbItem>

        <template v-if="parent && route.params.id">
          <BreadcrumbSeparator class="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>#{{ route.params.id }}</BreadcrumbPage>
          </BreadcrumbItem>
        </template>
      </BreadcrumbList>
    </Breadcrumb>
  </header>
</template>
