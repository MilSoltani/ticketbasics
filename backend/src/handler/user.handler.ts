import { zValidator } from '@hono/zod-validator';
import { UserCreateSchema, UserQuerySchema, UserUpdateSchema } from '@ticketbasics/zod-schemas';
import { Hono } from 'hono';

import { UserRepository } from '@/repository';

const userHandler = new Hono()
  .get('/', zValidator('query', UserQuerySchema), async (c) => {
    const query = c.req.valid('query');

    const result = await UserRepository.getAll(query);

    return c.json(result);
  })
  .get('/:id', async (c) => {
    const id = Number(c.req.param('id'));

    if (Number.isNaN(id)) {
      return c.json({ message: 'Invalid ID' }, 400);
    }

    const user = await UserRepository.getById(id);

    if (!user) {
      return c.json({ message: 'Not found' }, 404);
    }

    return c.json({ data: user });
  })
  .post('/', zValidator('json', UserCreateSchema), async (c) => {
    const data = c.req.valid('json');

    const newUser = await UserRepository.create(data);

    return c.json({ data: newUser }, 201);
  })
  .put('/:id', zValidator('json', UserUpdateSchema), async (c) => {
    const id = Number(c.req.param('id'));

    if (Number.isNaN(id)) {
      return c.json({ message: 'Invalid ID' }, 400);
    }

    const data = c.req.valid('json');

    const updatedUser = await UserRepository.update(id, data);

    if (!updatedUser) {
      return c.json({ message: 'Not found' }, 404);
    }

    return c.json({ data: updatedUser });
  })
  .delete('/:id', async (c) => {
    const id = Number(c.req.param('id'));

    if (Number.isNaN(id)) {
      return c.json({ message: 'Invalid ID' }, 400);
    }

    const deletedUser = await UserRepository.delete(id);

    if (!deletedUser) {
      return c.json({ message: 'Not found' }, 404);
    }

    return c.json({ data: deletedUser }, 200);
  });

export default userHandler;
