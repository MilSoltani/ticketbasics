<script setup lang="ts">
import { USER_SORT_OPTIONS } from '@ticketbasics/zod-schemas';

import TableSorter from '@/components/table/TableSorter.vue';
import TablePaginator from '@/components/TablePaginator.vue';
import UsersListCard from '@/components/users/UsersListCard.vue';
import { useGetAllUsers } from '@/queries';

const { data: users, pagination, setQuery, isLoading, error, isFetching } = useGetAllUsers({});
</script>

<template>
  <div class="mb-2 flex justify-between">
    <div class="flex justify-start gap-2">
      <TableSorter initial-sort="createdAt" initial-order="desc" :options="USER_SORT_OPTIONS" @change="setQuery" />
    </div>
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

  <UsersListCard :users="users" />

  <div v-if="pagination" class="my-2">
    <TablePaginator :pagination="pagination" @set-query="setQuery" />
  </div>
</template>

<style scoped>
</style>
