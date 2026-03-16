<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import UserEditCard from '@/components/users/UserEditCard.vue';

const route = useRoute();
const userId = computed(() => Number(route.params.id));
</script>

<template>
  <UserEditCard :user-id="userId" />
</template>

<style scoped>
</style>
