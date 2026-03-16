<script setup lang="ts">
import { DEFAULT_STATUS_FILTER, TICKET_SORT_OPTIONS } from '@ticketbasics/zod-schemas';

import TableSorter from '@/components/table/TableSorter.vue';
import TablePaginator from '@/components/TablePaginator.vue';
import NewTicketDialog from '@/components/tickets/NewTicketDialog.vue';
import TicketFilterPopover from '@/components/tickets/TicketFilterPopover.vue';
import TicketsListCard from '@/components/tickets/TicketsListCard.vue';
import { useGetAllTickets } from '@/queries/tickets.query';

const { data: tickets, pagination, setQuery, isLoading, error, isFetching } = useGetAllTickets({
  statusIn: DEFAULT_STATUS_FILTER,
});
</script>

<template>
  <div class="mb-2 flex justify-between">
    <div class="flex justify-start gap-2">
      <TicketFilterPopover @set-query="setQuery" />
      <TableSorter initial-sort="createdAt" initial-order="desc" :options="TICKET_SORT_OPTIONS" @change="setQuery" />
    </div>
    <NewTicketDialog />
  </div>

  <div v-if="isLoading">
    Loading...
  </div>
  <div v-else-if="error">
    {{ error }}
  </div>
  <div v-else-if="isFetching">
    Fetching...
  </div>

  <TicketsListCard :tickets="tickets" />

  <div v-if="pagination" class="my-2">
    <TablePaginator :pagination="pagination" @set-query="setQuery" />
  </div>
</template>

<style scoped>
</style>
