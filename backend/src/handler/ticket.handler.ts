import { zValidator } from '@hono/zod-validator';
import { TicketCreateSchema, TicketQuerySchema, TicketUpdateSchema } from '@ticketbasics/zod-schemas';
import { Hono } from 'hono';

import { TicketRepository } from '@/repository';

const ticketHandler = new Hono()
  .get('/', zValidator('query', TicketQuerySchema), async (c) => {
    const query = c.req.valid('query');

    const result = await TicketRepository.getAll(query);

    return c.json(result);
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
  .post('/', zValidator('json', TicketCreateSchema), async (c) => {
    const data = c.req.valid('json');

    const newTicket = await TicketRepository.create(data);

    return c.json({ data: newTicket }, 201);
  })
  .put('/:id', zValidator('json', TicketUpdateSchema), async (c) => {
    const id = Number(c.req.param('id'));

    if (Number.isNaN(id)) {
      return c.json({ message: 'Invalid ID' }, 400);
    }

    const data = c.req.valid('json');

    const updatedTicket = await TicketRepository.update(id, data);

    if (!updatedTicket) {
      return c.json({ message: 'Not found' }, 404);
    }

    return c.json({ data: updatedTicket });
  })
  .delete('/:id', async (c) => {
    const id = Number(c.req.param('id'));

    if (Number.isNaN(id)) {
      return c.json({ message: 'Invalid ID' }, 400);
    }

    const deletedTicket = await TicketRepository.delete(id);

    if (!deletedTicket) {
      return c.json({ message: 'Not found' }, 404);
    }

    return c.json({ data: deletedTicket }, 200);
  });

export default ticketHandler;
