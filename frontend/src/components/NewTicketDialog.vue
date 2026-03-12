<script setup lang="ts">
import type { TicketCreatePayload } from '@ticketbasics/zod-schemas';

import { TicketCreateSchema, TicketPriorityEnum } from '@ticketbasics/zod-schemas';
import { toTypedSchema } from '@vee-validate/zod';
import { Plus } from 'lucide-vue-next';
import { ErrorMessage, useForm } from 'vee-validate';
import { ref } from 'vue';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Select from '@/components/ui/select/Select.vue';
import SelectContent from '@/components/ui/select/SelectContent.vue';
import SelectItem from '@/components/ui/select/SelectItem.vue';
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue';
import SelectValue from '@/components/ui/select/SelectValue.vue';
import Textarea from '@/components/ui/textarea/Textarea.vue';
import { useCreateTicket } from '@/queries/tickets.query';

import Button from './ui/button/Button.vue';

const dialogOpen = ref(false);

const { mutate: createTicket } = useCreateTicket();

const { defineField, handleSubmit, resetForm, errors } = useForm({
  validationSchema: toTypedSchema(TicketCreateSchema),
  initialValues: {
    subject: '',
    description: '',
    priority: 'low',
  },
});

const [subject, subjectAttrs] = defineField('subject');
const [description, descriptionAttrs] = defineField('description');
const [priority, priorityAttrs] = defineField('priority');

const onSubmit = handleSubmit((newTicket: TicketCreatePayload) => {
  createTicket(newTicket, {
    onSuccess: () => {
      resetForm();
      dialogOpen.value = false;
    },
  });
});

function handleCancel() {
  resetForm();
  dialogOpen.value = false;
}
</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <DialogTrigger as-child>
      <Button size="sm" variant="outline">
        <Plus :size="16" /> New Ticket
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>New Ticket</DialogTitle>
        <DialogDescription />
      </DialogHeader>

      <form @submit.prevent="onSubmit">
        <div class="mb-5">
          <Label for="subject" class="mb-2 flex justify-between">
            <div>Subject *</div>

            <div class="text-red-500">
              <ErrorMessage name="subject" />
            </div>
          </Label>

          <Input id="subject" v-model="subject" :class="{ 'border-red-500': errors.subject }" v-bind="subjectAttrs" required />
        </div>

        <div class="mb-5">
          <Label for="description" class="mb-2 flex justify-between">
            <div>Description *</div>

            <div class="text-red-500">
              <ErrorMessage name="description" />
            </div>
          </Label>

          <Textarea id="description" v-model="description" :class="{ 'border-red-500': errors.description }" v-bind="descriptionAttrs" required />
        </div>

        <div class="mb-5">
          <Label for="priority" class="mb-2 flex justify-between">
            <div>Priority *</div>

            <div class="text-red-500">
              <ErrorMessage name="priority" />
            </div>
          </Label>

          <Select id="priority" v-model="priority" :class="{ 'border-red-500': errors.priority }" v-bind="priorityAttrs" required>
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="priorityOption in TicketPriorityEnum.options" :key="priorityOption" :value="priorityOption">
                {{ priorityOption }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <DialogClose as-child>
            <Button size="sm" variant="outline" @click="handleCancel">
              Cancel
            </Button>
          </DialogClose>

          <Button size="sm" type="submit">
            <Plus :size="16" /> Create
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
