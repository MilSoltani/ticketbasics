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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const props = defineProps<{
  pagination: PaginationType;
}>();

const emit = defineEmits<{
  (e: 'setQuery', patch: { offset?: number; limit?: number }): void;
}>();

const limit = computed(() => Math.max(1, props.pagination.limit ?? 25));
const total = computed(() => props.pagination.total ?? 0);
const offset = computed(() => props.pagination.offset ?? 0);

const selectedLimit = ref<number>();

watch(
  () => props.pagination.limit,
  (newLimit) => {
    if (newLimit && newLimit !== selectedLimit.value)
      selectedLimit.value = newLimit;
  },
  { immediate: true },
);

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

function handleLimitChange(newLimit: string) {
  const limitValue = Number.parseInt(newLimit, 10);
  if (limitValue === limit.value)
    return;
  selectedLimit.value = limitValue;
  emit('setQuery', { limit: limitValue, offset: 0 });
}
</script>

<template>
  <div class="flex items-center justify-between gap-4">
    <Pagination
      class="justify-start"
      :total="total"
      :items-per-page="limit"
      :sibling-count="1"
      :page="localPage"
      @update:page="handlePageChange"
    >
      <template #default="{ page }">
        <PaginationContent v-slot="{ items }" class="flex justify-start gap-1">
          <PaginationFirst class="cursor-pointer" />
          <PaginationPrevious class="cursor-pointer" />

          <template v-for="(item, idx) in items" :key="item.type === 'page' ? `page-${item.value}` : `ellipsis-${idx}`">
            <PaginationItem
              v-if="item.type === 'page'"
              :value="item.value"
              :is-active="item.value === page"
              size="default"
              class="h-9 w-9 cursor-pointer"
            >
              {{ item.value }}
            </PaginationItem>

            <PaginationEllipsis v-else :index="idx" />
          </template>

          <PaginationNext class="cursor-pointer" />
          <PaginationLast class="cursor-pointer" />
        </PaginationContent>
      </template>
    </Pagination>

    <div class="flex items-center gap-2">
      <span class="text-sm">Rows:</span>
      <Select :model-value="String(selectedLimit ?? 25)" @update="handleLimitChange">
        <SelectTrigger class="w-fit">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">
            10
          </SelectItem>
          <SelectItem value="25">
            25
          </SelectItem>
          <SelectItem value="50">
            50
          </SelectItem>
          <SelectItem value="100">
            100
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>
