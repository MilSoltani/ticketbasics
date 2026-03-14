<script setup lang="ts">
import type { PaginationType } from '@ticketbasics/zod-schemas';

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const props = withDefaults(defineProps<{
  pagination?: PaginationType;
}>(), {
  pagination: () => ({
    total: 0,
    limit: 25,
    offset: 0,
    page: 1,
    pages: 1,
  }),
});

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
  <div class="flex items-center justify-between px-2">
    <div class="flex-1">
      <div class="flex items-center space-x-2">
        <p class="text-sm font-medium">
          Rows per page
        </p>
        <Select
          :model-value="String(selectedLimit ?? 25)"
          @update:model-value="(v) => handleLimitChange(v as string)"
        >
          <SelectTrigger class="h-8 w-[70px]">
            <SelectValue :placeholder="String(selectedLimit ?? 25)" />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem v-for="pageSize in [10, 25, 50, 100]" :key="pageSize" :value="`${pageSize}`">
              {{ pageSize }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    <div class="flex items-center space-x-6 lg:space-x-8">
      <div class="flex w-[100px] items-center justify-center text-sm font-medium">
        Page {{ localPage }} of
        {{ maxPage }}
      </div>
      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          class="hidden h-8 w-8 p-0 lg:flex"
          :disabled="localPage === 1"
          @click="handlePageChange(1)"
        >
          <span class="sr-only">Go to first page</span>
          <ChevronsLeft class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          class="h-8 w-8 p-0"
          :disabled="localPage === 1"
          @click="handlePageChange(localPage - 1)"
        >
          <span class="sr-only">Go to previous page</span>
          <ChevronLeft class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          class="h-8 w-8 p-0"
          :disabled="localPage === maxPage"
          @click="handlePageChange(localPage + 1)"
        >
          <span class="sr-only">Go to next page</span>
          <ChevronRight class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          class="hidden h-8 w-8 p-0 lg:flex"
          :disabled="localPage === maxPage"
          @click="handlePageChange(maxPage)"
        >
          <span class="sr-only">Go to last page</span>
          <ChevronsRight class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
