import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

import { ticketCreateSchema, ticketUpdateSchema } from '@/database/schema';
import { TicketRepository } from '@/repository/ticket.repository';

const ticketHandler = new Hono()
  .get('/', async (c) => {
    const tickets = await TicketRepository.getAll();

    return c.json({ data: tickets });
  })
  .get('/:id', async (c) => {
    const id = Number(c.req.param('id'));

    if (Number.isNaN(id)) {
      return c.json({ message: 'Invalid ID' }, 400);
    }

    const ticket = await TicketRepository.getById(id);

    if (!ticket) {
      return c.json({ message: 'Not found' }, 404);
    }

    return c.json({ data: ticket });
  })
  .post('/', zValidator('json', ticketCreateSchema), async (c) => {
    const data = await c.req.valid('json');

    const newTicket = await TicketRepository.create(data);

    return c.json({ data: newTicket }, 201);
  })
  .put('/:id', zValidator('json', ticketUpdateSchema), async (c) => {
    const id = Number(c.req.param('id'));

    if (Number.isNaN(id)) {
      return c.json({ message: 'Invalid ID' }, 400);
    }

    const data = await c.req.valid('json');

    const updatedTicket = await TicketRepository.update(id, data);

    if (!updatedTicket) {
      return c.json({ message: 'Not found' }, 404);
    }

    return c.json({ data: updatedTicket });
  })
  .delete('/tickets/:id', async (c) => {
    const id = Number(c.req.param('id'));

    if (Number.isNaN(id)) {
      return c.json({ message: 'Invalid ID' }, 400);
    }

    const deletedTicket = await TicketRepository.delete(id);

    if (!deletedTicket) {
      return c.json({ message: 'Not found' }, 404);
    }

    return c.status(204);
  });

export default ticketHandler;
