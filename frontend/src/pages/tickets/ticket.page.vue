<script setup lang="ts">
import type { TicketUpdatePayload } from '@ticketbasics/backend/client';

import { Save } from 'lucide-vue-next';
import { ref, toRaw, watch } from 'vue';
import { useRoute } from 'vue-router';

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

const route = useRoute();
const ticketId = Number(route.params.id);

const { data: ticket, isLoading, error, isFetching } = useGetTicketById(ticketId);

const { mutate: updateTicketMutate } = useUpdateTicket();

const priorityList = ['low', 'medium', 'high', 'urgent'];
const statusList = ['open', 'pending', 'working', 'resolved', 'closed'];

const ticketUpdatePayload = ref<TicketUpdatePayload>({});

watch(ticket, (newTicket) => {
  if (newTicket) {
    ticketUpdatePayload.value = structuredClone(toRaw(newTicket));
  }
}, { immediate: true });
</script>

<template>
  <Card class="shadow-none w-full">
    <CardHeader>
      <div class="flex justify-between">
        <div class="">
          <CardTitle class="mb-2">
            Ticket
          </CardTitle>
          <CardDescription>Edit page of a ticket</CardDescription>
        </div>

        <div class="justify-self-end">
          <Button variant="default" size="sm" @click="() => updateTicketMutate({ id: ticketId, changes: ticketUpdatePayload })">
            <Save :size="16" /> Update
          </Button>
        </div>
      </div>
    </CardHeader>

    <CardContent>
      <div v-if="isLoading">
        Loading...
      </div>
      <div v-else-if="error">
        {{ error }}
      </div>
      <div v-else-if="isFetching">
        Fetching...
      </div>

      <div v-else-if="ticket">
        <div class="grid gap-4">
          <div class="grid gap-3">
            <Label for="ticket-subject">Subject *</Label>
            <Input id="ticket-subject" v-model="ticketUpdatePayload.subject" type="text" placeholder="subject" />
          </div>

          <div class="grid gap-3">
            <Label for="ticket-description">Description</Label>
            <Textarea id="ticket-description" v-model="ticketUpdatePayload.description" placeholder="description" />
          </div>

          <div class="grid gap-3">
            <Label for="ticket-priority">Priority *</Label>
            <Select id="ticket-priority" v-model="ticketUpdatePayload.priority">
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="priority in priorityList" :key="priority" :value="priority">
                  {{ priority }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="grid gap-3">
            <Label for="ticket-status">Status *</Label>
            <Select id="ticket-status" v-model="ticketUpdatePayload.status">
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="status in statusList" :key="status" :value="status">
                  {{ status }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<style scoped></style>
