<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date';

import { DateFormatter, getLocalTimeZone, parseDate, today } from '@internationalized/date';
import { CalendarIcon } from 'lucide-vue-next';
import { computed } from 'vue';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const defaultPlaceholder = today(getLocalTimeZone());

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
});

const dateString = defineModel<string>('date');

const date = computed<CalendarDate | undefined>({
  get: () => (dateString.value ? parseDate(dateString.value) : undefined),
  set: (value) => {
    dateString.value = value?.toString() || '';
  },
});
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="cn(
          'w-full h-8 justify-start text-left font-normal',
          !date && 'text-muted-foreground',
        )"
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{ date ? df.format(date.toDate(getLocalTimeZone())) : "Pick a date" }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0" align="start">
      <Calendar
        v-model="date"
        :placeholder="defaultPlaceholder"
        initial-focus
        @update:model-value="() => {
        }"
      />
    </PopoverContent>
  </Popover>
</template>
