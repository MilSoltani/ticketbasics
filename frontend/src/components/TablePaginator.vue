<script setup lang="ts">
import type { PaginationType } from '@ticketbasics/zod-schemas';

import { computed, ref, watch } from 'vue';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const props = defineProps<{
  pagination: PaginationType;
}>();

const emit = defineEmits<{
  (e: 'setQuery', patch: { offset: number }): void;
}>();

const limit = computed(() => Math.max(1, props.pagination.limit ?? 25));
const total = computed(() => props.pagination.total ?? 0);
const offset = computed(() => props.pagination.offset ?? 0);

const maxPage = computed(() => Math.max(1, Math.ceil(total.value / limit.value)));
const currentPageFromProps = computed(() => {
  const page = Math.floor(offset.value / limit.value) + 1;
  return Math.min(Math.max(page, 1), maxPage.value);
});

const localPage = ref(currentPageFromProps.value);

watch(currentPageFromProps, (next) => {
  localPage.value = next;
});

function handlePageChange(page: number) {
  const safePage = Math.min(Math.max(page, 1), maxPage.value);
  localPage.value = safePage;
  const newOffset = (safePage - 1) * limit.value;
  if (newOffset === offset.value)
    return;
  emit('setQuery', { offset: newOffset });
}
</script>

<template>
  <Pagination
    class="justify-end"
    :total="total"
    :items-per-page="limit"
    :sibling-count="1"
    :page="localPage"
    @update:page="handlePageChange"
  >
    <template #default="{ page }">
      <PaginationContent v-slot="{ items }" class="flex justify-start gap-1">
        <PaginationFirst />
        <PaginationPrevious />

        <template v-for="(item, idx) in items" :key="item.type === 'page' ? `page-${item.value}` : `ellipsis-${idx}`">
          <PaginationItem
            v-if="item.type === 'page'"
            :value="item.value"
            :is-active="item.value === page"
            size="default"
            class="h-9 w-9"
          >
            {{ item.value }}
          </PaginationItem>

          <PaginationEllipsis v-else :index="idx" />
        </template>

        <PaginationNext />
        <PaginationLast />
      </PaginationContent>
    </template>
  </Pagination>
</template>
