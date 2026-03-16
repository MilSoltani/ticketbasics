<script setup lang="ts">
import type { Ticket } from '@ticketbasics/zod-schemas';

import { MoreHorizontal } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

import Table from '@/components/ui/table/Table.vue';
import TableBody from '@/components/ui/table/TableBody.vue';
import TableCell from '@/components/ui/table/TableCell.vue';
import TableHead from '@/components/ui/table/TableHead.vue';
import TableHeader from '@/components/ui/table/TableHeader.vue';
import TableRow from '@/components/ui/table/TableRow.vue';

import DropdownMenu from '../ui/dropdown-menu/DropdownMenu.vue';
import DropdownMenuContent from '../ui/dropdown-menu/DropdownMenuContent.vue';
import DropdownMenuItem from '../ui/dropdown-menu/DropdownMenuItem.vue';
import DropdownMenuTrigger from '../ui/dropdown-menu/DropdownMenuTrigger.vue';

const props = withDefaults(defineProps<{
  tickets?: Ticket[];
}>(), {
  tickets: () => [],
});

const router = useRouter();
</script>

<template>
  <div class="w-full">
    <div>
      <div class="border-b">
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

              <TableHead class="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="ticket in props.tickets"
              :key="ticket.id"
              class="cursor-pointer"
              @click="router.push(`/tickets/${ticket.id}`)"
            >
              <TableCell class="py-4 text-muted-foreground">
                #{{ ticket.id }}
              </TableCell>

              <TableCell class="truncate max-w-0 py-4 font-bold">
                {{ ticket.subject }}

                <div class="text-muted-foreground text-sm">
                  username - {{ ticket.createdAt }}
                </div>
              </TableCell>

              <TableCell class="py-4">
                {{ ticket.priority }}
              </TableCell>
              <TableCell class="py-4">
                {{ ticket.status }}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button
                      variant="ghost"
                      class="p-1 rounded-md data-[state=open]:bg-muted hover:bg-muted cursor-pointer"
                      @click.stop
                    >
                      <MoreHorizontal class="h-4 w-4" />
                      <span class="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" class="w-[160px]">
                    <DropdownMenuItem class="cursor-pointer">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
</template>
