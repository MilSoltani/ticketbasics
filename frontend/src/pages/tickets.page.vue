<script setup lang="ts">
import Table from '../components/ui/table/Table.vue';
import TableBody from '../components/ui/table/TableBody.vue';
import TableCell from '../components/ui/table/TableCell.vue';
import TableHead from '../components/ui/table/TableHead.vue';
import TableHeader from '../components/ui/table/TableHeader.vue';
import TableRow from '../components/ui/table/TableRow.vue';
import { useGetAllTickets } from '../queries/tickets.query';

const { data: tickets, isLoading, error, isFetching } = useGetAllTickets();
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

  <Table v-else>
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
  </Table>
</template>

<style scoped></style>
