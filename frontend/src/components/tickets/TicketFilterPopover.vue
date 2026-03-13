<script setup lang="ts">
import { TicketPriorityEnum, TicketStatusEnum } from '@ticketbasics/zod-schemas';
import { FunnelPlus, X } from 'lucide-vue-next';

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
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="outline" size="sm">
        <FunnelPlus :size="16" /> Table Filters
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-80">
      <div class="grid gap-4">
        <div class="flex justify-between">
          <div class="space-y-2">
            <h4 class="font-medium leading-none flex gap-2">
              <FunnelPlus :size="16" /> Table Filters
            </h4>
            <p class="text-sm text-muted-foreground">
              Filtering the rows in the table:
            </p>
          </div>

          <div>
            <Button variant="outline" size="icon">
              <X :size="32" />
            </Button>
          </div>
        </div>
        <div class="grid gap-2">
          <div class="grid grid-cols-3 items-center gap-4">
            <Label for="id">Id</Label>
            <Input
              id="id"
              class="col-span-2 h-8"
            />
          </div>
          <div class="grid grid-cols-3 items-center gap-4">
            <Label for="subject">Subject</Label>
            <Input
              id="subject"
              class="col-span-2 h-8"
            />
          </div>
          <div class="grid grid-cols-3 items-center gap-4">
            <Label for="priority">Priority</Label>

            <Select id="priority">
              <SelectTrigger>
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="priorityOption in TicketPriorityEnum.options" :key="priorityOption" :value="priorityOption">
                  {{ priorityOption }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="grid grid-cols-3 items-center gap-4">
            <Label for="status">Status</Label>

            <Select id="status">
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="statusOption in TicketStatusEnum.options" :key="statusOption" :value="statusOption">
                  {{ statusOption }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
