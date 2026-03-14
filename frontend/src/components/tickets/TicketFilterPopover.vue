<script setup lang="ts">
import type { TicketPriority, TicketQuery, TicketStatus } from '@ticketbasics/zod-schemas';

import { DEFAULT_STATUS_FILTER, TicketPriorityEnum, TicketStatusEnum } from '@ticketbasics/zod-schemas';
import { useDebounceFn } from '@vueuse/core';
import { FunnelPlus, X } from 'lucide-vue-next';
import { useForm } from 'vee-validate';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import DateSelector from '../form/DateSelector.vue';
import MultiSelector from '../form/MultiSelector.vue';

const emit = defineEmits<{
  (e: 'setQuery', patch: Partial<TicketQuery>): void;
}>();

const { defineField, resetForm } = useForm<{
  id: number | undefined;
  subject: string | undefined;
  priority: string[];
  status: string[];
  createdFrom: string | undefined;
  createdTo: string | undefined;
}>({
  initialValues: {
    id: undefined,
    subject: undefined,
    priority: [],
    status: DEFAULT_STATUS_FILTER,
    createdFrom: undefined,
    createdTo: undefined,
  },
});

const [id, idAttrs] = defineField('id');
const [subject, subjectAttrs] = defineField('subject');
const [priorityIn, priorityInAttrs] = defineField('priority');
const [statusIn, statusInAttrs] = defineField('status');
const [createdFrom, createdFromAttrs] = defineField('createdFrom');
const [createdTo, createdToAttrs] = defineField('createdTo');

const debouncedHandleChange = useDebounceFn(() => {
  emit('setQuery', {
    id: id.value,
    subject: subject.value,
    priorityIn: priorityIn.value as TicketPriority[],
    statusIn: statusIn.value as TicketStatus[],
    createdFrom: createdFrom.value ? new Date(createdFrom.value) : undefined,
    createdTo: createdTo.value ? new Date(createdTo.value) : undefined,
  });
}, 1000);

function handleClear() {
  resetForm();
  emit('setQuery', {
    id: undefined,
    subject: undefined,
    priorityIn: [],
    statusIn: DEFAULT_STATUS_FILTER,
    createdFrom: undefined,
    createdTo: undefined,
  });
}
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="outline" size="sm">
        <FunnelPlus :size="16" /> Table Filters
      </Button>
    </PopoverTrigger>

    <PopoverContent align="start" class="w-150">
      <form>
        <div class="flex items-center justify-between mb-6">
          <div class="space-y-1">
            <h4 class="font-medium leading-none flex items-center gap-2">
              <FunnelPlus :size="16" /> Table Filters
            </h4>
            <p class="text-sm text-muted-foreground">
              Filtering the rows in the table:
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" @click.prevent="handleClear">
            <X :size="18" /> Clear
          </Button>
        </div>

        <div class="grid grid-cols-2 gap-x-12 gap-y-4 items-start mb-2">
          <div class="grid gap-4">
            <div class="grid grid-rows-1 gap-3 items-center">
              <Label for="id" class="text-right">Id:</Label>
              <Input id="id" v-model="id" v-bind="idAttrs" type="number" class=" h-8" @input="debouncedHandleChange" />
            </div>

            <div class="grid grid-rows-1 gap-3 items-center">
              <Label for="subject" class="text-right">Subject:</Label>
              <Input id="subject" v-model="subject" v-bind="subjectAttrs" class=" h-8" @input="debouncedHandleChange" />
            </div>

            <div class="grid grid-rows-1 gap-3 items-center">
              <Label for="priority" class="text-right">Priority:</Label>

              <MultiSelector v-model="priorityIn" v-bind="priorityInAttrs" title="Priority" :options="TicketPriorityEnum.options" @update:model-value="(value) => { priorityIn = value; debouncedHandleChange(); }" />
            </div>

            <div class="grid grid-rows-1 gap-3 items-center">
              <Label for="status" class="text-right">Status:</Label>

              <MultiSelector v-model="statusIn" v-bind="statusInAttrs" title="Status" :options="TicketStatusEnum.options" @update:model-value="(value) => { statusIn = value; debouncedHandleChange(); }" />
            </div>
          </div>

          <div class="grid gap-4">
            <div class="grid grid-rows-1 gap-3 items-center">
              <Label class="text-right">Created from:</Label>
              <div class="">
                <DateSelector :date="createdFrom" v-bind="createdFromAttrs" @update:date="(value) => { createdFrom = value; debouncedHandleChange(); }" />
              </div>
            </div>
            <div class="grid grid-rows-1 gap-3 items-center">
              <Label class="text-right">Created to:</Label>
              <div class="">
                <DateSelector :date="createdTo" v-bind="createdToAttrs" @update:date="(value) => { createdTo = value; debouncedHandleChange(); }" />
              </div>
            </div>
          </div>
        </div>
      </form>
    </PopoverContent>
  </Popover>
</template>
