import { createRouter, createWebHistory } from 'vue-router';

import TicketPage from '@/pages/tickets/ticket.page.vue';
import TicketsPage from '@/pages/tickets/tickets.page.vue';
import UsersPage from '@/pages/users/users.page.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/tickets',
      component: TicketsPage,
      name: 'Tickets',
    },
    {
      path: '/tickets/:id',
      component: TicketPage,
      name: 'Ticket',
      meta: {
        parentName: 'Tickets',
        parentPath: '/tickets',
      },
    },
    {
      path: '/users',
      component: UsersPage,
      name: 'Users',
    },
  ],
});

export default router;
