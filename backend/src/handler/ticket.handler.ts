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
  .post('/', async (c) => {
    const body = await c.req.json();
    const result = ticketCreateSchema.safeParse(body);

    if (!result.success) {
      return c.json({ errors: result.error.flatten() }, 400);
    }

    const newTicket = await TicketRepository.create(result.data);

    return c.json({ data: newTicket }, 201);
  })
  .put('/:id', async (c) => {
    const id = Number(c.req.param('id'));

    if (Number.isNaN(id)) {
      return c.json({ message: 'Invalid ID' }, 400);
    }

    const body = await c.req.json();
    const result = ticketUpdateSchema.safeParse(body);

    if (!result.success) {
      return c.json({ errors: result.error.flatten() }, 400);
    }

    const updatedTicket = await TicketRepository.update(id, result.data);

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
