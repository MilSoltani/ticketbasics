import { createRouter, createWebHistory } from 'vue-router';

import LoginPage from '@/pages/auth/login.page.vue';
import TicketPage from '@/pages/tickets/ticket.page.vue';
import TicketsPage from '@/pages/tickets/tickets.page.vue';
import UserPage from '@/pages/users/user.page.vue';
import UsersPage from '@/pages/users/users.page.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: LoginPage,
      name: 'Login',
    },
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
    {
      path: '/users/:id',
      component: UserPage,
      name: 'User',
      meta: {
        parentName: 'Users',
        parentPath: '/users',
      },
    },
  ],
});

export default router;
