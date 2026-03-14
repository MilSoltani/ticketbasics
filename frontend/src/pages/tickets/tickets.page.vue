<script setup lang="ts">
import TablePaginator from '@/components/TablePaginator.vue';
import NewTicketDialog from '@/components/tickets/NewTicketDialog.vue';
import TicketFilterPopover from '@/components/tickets/TicketFilterPopover.vue';
import TicketsListCard from '@/components/tickets/TicketsListCard.vue';
import { useGetAllTickets } from '@/queries/tickets.query';

const { data: tickets, pagination, setQuery, isLoading, error, isFetching } = useGetAllTickets();
</script>

<template>
  <div class="mb-2 flex justify-between">
    <TicketFilterPopover />
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
