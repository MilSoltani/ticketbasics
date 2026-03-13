<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import TicketEditCard from '@/components/tickets/TicketEditCard.vue';

const route = useRoute();
const ticketId = computed(() => Number(route.params.id));
</script>

<template>
  <TicketEditCard :ticket-id="ticketId" />
</template>

<style scoped>
</style>
