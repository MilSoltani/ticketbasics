import { createRouter, createWebHistory } from 'vue-router';

import TicketsPage from '@/pages/tickets.page.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/tickets',
      component: TicketsPage,
    },
  ],
});

export default router;
