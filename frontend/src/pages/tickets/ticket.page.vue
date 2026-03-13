<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import TicketEditForm from '@/components/tickets/TicketEditForm.vue';

const route = useRoute();
const ticketId = computed(() => Number(route.params.id));
</script>

<template>
  <TicketEditForm :ticket-id="ticketId" />
</template>

<style scoped>
</style>
