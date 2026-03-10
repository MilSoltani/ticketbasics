<script setup lang="ts">
import { ticketsClient } from '@ticketbasics/backend/client';
import { onMounted, ref } from 'vue';

import Table from './components/ui/table/Table.vue';
import TableBody from './components/ui/table/TableBody.vue';
import TableCaption from './components/ui/table/TableCaption.vue';
import TableCell from './components/ui/table/TableCell.vue';
import TableFooter from './components/ui/table/TableFooter.vue';
import TableHead from './components/ui/table/TableHead.vue';
import TableHeader from './components/ui/table/TableHeader.vue';
import TableRow from './components/ui/table/TableRow.vue';

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
  <Table>
    <TableCaption>A list of tickets.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Id</TableHead>
        <TableHead>Subject</TableHead>
        <TableHead>Priority</TableHead>
        <TableHead>Status</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="ticket in tickets" :key="ticket.id">
        <TableCell>{{ ticket.id }}</TableCell>
        <TableCell>{{ ticket.subject }}</TableCell>
        <TableCell>{{ ticket.priority }}</TableCell>
        <TableCell>{{ ticket.status }}</TableCell>
      </TableRow>
    </TableBody>
    <TableFooter>
      <TableRow>
        <TableCell colspan="3">
          Total
        </TableCell>
        <TableCell class="text-right">
          {{ tickets.length }}
        </TableCell>
      </TableRow>
    </TableFooter>
  </Table>
</template>

<style scoped>

</style>
