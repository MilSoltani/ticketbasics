<script setup lang="ts">
import type { SortOrder } from '@ticketbasics/zod-schemas';

import { ListOrdered } from 'lucide-vue-next';
import { useForm } from 'vee-validate';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Select from '@/components/ui/select/Select.vue';
import SelectContent from '@/components/ui/select/SelectContent.vue';
import SelectItem from '@/components/ui/select/SelectItem.vue';
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue';
import SelectValue from '@/components/ui/select/SelectValue.vue';

const props = defineProps<{
  options: string[];
  initialSort: string;
  initialOrder?: SortOrder;
}>();

const emit = defineEmits<{
  (e: 'change', patch: { sort: string; order: SortOrder }): void;
}>();

const { defineField } = useForm<{
  sort: string;
  order: SortOrder;
}>({
  initialValues: {
    sort: props.initialSort,
    order: props.initialOrder || 'desc',
  },
});

const [sort] = defineField('sort');
const [order] = defineField('order');

function handleSort() {
  emit('change', {
    sort: sort.value,
    order: order.value,
  });
}
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="outline" size="sm">
        <ListOrdered :size="16" /> Table Sorting
      </Button>
    </PopoverTrigger>

    <PopoverContent align="start" class="w-40">
      <form>
        <div class="grid grid-cols-2 gap-x-12 gap-y-4 items-start mb-2">
          <div class="grid gap-4">
            <div class="grid grid-rows-1 gap-3 items-center">
              <Label for="sort" class="text-right">Sort By:</Label>

              <Select id="sort" v-model="sort" @update:model-value="handleSort">
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="sortableColumn in props.options" :key="sortableColumn" :value="sortableColumn">
                    {{ sortableColumn }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="grid grid-rows-1 gap-3 items-center">
              <Label for="order" class="text-right">Order:</Label>
              <Select id="order" v-model="order" @update:model-value="handleSort">
                <SelectTrigger>
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">
                    Ascending
                  </SelectItem>
                  <SelectItem value="desc">
                    Descending
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </form>
    </PopoverContent>
  </Popover>
</template>
