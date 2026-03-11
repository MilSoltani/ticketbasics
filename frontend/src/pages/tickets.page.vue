<script setup lang="ts">
import type { TicketCreatePayload } from '@ticketbasics/backend/client';

import { Plus } from 'lucide-vue-next';
import { ref } from 'vue';

import Button from '@/components/ui/button/Button.vue';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Select from '@/components/ui/select/Select.vue';
import SelectContent from '@/components/ui/select/SelectContent.vue';
import SelectItem from '@/components/ui/select/SelectItem.vue';
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue';
import SelectValue from '@/components/ui/select/SelectValue.vue';
import Textarea from '@/components/ui/textarea/Textarea.vue';

import Table from '../components/ui/table/Table.vue';
import TableBody from '../components/ui/table/TableBody.vue';
import TableCell from '../components/ui/table/TableCell.vue';
import TableHead from '../components/ui/table/TableHead.vue';
import TableHeader from '../components/ui/table/TableHeader.vue';
import TableRow from '../components/ui/table/TableRow.vue';
import { useCreateTicket, useGetAllTickets } from '../queries/tickets.query';

const { data: tickets, isLoading, error, isFetching } = useGetAllTickets();

const priorityList = ['low', 'medium', 'high', 'urgent'];

const { mutate: useCreateMutate } = useCreateTicket();

const newTicket = ref<TicketCreatePayload>({
  subject: '',
  description: '',
  priority: 'low',
});
</script>

<template>
  <Dialog>
    <form>
      <DialogTrigger as-child>
        <Button variant="outline">
          <Plus :size="16" /> New Ticket
        </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Ticket</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4">
          <div class="grid gap-3">
            <Label for="new-ticket-subject">Subject *</Label>
            <Input id="new-ticket-subject" v-model="newTicket.subject" type="text" placeholder="subject" />
          </div>

          <div class="grid gap-3">
            <Label for="new-ticket-description">Description</Label>
            <Textarea id="new-ticket-description" v-model="newTicket.description" placeholder="description" />
          </div>

          <div class="grid gap-3">
            <Label for="new-ticket-priority">Priority *</Label>
            <Select id="new-ticket-priority" v-model="newTicket.priority">
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
        </div>
        <DialogFooter>
          <DialogClose as-child>
            <Button variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose as-child>
            <Button type="submit" @click="() => useCreateMutate(newTicket)">
              <Plus :size="16" /> Create
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </form>
  </Dialog>

  <div class="mt-2">
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
  </div>
</template>

<style scoped></style>
