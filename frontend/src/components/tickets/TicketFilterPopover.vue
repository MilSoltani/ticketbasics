<script setup lang="ts">
import { TicketPriorityEnum, TicketStatusEnum } from '@ticketbasics/zod-schemas';
import { FunnelPlus, X } from 'lucide-vue-next';
import { ref } from 'vue';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

import DateSelector from '../form/DateSelector.vue';

const createdFrom = ref<string>();
const createdTo = ref<string>();
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="outline" size="sm">
        <FunnelPlus :size="16" /> Table Filters
      </Button>
    </PopoverTrigger>

    <PopoverContent class="w-fit">
      <div class="flex items-center justify-between mb-6">
        <div class="space-y-1">
          <h4 class="font-medium leading-none flex items-center gap-2">
            <FunnelPlus :size="16" /> Table Filters
          </h4>
          <p class="text-sm text-muted-foreground">
            Filtering the rows in the table:
          </p>
        </div>
        <Button variant="ghost" size="icon" class="h-8 w-8">
          <X :size="18" />
        </Button>
      </div>

      <div class="grid grid-cols-2 gap-x-12 gap-y-4 items-start">
        <div class="grid gap-4">
          <div class="grid grid-cols-3 items-center">
            <Label for="id" class="text-right">Id</Label>
            <Input id="id" class="col-span-2 h-8" />
          </div>

          <div class="grid grid-cols-3 items-center">
            <Label for="subject" class="text-right">Subject</Label>
            <Input id="subject" class="col-span-2 h-8" />
          </div>

          <div class="grid grid-cols-3 items-center">
            <Label for="priority" class="text-right">Priority</Label>
            <Select id="priority">
              <SelectTrigger class="col-span-2 h-8">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="opt in TicketPriorityEnum.options" :key="opt" :value="opt">
                  {{ opt }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="grid grid-cols-3 items-center">
            <Label for="status" class="text-right">Status</Label>
            <Select id="status">
              <SelectTrigger class="col-span-2 h-8">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="opt in TicketStatusEnum.options" :key="opt" :value="opt">
                  {{ opt }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div class="grid gap-4">
          <div class="grid grid-cols-3 items-center">
            <Label class="text-right">From</Label>
            <div class="col-span-2">
              <DateSelector v-model:date="createdFrom" />
            </div>
          </div>
          <div class="grid grid-cols-3 items-center">
            <Label class="text-right">To</Label>
            <div class="col-span-2">
              <DateSelector v-model:date="createdTo" />
            </div>
          </div>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
