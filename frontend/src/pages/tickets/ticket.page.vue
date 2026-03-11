<script setup lang="ts">
import type { TicketUpdatePayload } from '@ticketbasics/backend/client';

import { Save } from 'lucide-vue-next';
import { ref, toRaw, watch } from 'vue';
import { useRoute } from 'vue-router';

import Button from '@/components/ui/button/Button.vue';
import { Input } from '@/components/ui/input';
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
  <div v-if="isLoading">
    Loading...
  </div>
  <div v-else-if="error">
    {{ error }}
  </div>
  <div v-else-if="isFetching">
    Fetching...
  </div>

  <div v-else>
    <pre>{{ ticketUpdatePayload }}</pre>

    <div>
      <Input v-model="ticketUpdatePayload.subject" type="text" placeholder="subject" />

      <Textarea v-model="ticketUpdatePayload.description" placeholder="description" />

      <Select v-model="ticketUpdatePayload.priority">
        <SelectTrigger>
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="priority in priorityList" :key="priority" :value="priority">
            {{ priority }}
          </SelectItem>
        </SelectContent>
      </Select>

      <Select v-model="ticketUpdatePayload.status">
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="status in statusList" :key="status" :value="status">
            {{ status }}
          </SelectItem>
        </SelectContent>
      </Select>

      <Button @click="() => updateTicketMutate({ id: ticketId, changes: ticketUpdatePayload })">
        <Save :size="16" /> Update
      </Button>
    </div>
  </div>
</template>

<style scoped></style>
