<script setup lang="ts">
import type { User } from '@ticketbasics/zod-schemas';

import { MoreHorizontal } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

import Button from '@/components/ui/button/Button.vue';
import DropdownMenu from '@/components/ui/dropdown-menu/DropdownMenu.vue';
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue';
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue';
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue';
import Table from '@/components/ui/table/Table.vue';
import TableBody from '@/components/ui/table/TableBody.vue';
import TableCell from '@/components/ui/table/TableCell.vue';
import TableHead from '@/components/ui/table/TableHead.vue';
import TableHeader from '@/components/ui/table/TableHeader.vue';
import TableRow from '@/components/ui/table/TableRow.vue';
import { useDeleteUser } from '@/queries';

const props = withDefaults(defineProps<{
  users?: User[];
}>(), {
  users: () => [],
});

const router = useRouter();

const { mutate: deleteUser } = useDeleteUser();

function handleDelete(id: number) {
  deleteUser(id, {
    onSuccess: () => {
      toast.success('Deleted!');
    },
    onError: (error: any) => {
      const message = error?.message || error?.response?.data?.message || 'Failed to delete!';
      toast.error(message);
    },
  });
}
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
                Username
              </TableHead>
              <TableHead class="font-bold w-24">
                First Name
              </TableHead>
              <TableHead class="font-bold w-22">
                Last Name
              </TableHead>

              <TableHead class="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="user in props.users"
              :key="user.id"
              class="cursor-pointer"
              @click="router.push(`/users/${user.id}`)"
            >
              <TableCell class="py-4 text-muted-foreground">
                #{{ user.id }}
              </TableCell>

              <TableCell class="truncate max-w-0 py-4 font-bold">
                {{ user.username }}

                <div class="text-muted-foreground text-sm">
                  username - {{ user.createdAt }}
                </div>
              </TableCell>

              <TableCell class="py-4">
                {{ user.firstName }}
              </TableCell>
              <TableCell class="py-4">
                {{ user.lastName }}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button
                      variant="ghost"
                      class="p-0 w-8 h-8 data-[state=open]:bg-muted cursor-pointer"
                      @click.stop
                    >
                      <MoreHorizontal class="h-4 w-4" />
                      <span class="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" class="w-[160px]">
                    <DropdownMenuItem class="cursor-pointer" @click="handleDelete(user.id)">
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
