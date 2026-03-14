<script setup lang="ts">
import type { TicketQuery } from '@ticketbasics/zod-schemas';

import { TicketPriorityEnum, TicketStatusEnum } from '@ticketbasics/zod-schemas';
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
import Select from '@/components/ui/select/Select.vue';
import SelectContent from '@/components/ui/select/SelectContent.vue';
import SelectItem from '@/components/ui/select/SelectItem.vue';
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue';
import SelectValue from '@/components/ui/select/SelectValue.vue';

import DateSelector from '../form/DateSelector.vue';

const emit = defineEmits<{
  (e: 'setQuery', patch: Partial<TicketQuery>): void;
}>();

const { defineField, resetForm, handleSubmit } = useForm({});

const [id, idAttrs] = defineField('id');
const [subject, subjectAttrs] = defineField('subject');
const [priority, priorityAttrs] = defineField('priority');
const [status, statusAttrs] = defineField('status');
const [createdFrom, createdFromAttrs] = defineField('createdFrom');
const [createdTo, createdToAttrs] = defineField('createdTo');

const handleChange = handleSubmit((changes: Partial<TicketQuery>) => {
  emit('setQuery', {
    id: changes.id,
    subject: changes.subject,
    priority: changes.priority,
    status: changes.status,
    createdFrom: changes.createdFrom,
    createdTo: changes.createdTo,
  });
});

function handleClear() {
  resetForm();
  emit('setQuery', {
    id: undefined,
    subject: undefined,
    priority: undefined,
    status: undefined,
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

    <PopoverContent align="start" class="w-fit">
      <form @change.prevent="handleChange">
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

        <div class="grid grid-cols-2 gap-x-12 gap-y-4 items-start">
          <div class="grid gap-4">
            <div class="grid grid-rows-1 gap-3 items-center">
              <Label for="id" class="text-right">Id:</Label>
              <Input id="id" v-model="id" v-bind="idAttrs" type="number" class=" h-8" @input="handleChange" />
            </div>

            <div class="grid grid-rows-1 gap-3 items-center">
              <Label for="subject" class="text-right">Subject:</Label>
              <Input id="subject" v-model="subject" v-bind="subjectAttrs" class=" h-8" @input="handleChange" />
            </div>

            <div class="grid grid-rows-1 gap-3 items-center">
              <Label for="priority" class="text-right">Priority:</Label>
              <Select id="priority" v-model="priority" v-bind="priorityAttrs">
                <SelectTrigger class="h-8">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="opt in TicketPriorityEnum.options" :key="opt" :value="opt">
                    {{ opt }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="grid grid-rows-1 gap-3 items-center">
              <Label for="status" class="text-right">Status:</Label>
              <Select id="status" v-model="status" v-bind="statusAttrs">
                <SelectTrigger class="h-8">
                  <SelectValue placeholder="Select Status" />
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
            <div class="grid grid-rows-1 gap-3 items-center">
              <Label class="text-right">Created from:</Label>
              <div class="">
                <DateSelector :date="createdFrom" v-bind="createdFromAttrs" @update:date="(value) => { createdFrom = value; handleChange(); }" />
              </div>
            </div>
            <div class="grid grid-rows-1 gap-3 items-center">
              <Label class="text-right">Created to:</Label>
              <div class="">
                <DateSelector :date="createdTo" v-bind="createdToAttrs" @update:date="(value) => { createdTo = value; handleChange(); }" />
              </div>
            </div>
          </div>
        </div>
      </form>
    </PopoverContent>
  </Popover>
</template>
