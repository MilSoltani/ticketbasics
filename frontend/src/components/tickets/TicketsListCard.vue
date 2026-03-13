<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

import NewTicketDialog from '@/components/tickets/NewTicketDialog.vue';
import Button from '@/components/ui/button/Button.vue';
import DropdownMenu from '@/components/ui/dropdown-menu/DropdownMenu.vue';
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue';
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue';
import DropdownMenuSeparator from '@/components/ui/dropdown-menu/DropdownMenuSeparator.vue';
import DropdownMenuShortcut from '@/components/ui/dropdown-menu/DropdownMenuShortcut.vue';
import DropdownMenuSub from '@/components/ui/dropdown-menu/DropdownMenuSub.vue';
import DropdownMenuSubContent from '@/components/ui/dropdown-menu/DropdownMenuSubContent.vue';
import DropdownMenuSubTrigger from '@/components/ui/dropdown-menu/DropdownMenuSubTrigger.vue';
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue';
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
        <Table>
          <TableHeader class="bg-muted sticky top-0 z-10">
            <TableRow>
              <TableHead class="font-bold w-12">
                Id
              </TableHead>
              <TableHead class="font-bold">
                Subject
              </TableHead>
              <TableHead class="font-bold">
                Priority
              </TableHead>
              <TableHead class="font-bold">
                Status
              </TableHead>
              <TableHead class="w-0" />
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="ticket in tickets" :key="ticket.id" class="cursor-pointer" @click="router.push(`/tickets/${ticket.id}`)">
              <TableCell>#{{ ticket.id }}</TableCell>
              <TableCell>
                {{ ticket.subject }}
              </TableCell>
              <TableCell>{{ ticket.priority }}</TableCell>
              <TableCell>{{ ticket.status }}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button
                      variant="ghost"
                      class="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                      @click.stop
                    >
                      <MoreHorizontal class="h-4 w-4" />
                      <span class="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" class="w-[160px]">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Make a copy</DropdownMenuItem>
                    <DropdownMenuItem>Favorite</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        vvv
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      Delete
                      <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
