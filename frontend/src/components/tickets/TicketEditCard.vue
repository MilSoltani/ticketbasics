<script setup lang="ts">
import type { TicketUpdatePayload } from '@ticketbasics/zod-schemas';

import { TicketPriorityEnum, TicketStatusEnum, TicketUpdateSchema } from '@ticketbasics/zod-schemas';
import { toTypedSchema } from '@vee-validate/zod';
import { Save } from 'lucide-vue-next';
import { ErrorMessage, useForm } from 'vee-validate';
import { watch } from 'vue';
import { toast } from 'vue-sonner';

import Button from '@/components/ui/button/Button.vue';
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import CardDescription from '@/components/ui/card/CardDescription.vue';
import CardHeader from '@/components/ui/card/CardHeader.vue';
import CardTitle from '@/components/ui/card/CardTitle.vue';
import { Input } from '@/components/ui/input';
import Label from '@/components/ui/label/Label.vue';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Textarea from '@/components/ui/textarea/Textarea.vue';
import { useGetTicketById, useUpdateTicket } from '@/queries/tickets.query';

const props = defineProps<{
  ticketId: number;
}>();

const { data: ticket, isLoading, error } = useGetTicketById(props.ticketId);

const { mutate: updateTicket, isPending } = useUpdateTicket();

const { defineField, handleSubmit, errors, resetForm } = useForm({
  validationSchema: toTypedSchema(TicketUpdateSchema),
  initialValues: {},
});

const [subject, subjectAttrs] = defineField('subject');
const [description, descriptionAttrs] = defineField('description');
const [priority, priorityAttrs] = defineField('priority');
const [status, statusAttrs] = defineField('status');

watch(ticket, (newTicket, oldTicket) => {
  if (newTicket && newTicket !== oldTicket) {
    resetForm({ values: newTicket });
  }
}, { immediate: true });

const onSubmit = handleSubmit((updatedTicket: TicketUpdatePayload) => {
  updateTicket(
    { id: props.ticketId, changes: updatedTicket },
    {
      onSuccess: () => {
        toast.success('updated!');
      },
      onError: (error: any) => {
        const message = error?.message || error?.response?.data?.message || 'Failed to update ticket';
        toast.error(message);
      },
    },
  );
});
</script>

<template>
  <Card class="shadow-none w-full rounded-none">
    <form @submit.prevent="onSubmit">
      <CardHeader>
        <div class="flex justify-between">
          <div class="mb-5">
            <CardTitle class="mb-2">
              Ticket
            </CardTitle>
            <CardDescription>Edit page of a ticket</CardDescription>
          </div>

          <div class="justify-self-end">
            <Button variant="outline" size="sm" type="submit" :disabled="isPending">
              <Save :size="16" /> Update
            </Button>
          </div>
        </div>
      </CardHeader>

      <div v-if="isLoading">
        Loading...
      </div>
      <div v-else-if="error">
        <pre>{{ error }}</pre>
      </div>

      <CardContent v-else>
        <div>
          <div class="mb-5">
            <Label for="subject" class="mb-2 flex justify-between">
              <div>Subject *</div>

              <div class="text-red-500">
                <ErrorMessage name="subject" />
              </div>
            </Label>

            <Input id="subject" v-model="subject" :class="{ 'border-red-500': errors.subject }" v-bind="subjectAttrs" />
          </div>

          <div class="mb-5">
            <Label for="description" class="mb-2 flex justify-between">
              <div>Description *</div>

              <div class="text-red-500">
                <ErrorMessage name="description" />
              </div>
            </Label>

            <Textarea id="description" v-model="description" :class="{ 'border-red-500': errors.description }" v-bind="descriptionAttrs" />
          </div>

          <div class="mb-5">
            <Label for="priority" class="mb-2 flex justify-between">
              <div>Priority *</div>

              <div class="text-red-500">
                <ErrorMessage name="priority" />
              </div>
            </Label>

            <Select id="priority" v-model="priority" :class="{ 'border-red-500': errors.priority }" v-bind="priorityAttrs">
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

          <div class="mb-5">
            <Label for="status" class="mb-2 flex justify-between">
              <div>Status *</div>

              <div class="text-red-500">
                <ErrorMessage name="status" />
              </div>
            </Label>

            <Select id="status" v-model="status" :class="{ 'border-red-500': errors.status }" v-bind="statusAttrs">
              <SelectTrigger>
                <SelectValue placeholder="status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="statusOption in TicketStatusEnum.options" :key="statusOption" :value="statusOption">
                  {{ statusOption }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </form>
  </Card>
</template>
