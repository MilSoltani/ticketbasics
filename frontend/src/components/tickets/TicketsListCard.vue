<script setup lang="ts">
import { useRouter } from 'vue-router';

import NewTicketDialog from '@/components/tickets/NewTicketDialog.vue';
import Table from '@/components/ui/table/Table.vue';
import TableBody from '@/components/ui/table/TableBody.vue';
import TableCell from '@/components/ui/table/TableCell.vue';
import TableHead from '@/components/ui/table/TableHead.vue';
import TableHeader from '@/components/ui/table/TableHeader.vue';
import TableRow from '@/components/ui/table/TableRow.vue';
import { useGetAllTickets } from '@/queries/tickets.query';

const { data: tickets, isLoading, error, isFetching } = useGetAllTickets();

const router = useRouter();
</script>

<template>
  <div class="w-full">
    <div class="mb-2">
      <NewTicketDialog />
    </div>

    <div>
      <div v-if="isLoading">
        Loading...
      </div>
      <div v-else-if="error">
        {{ error }}
      </div>
      <div v-else-if="isFetching">
        Fetching...
      </div>

      <div v-else class="border rounded-lg">
        <Table class="table-fixed w-full">
          <TableHeader class="bg-muted sticky top-0 z-10">
            <TableRow>
              <TableHead class="font-bold w-16">
                Id
              </TableHead>
              <TableHead class="font-bold">
                Subject
              </TableHead>
              <TableHead class="font-bold w-24">
                Priority
              </TableHead>
              <TableHead class="font-bold w-22">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="ticket in tickets"
              :key="ticket.id"
              class="cursor-pointer"
              @click="router.push(`/tickets/${ticket.id}`)"
            >
              <TableCell class="py-4 text-muted-foreground">
                #{{ ticket.id }}
              </TableCell>

              <TableCell class="truncate max-w-0 py-4 font-bold">
                {{ ticket.subject }}
              </TableCell>

              <TableCell class="py-4">
                {{ ticket.priority }}
              </TableCell>
              <TableCell class="py-4">
                {{ ticket.status }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
    <div>
      aa
    </div>
  </div>
</template>
