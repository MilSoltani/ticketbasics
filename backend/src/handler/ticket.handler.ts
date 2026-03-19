import { TicketRepository } from '@backend/repository';
import { zValidator } from '@hono/zod-validator';
import { TicketCreateSchema, TicketQuerySchema, TicketUpdateSchema } from '@ticketbasics/zod-schemas';
import { Hono } from 'hono';

const ticketHandler = new Hono()
  .get('/', zValidator('query', TicketQuerySchema), async (c) => {
    const query = c.req.valid('query');

    const result = await TicketRepository.getAll(query);

    return c.json(result, 200);
  })
  .get('/:id', async (c) => {
    const id = Number(c.req.param('id'));

    const ticket = await TicketRepository.getById(id);

    if (!ticket) {
      return c.json({ message: 'Not found' }, 404);
    }

    return c.json({ data: ticket }, 200);
  })
  .post('/', zValidator('json', TicketCreateSchema), async (c) => {
    const data = c.req.valid('json');

    const newTicket = await TicketRepository.create(data);

    return c.json({ data: newTicket }, 201);
  })
  .put('/:id', zValidator('json', TicketUpdateSchema), async (c) => {
    const id = Number(c.req.param('id'));

    const data = c.req.valid('json');

    const updatedTicket = await TicketRepository.update(id, data);

    if (!updatedTicket) {
      return c.json({ message: 'Not found' }, 404);
    }

    return c.json({ data: updatedTicket }, 200);
  })
  .delete('/:id', async (c) => {
    const id = Number(c.req.param('id'));

    const deletedTicket = await TicketRepository.delete(id);

    if (!deletedTicket) {
      return c.json({ message: 'Not found' }, 404);
    }

    return c.json({ data: deletedTicket }, 200);
  });

export default ticketHandler;
