<script setup lang="ts">
import { ticketsClient } from '@ticketbasics/backend/client';
import { onMounted, ref } from 'vue';

const tickets = ref<any[]>([]);

async function fetchTickets() {
  const response = await ticketsClient.index.$get();
  const data = await response.json();

  if (response.ok && data.data) {
    tickets.value = data.data;
  }
}

onMounted(() => {
  fetchTickets();
});
</script>

<template>
  <div v-for="ticket in tickets" :key="ticket.id" class="ticket-card">
    <h2>{{ ticket.subject }}</h2>
    <p>{{ ticket.description }}</p>
    <div class="ticket-meta">
      <span class="badge" :class="`status-${ticket.status}`">{{ ticket.status }}</span>
      <span class="badge" :class="`priority-${ticket.priority}`">{{ ticket.priority }}</span>
    </div>
  </div>
</template>

<style scoped>

</style>
