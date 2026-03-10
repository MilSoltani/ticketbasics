<script setup lang="ts">
import { useRoute } from 'vue-router';

import { useGetTicketById } from '../api/use-tickets';

const route = useRoute();
const ticketId = Number(route.params.id);

const { data: ticket, isLoading, error, isFetching } = useGetTicketById(ticketId);
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

  <div v-else>
    <pre>{{ ticket }}</pre>
  </div>
</template>

<style scoped></style>
